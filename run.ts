import * as path from "path"
import * as fs from "fs/promises"
import { tmpdir } from "os"
import { formatPackageJSON, formatTsConfigJSON, formatWebpackConfigJS } from "./create-template"
import { run as runCmd } from "./cmd"
import { createHash } from 'crypto'

const debug = process.env["DEBUG"] == "true"
// const debug = false
export async function run() {
    // argv: [node, run.js, ...]
    const [script, ...args] = process.argv.slice(2)
    if (!script) {
        throw new Error("requires script to run")
    }

    // find the dir of the target script
    const scriptPath = path.resolve(script)
    if (!path.isAbsolute(scriptPath)) {
        throw new Error(`failed to make ${script} absolute, the resolved path is ${scriptPath}`)
    }
    // the resolved path may not exists

    // console.log("scriptPath:", scriptPath)
    const scriptStat = await fs.stat(scriptPath)
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
        console.log("target dir:", targetDir)
    }
    await fs.mkdir(targetDir, { recursive: true })

    // create the templates
    const packageJSON = formatPackageJSON("tmp")
    const tsConfigJSON = formatTsConfigJSON()
    const webpackConfigJS = formatWebpackConfigJS()

    const checksumFile = "package.json.checksum"
    const prevChecksum = await fs.readFile(path.join(targetDir, checksumFile), { encoding: "utf-8" }).catch(e => { })
    const packageJSONSum = createHash("md5").update(packageJSON).digest("hex")


    const files = {
        "run.ts": `import "${scriptPath}";`, // it must be a run.ts, not run.js to work out the missing tsconfig.json
        "package.json": packageJSON,
        [checksumFile]: packageJSONSum,
        "tsconfig.json": tsConfigJSON,
        "webpack.config.js": webpackConfigJS,
    }
    await Promise.all(Object.keys(files).map(file => fs.writeFile(path.join(targetDir, file), files[file])))

    const redirect = debug ? "&>/dev/null" : "";
    await runCmd(`
    set -e
    (
        cd "$TARGET_DIR"
        if [ $NEED_INSTALL == true ];then npm install ${redirect} ; fi ;# slow
        npm run build-dev ${redirect} ; # dev mode webpack can use build cache
    )
    node "$TARGET_DIR/bin/run.js" "$@"
    `, {
        debug,
        args: args,
        env: {
            "TARGET_DIR": targetDir,
            "NEED_INSTALL": String(prevChecksum !== packageJSONSum),
        }
    })
}

run().catch(e => {
    console.error(e.message)
    process.exit(1)
})