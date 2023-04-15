//#!node-ext: install moment

import { run as runCmd, parseOptions } from "@node-ext/cmd"
import { resolveShellPath } from "@node-ext/env"
import path = require("path")
import dateFormat from 'dateformat'
import { mkdir, readFile } from "fs/promises"

const help = `
Usage: __CMD__ flush working
       __CMD__ download working

Options:
  -h, --help               help
  -x, --debug              debug
  -f, --force              force lock
`

export interface Config {
    use?: string
}

async function init() {
    const cfgJSON = await readFile(resolveShellPath("~/.nx-sync.json"), { 'encoding': 'utf-8' }).catch(() => { })

    let cfg: Config
    try {
        cfg = cfgJSON ? JSON.parse(cfgJSON as string) : null
    } catch (e) {

    }

    // create ~/.nx-sync/
    await mkdir(resolveShellPath("~/.nx-sync"), { recursive: true })
}

export interface Options {
    help?: boolean
    debug?: boolean
}

async function run() {
    await init()

    // argv: [node, sync.js, ...]
    const { args: [cmd, ...args], options } = parseOptions<Options>(help, "h,help x,debug f,force")
    const { debug, force, pause } = options
    if (!cmd) {
        throw new Error("requires cmd")
    }
    if (cmd === 'flush') {
        // do flush
    } else {
        throw new Error(`unknown cmd: ${cmd}`)
    }
}

run().catch(e => {
    console.error(e.message)
    process.exit(1)
})