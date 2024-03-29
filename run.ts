import * as path from "path"
import * as fs from "fs/promises"
import { tmpdir } from "os"
import { formatPackageJSON, formatTsConfigJSON, formatWebpackConfigJS, ImportMap, InstallMap } from "./create-template"
import { parseOptions, run as runCmd, runOutput } from "./lib/cmd"
import { createHash } from 'crypto'
import { ChildProcessWithoutNullStreams, spawn } from "child_process"
import { iterLines, trimPrefix } from "./lib/str"

import { debounce } from "lodash"
import { files as templateFiles } from "./template"
import * as chokidar from 'chokidar'

// You can set \`nx\` as an alias to \`node "$(npm -g root)/node-ext/bin/node-ext.js"\` to simplify the usage.
// NOTE: you must not use with npx: \`npx -g node-ext\`, npx simply does make \`npm install\` fails without fair reason.
// Setup:
//   $ npm install -g node-ext # install or upgrade to newest version
//   $ echo "alias nx='node \\"\\$(npm -g root)/node-ext/bin/node-ext.js\\"'" >> ~/.bash_profile

const help = `Usage: nx [OPTIONS] <script> [--] [script-args...]

Options:
  -h, --help          show help message
  -p, --print-dir     print the generated directory
      --root          print root directory and exit
  -x, --debug         log debug info
  -c, --code          open the directory with vscode
  -f, --force         force install modules
      --clean         clean the target dir before writing files
      --rm            remove the target dir and exit
      --keep-link     don't resolve the script if it is a link
      --install       install dependencies and exit, i.e. run \`npm install\` in target directory
      --mode=production|development    default mode: development
      --fast           skip npm install and webpack build, just run the script
      --rebuild        run npm install and webpack build
  -o, --output FILE    use with --rebuild, copy the target to FILE
      --watch          start webpack --watch
      --dev-watch FILE start webpack --watch, and trigger run when input FILE changes
      --dev-watch-run CMD   used with --dev-watch, by default invoking the script.If provided, will run it with the following variable set:
                            NX_INPUT the file to be watched
                            NX_RUN   the cmd that can be referenced      

Options for create:
      --template NAME  used with nx create,by default cmd.ts is used. If NAME is list,list all available names

Subcommands:
  update            update nx
  create FILE.ts    create a typescript file with given template,if no FILE, output to stdout         

Once installed with \`npm install -g node-ext\`, \`nx\` will be automatically linked to /usr/local/bin so you can just use \`nx\` to run scripts

Example:
  $ nx --help           # show help
  $ nx test.ts          # run test.ts
  $ nx -x test.ts       # run test.ts, with debug info
  $ nx --code test.ts   # open the directory
  $ nx update           # update node-ext version
  $ nx create

Compare with \`ts-node\`: you can also use \`ts-node\` to run typescript, e.g. \`npx -g ts-node --transpile-only test.ts\`.
The advantage that \`nx\` provides is it can provide default \`webpack.config.js\` and \`tsconfg.json\`,
and with \`--code\` option we can edit ts files with vscode super easily.

`

export interface Options {
    debug?: boolean
    code?: boolean // --code

    fast?: boolean // fast mode

    // rebuild the package
    rebuild?: boolean
    output?: string

    watch?: boolean
    "dev-watch"?: string
    "dev-watch-run"?: string

    clean?: boolean

    force?: boolean
    "print-dir"?: boolean
    help?: boolean
    rm?: boolean
    root?: boolean // print the root directory
    install?: boolean
    "keep-link"?: boolean
    mode?: "development" | "production"

    template?: string

}

// const debug = false
export async function run() {
    const nxFlags = process.env["NX_FLAGS"]
    let argv = [...process.argv.slice(2)]
    if (nxFlags) {
        const headFlags = nxFlags.split(" ").map(e => e.trim())
        argv = [...headFlags, ...argv]
    }
    const { args: parsedArgs, options } = parseOptions<Options>(help, "h,help p,print-dir fast rebuild o,output: watch dev-watch: dev-watch-run: root x,debug c,code f,force clean rm keep-link install mode: template:", { argv, stopAtFirstArg: true })
    // const { debug, code, force, clean, rm, root,"print-dir": printDir } = parseArgs(process.argv.slice(2))

    const devWatchFile = options?.["dev-watch"]
    const devWatch = !!devWatchFile
    if (devWatch && !devWatchFile) {
        throw new Error("requires dev-watch file")
    }
    // console.log("options:", options)
    const { debug, force, clean, rm, root, "print-dir": printDir, install, "keep-link": keepLink, mode } = options
    let code = options?.code
    const [script, ...args] = parsedArgs

    // const tmpDir = tmpdir()
    let nxHomeDir = ''
    if (process.env["NX_HOME"]) {
        nxHomeDir = process.env["NX_HOME"]
        await fs.mkdir(nxHomeDir, { recursive: true })
    } else if (process.env["HOME"]) {
        nxHomeDir = path.join(process.env["HOME"], ".nx")
        await fs.mkdir(nxHomeDir, { recursive: true })
    } else {
        nxHomeDir = tmpdir()
    }

    const syncDir = path.join(nxHomeDir, "nx-sync")
    if (root) {
        console.log(syncDir)
        return
    }
    if (!script) {
        throw new Error("requires script to run")
    }
    if (script === 'update') {
        await runCmd("npm remove -g node-ext; npm install -g node-ext", { debug })
        return
    } else if (script === 'create') {
        await handleCreate({
            template: options?.template,
            file: args?.[0],
            force: options?.force,
        })
        return
    }

    // find the dir of the target script
    let scriptPath = path.resolve(script)
    if (!path.isAbsolute(scriptPath)) {
        throw new Error(`failed to make ${script} absolute, the resolved path is ${scriptPath}`)
    }
    if (!keepLink) {
        // this will also validates the file exits
        scriptPath = await fs.realpath(scriptPath)
    }
    // the resolved path may not exists

    // console.log("scriptPath:", scriptPath)
    const scriptStat = await fs.stat(scriptPath).catch(e => {
        throw new Error(`not exists: ${script}`)
    })
    let skipFile = false
    let scriptAbsDir = scriptPath
    let linkDir = scriptPath
    if (scriptStat.isDirectory()) {
        // open existing
        code = true
        skipFile = true
    } else if (scriptStat.isFile()) {
        linkDir = path.dirname(scriptPath)
        scriptAbsDir = path.join(linkDir, toDirName(path.basename(scriptPath)))
    } else {
        throw new Error(`not a file: ${script}`)
    }

    // resolve abs dir
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
    let devWatchAbsFile = devWatchFile
    let tryCreateDevWatchFile = false
    if (devWatchFile && !path.isAbsolute(devWatchAbsFile)) {
        devWatchAbsFile = path.join(targetDir, devWatchFile)
        tryCreateDevWatchFile = true
    }

    let prevChecksum: string
    let packageJSONSum: string

    let needWriteFiles = !options?.fast
    if (needWriteFiles) {
        // install instructions
        const [fileInstr, npmRoot] = await Promise.all([skipFile ? null : parseFileInstructions(scriptPath), runOutput("npm -g root")])

        const installImportMap = {}
        Object.keys(fileInstr?.installMap || {}).forEach(pkg => {
            installImportMap[pkg] = `./node_modules/${pkg}`
        })
        const importMap: ImportMap = {
            ...normalizeImportDir(fileInstr?.importMap, npmRoot),
            ...installImportMap,
            "@": "./",
            "@node-ext": path.resolve(npmRoot, "node-ext/lib"),
        }

        if (clean || rm) {
            await fs.rm(targetDir, { recursive: true })
            if (rm) {
                return
            }
        }
        await fs.mkdir(targetDir, { recursive: true })

        // create the templates
        const packageJSON = formatPackageJSON({ name: "tmp", installMap: fileInstr?.installMap })
        const tsConfigJSON = formatTsConfigJSON({ importMap })
        const webpackConfigJS = formatWebpackConfigJS({ importMap })

        // the __dirname is bin
        // console.log("__dirname:", __dirname)
        // const libDir = path.resolve(__dirname, "../lib")
        // const cmdTS = await fs.readFile(path.resolve(__dirname, "../cmd.ts"))

        const checksumFile = "package.json.checksum"
        prevChecksum = force ? "" : await fs.readFile(path.join(targetDir, checksumFile), { encoding: "utf-8" }).catch(e => { return "" })
        packageJSONSum = createHash("md5").update(packageJSON).digest("hex")

        const files = {
            "package.json": packageJSON,
            [checksumFile]: packageJSONSum,
            "tsconfig.json": tsConfigJSON,
            "webpack.config.js": webpackConfigJS,
        }
        if (!skipFile) {
            // it must be a run.ts, not run.js to work out the missing tsconfig.json
            files["run.ts"] = `import "${scriptPath}"`
        }
        await Promise.all([
            ...Object.keys(files).map(file => fs.writeFile(path.join(targetDir, file), files[file])),
            // create link
            runCmd(`if [[ ! -e "${targetDir}/src" ]] ;then ln -sf "${linkDir}" "${targetDir}/src";fi`, { debug }),
            // NOTE: no need to copy libs, we use import map to point that lib
            // copy libs, its important to note here: cp with x/* instead of just x/, otherwise this command is not idepotent.
            // runCmd(`mkdir -p "${targetDir}/lib/" && cp -R "${libDir}"/* "${targetDir}/lib/"`, { debug }),
        ])
    }

    if (printDir) {
        console.log(targetDir)
        return
    }
    if (code) {
        const gotoOption = skipFile ? "" : `--goto "${targetDir}/src/${path.basename(scriptPath)}"`
        await runCmd(`code ${gotoOption} "${targetDir}"`, { debug })
        return
    }
    if (install) {
        await runCmd(`npm install --no-audit --no-fund`, { debug, cwd: targetDir })
        return
    }
    let needNpmInstall = false
    if (!options?.fast) {
        needNpmInstall = force || prevChecksum === "" || options?.rebuild || prevChecksum !== packageJSONSum
        // check if need install by checking node_modules
        if (!needNpmInstall) {
            // check node_modules
            let dirExists = false
            await fs.stat(path.join(targetDir, "node_modules")).then(e => dirExists = e.isDirectory()).catch(e => { })
            needNpmInstall = !dirExists
        }
    }

    let installRedirect = (debug || options?.rebuild) ? "" : "&>/dev/null"

    let needBuild = !options?.fast || force || options?.rebuild

    let needTargetCmd = !(options?.rebuild || options?.watch || devWatch)

    let buildSubCmd = "build"
    let buildRedirect = ""
    if (options?.watch || devWatch) {
        buildSubCmd = mode === "production" ? "watch" : "watch-dev"
        if (devWatch && !options?.debug) {
            buildRedirect = "&>/dev/null"
        }
    } else {
        buildSubCmd = mode === 'production' ? "build" : "build-dev"
        if (!(options?.rebuild || options?.debug)) {
            buildRedirect = "&>/dev/null"
        }
    }

    const buildCmd = `npm run ${buildSubCmd}`
    const targetCmd = `node "$TARGET_DIR/bin/run.js" "$@"`

    const actions = []

    const needCopyOutput = options?.rebuild && options?.output

    // why not cwd=TARGET_DIR? becuase we want cwd be where the user is
    const commonOpts = { debug, args, env: { TARGET_DIR: targetDir } }
    if (needCopyOutput) {
        commonOpts.env["REBUILD_OUTPUT"] = options.output
    }

    const watchAndRunTarget = runCmd(`
    set -eu
    (
        cd "$TARGET_DIR"
        ${needNpmInstall ? "npm install --no-audit --no-fund " + installRedirect : ""}  # npm install is slow so we need a checksum to avoid repeat
        ${needBuild ? `${buildCmd} ${buildRedirect} ;` : ''} # dev mode webpack can use build cache
    )
    ${needCopyOutput ? 'cp "$TARGET_DIR/bin/run.js" "$REBUILD_OUTPUT"' : ''}
    ${needTargetCmd ? targetCmd : ''}
    `, {
        ...commonOpts,
        stdin: needTargetCmd && process.stdin,
    }).catch(e => {
        if (debug) {
            console.error(e?.message || e)
        }
        process.exit(1)
    })
    actions.push(watchAndRunTarget)
    if (devWatch) {
        // ensure parent dir created
        await fs.mkdir(path.dirname(devWatchAbsFile), { recursive: true });
        if (tryCreateDevWatchFile) {
            let exists = true
            await fs.stat(devWatchAbsFile).catch(() => {
                exists = false
            })
            if (!exists) {
                // console.log("creating dev watch file:", devWatchFile)
                await fs.writeFile(devWatchAbsFile, "", { encoding: 'utf-8' })
            }
        }

        // watch
        let lastPs: ChildProcessWithoutNullStreams
        let lastStdin: fs.FileHandle
        const clear = async () => {
            if (lastPs) {
                lastPs.kill()
                lastPs = undefined
            }
            // if (lastStdin) {
            // gc will close it
            // await lastStdin.close()
            // lastStdin = undefined
            // }
        }

        const runJs = path.join(targetDir, "bin", "run.js")

        let subOpts = { ...commonOpts }
        let subCmd = targetCmd
        if (options?.["dev-watch-run"]) {
            subOpts.env = {
                ...subOpts.env,
                "NX_INPUT": devWatchAbsFile,
                "NX_CMD": `node ${runJs}`,
            } as any
            subCmd = options?.["dev-watch-run"]
        }
        const runTargetCmdRaw = async () => {
            if (debug) {
                console.log("DEBUG run dev watch")
            }
            await clear()

            await fs.open(devWatchAbsFile).then(e => lastStdin = e).catch(() => { /*ignore*/ })
            await runCmd(`set -eu
            ${subCmd}
            `, {
                ...subOpts,
                stdin: lastStdin.createReadStream(),
                onCreated(ps) {
                    lastPs = ps
                }
            }).catch(e => {
                if (options?.debug) {
                    console.error("DEBUG cmd err:", e)
                }
            })
        }
        const runTargetCmd = debounce(runTargetCmdRaw, 400)

        const watcher = chokidar.watch([devWatchAbsFile, runJs])
        runTargetCmd()
        // initial delay 3s
        await new Promise(resolve => setTimeout(resolve, 3000))

        watcher.on('all', runTargetCmd)
        process.on('exit', () => {
            clear()
        })
        // never return
        await new Promise(resolve => { })
    }
    await Promise.all(actions)
}

export function toDirName(fileName: string): string {
    return fileName.replaceAll(/[,?\/\n ()\\+&*^$#@!\\\.]/g, "_")
}

interface CreateOptions {
    template?: string
    file?: string
    force?: boolean
    varMap?: { [key: string]: string }
}
async function handleCreate(options?: CreateOptions) {
    const file = options?.file
    if (options.template === 'list') {
        const templates = Object.keys(templateFiles).map(e => {
            if (e.endsWith(".ts")) {
                e = e.slice(0, e.length - ".ts".length)
            }
            return e
        })
        console.log(templates.join("\n"))
        return
    }
    if (file) {
        if (!options?.force) {
            let exists = true
            await fs.stat(file).catch(() => {
                exists = false
            })
            if (exists) {
                throw new Error(`file already exists: ${file}`)
            }
        } else {
            await fs.mkdir(path.dirname(file), { recursive: true })
        }
    }

    let name = options.template
    if (!name) {
        name = "cmd.ts"
    }
    const content = templateFiles[name] || templateFiles[name + ".ts"]
    if (!content) {
        throw new Error(`template ${name} does not exist`)
    }
    if (file) {
        await fs.writeFile(file, content, { encoding: "utf-8" })
        await runCmd(`nx --code ${file}`)
    } else {
        console.log(content)
    }
}
interface FileInstructions {
    importMap: ImportMap
    installMap: InstallMap
}
async function parseFileInstructions(file: string): Promise<FileInstructions> {
    const s = await fs.readFile(file, { 'encoding': 'utf-8' })
    const instrs = parseInstructions(s)
    const importMap: ImportMap = {}
    const installMap: InstallMap = {}
    instrs?.forEach?.(inst => {
        if (inst.startsWith("#")) {
            return
        }
        let [s, ok] = trimPrefix(inst, "use ")
        if (ok) {
            let [name, dir] = s.split(" ", 2)
            name = name.trim()
            dir = dir.trim()
            if (!name || !dir) {
                throw new Error(`invalid ${inst}: requires name or dir`)
            }
            importMap[name] = dir
            return
        }
        [s, ok] = trimPrefix(inst, "install ")
        if (ok) {
            const list = s.split(" ").map(e => e.trim()).map(e => e.split("@", 2)).filter(e => e[0])
            list.forEach(e => installMap[e[0]] = e[1] || "latest")
            return
        }
    })
    return { importMap, installMap }
}

function normalizeImportDir(importMap: ImportMap, npmGolbalRoot): ImportMap {
    const m: ImportMap = {}
    Object.keys(importMap || {}).forEach(name => {
        let dir = importMap[name]
        let [s, ok] = trimPrefix(dir, "$NPM_ROOT/")
        if (ok) {
            dir = path.join(npmGolbalRoot, s)
        } else {
            let [s, ok] = trimPrefix(dir, "~/")
            if (ok) {
                dir = path.join(process.env["HOME"], s)
            }
        }
        m[name] = dir
    })
    return m
}

const prefix = "//!node-ext:"
function parseInstructions(s: string): string[] {
    return iterLines<string>(s, (i, j) => {
        const line = s.slice(i, j)
        if (!line.startsWith(prefix)) {
            return
        }
        return line.slice(prefix.length).trim()
    }).filter(e => e)
}

// a nice way to escape builtin webpack?

// native module requires fsevents.node, cannot be used webpack
run().catch(e => {
    // console.error(e) // with trace
    console.error(e.message)
    process.exit(1)
}).finally(() => {
    // sometimes the terminal get stuck, but resume does not work
    // process.stdout.resume()
    // process.stderr.resume()
})
