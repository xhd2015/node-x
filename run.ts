import * as path from "path"
import * as fs from "fs/promises"
import { tmpdir } from "os"
import { formatPackageJSON, formatTsConfigJSON, formatWebpackConfigJS } from "./create-template"
import { run as runCmd } from "./cmd"
import { createHash } from 'crypto'

export interface Options {
    script: string
    args: string[]
    debug?: boolean
    code?: boolean // --code

    clean?: boolean

    force?: boolean
    printDir?: boolean
    help?: boolean
}

function parseArgs(args: string[]): Options {
    const opts = { args: [] } as Options
    const n = args.length
    for (let i = 0; i < n; i++) {
        const arg = args[i]
        if (arg === '--') {
            opts.args.push(...args.slice(i + 1))
            break
        }
        if (arg === '-h' || arg === '--help') {
            opts.help = true
        } else if (arg === '-x' || arg === '--debug') {
            opts.debug = true
        } else if (arg === '-c' || arg === '--code') {
            opts.code = true
        } else if (arg === '-p' || arg === '--print-dir') {
            opts.printDir = true
        } else if (arg === '-f' || arg === '--force') {
            opts.force = true
        } else if (arg === '--clean') {
            opts.clean = true
        } else if (arg.startsWith("-")) {
            throw new Error(`unrecognized option: ${arg}`)
        } else {
            opts.args.push(arg)
        }
    }
    [opts.script, ...opts.args] = opts.args
    return opts
}
// const debug = false
export async function run() {
    // argv: [node, run.js, ...]
    const { script, args, debug, code, help, printDir, force, clean } = parseArgs(process.argv.slice(2))
    if (help) {
        console.log(`Usage: nx [OPTIONS] <script> [--] [script-args...]

Options:
  -h, --help        show help message
  -p, --print-dir   print the generated directory
  -x, --debug       log debug info
  -c, --code        open the directory with vscode
  -f, --force       force install modules
      --clean       clean the target dir before writing files

You can set \`nx\` as an alias to \`npx -g node-ext\` to simplify the usage.
Setup:
  $ npm install -g node-ext # install or upgrade to newest version
  $ echo "alias nx='npx -g node-ext'" >> ~/.bash_profile

Example:
  $ nx --help       # show help
  $ nx test.ts      # run test.ts
  $ nx -c test.ts   # open the directory
  $ nx update       # update node-ext version
`)
        return
    }
    if (!script) {
        throw new Error("requires script to run")
    }
    if (script === 'update') {
        await runCmd("npm install -g node-ext")
        return
    }

    // find the dir of the target script
    const scriptPath = path.resolve(script)
    if (!path.isAbsolute(scriptPath)) {
        throw new Error(`failed to make ${script} absolute, the resolved path is ${scriptPath}`)
    }
    // the resolved path may not exists

    // console.log("scriptPath:", scriptPath)
    const scriptStat = await fs.stat(scriptPath).catch(e => {
        throw new Error(`not exists: ${script}`)
    })
    if (!scriptStat.isFile()) {
        throw new Error(`not a file: ${script}`)
    }

    const tmpDir = tmpdir()
    const syncDir = path.join(tmpDir, "nx-sync")

    // resolve abs dir
    const scriptAbsDir = path.dirname(scriptPath)
    if (!path.isAbsolute(scriptAbsDir)) {
        throw new Error(`failed to detect absolute dir of ${script}, the resolved dir is ${scriptAbsDir}`)
    }
    if (scriptAbsDir === syncDir || scriptAbsDir.startsWith(syncDir)) {
        throw new Error(`${script} resides in nx-sync dir: ${syncDir}, try another location`)
    }

    const targetDir = path.join(syncDir, scriptAbsDir)
    if (debug) {
        console.error("target dir:", targetDir)
    }
    if (clean) {
        await fs.rm(targetDir, { recursive: true })
    }
    await fs.mkdir(targetDir, { recursive: true })


    // create the templates
    const packageJSON = formatPackageJSON("tmp")
    const tsConfigJSON = formatTsConfigJSON()
    const webpackConfigJS = formatWebpackConfigJS()

    // the __dirname is bin
    // console.log("__dirname:", __dirname)
    const cmdJs = await fs.readFile(path.join(__dirname, "cmd.js"))

    const checksumFile = "package.json.checksum"
    const prevChecksum = force ? "" : await fs.readFile(path.join(targetDir, checksumFile), { encoding: "utf-8" }).catch(e => { })
    const packageJSONSum = createHash("md5").update(packageJSON).digest("hex")

    const files = {
        // it must be a run.ts, not run.js to work out the missing tsconfig.json
        "run.ts": `
// some globals
import * as cmd from "./cmd.js"
globalThis.node_ext = { cmd }

import "${scriptPath}";
`,
        "package.json": packageJSON,
        [checksumFile]: packageJSONSum,
        "tsconfig.json": tsConfigJSON,
        "webpack.config.js": webpackConfigJS,
        "cmd.js": cmdJs,
    }
    await Promise.all(Object.keys(files).map(file => fs.writeFile(path.join(targetDir, file), files[file])))

    if (printDir) {
        console.log(targetDir)
        return
    }
    if (code) {
        await runCmd(`code --goto ${scriptPath}:1 ${targetDir}`)
        return
    }

    const redirect = debug ? "" : "&>/dev/null";
    await runCmd(`
    set -e
    (
        cd "$TARGET_DIR"
        if [[ ! -d node_modules || $NEED_INSTALL == true ]];then npm install ${redirect} ; fi ;# slow
        npm run build-dev ${redirect} ; # dev mode webpack can use build cache
    )
    node "$TARGET_DIR/bin/run.js" "$@"
    `, {
        debug,
        args: args,
        env: {
            "TARGET_DIR": targetDir,
            "NEED_INSTALL": String(force || prevChecksum !== packageJSONSum),
        }
    })
}

run().catch(e => {
    console.error(e.message)
    process.exit(1)
}).finally(() => {
    // sometimes the terminal get stuck, but resume does not work
    // process.stdout.resume()
    // process.stderr.resume()
})