// when running postinstall after npm install
// the directory is set to the package's root
import { join } from "path"
import { catchedRun } from "./lib/cmd"
import { getNpmGlobalRoot as npmGlobalRoot, linkToPath } from "./lib/install"

async function run() {
    const npmRoot = await npmGlobalRoot()

    await linkToPath("nx", join(npmRoot, "node-ext/bin/nx"), { debug: true })
}

catchedRun(run)