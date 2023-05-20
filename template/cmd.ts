//#!node-ext: install moment

import { run as runCmd, parseOptions } from "@node-ext/cmd"
import { resolveShellPath } from "@node-ext/env"
import path = require("path")
import moment from 'moment'
import { mkdir, readFile } from "fs/promises"

const help = `
Usage: __CMD__ flush working
       __CMD__ download working

Options:
  -h, --help               help

Examples:
  $ 
`

export interface Options {
}

async function run() {
    // argv: [node, sync.js, ...]
    const { args: [cmd, ...args], options } = parseOptions<Options>(help, "h,help", { stopAtFirstArg: true })
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