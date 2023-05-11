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

export interface Options {
    help?: boolean
    debug?: boolean
}

async function run() {
    // argv: [node, sync.js, ...]
    const { args, options } = parseOptions<Options>(help, "h,help x,debug f,force a", { stopAtFirstArg: true })
    console.log("args:", args)
}

run().catch(e => {
    console.error(e.message)
    process.exit(1)
})