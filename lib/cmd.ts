
import * as child_process from "child_process"
import { parse as parseOptions } from "./options"

export interface RunOptions {
    cwd?: string
    debug?: boolean
    args?: string[]
    env?: { [env: string]: string }
}

// return exit code
export async function run(cmd: string, opts?: RunOptions): Promise<number> {
    const ps = child_process.spawn("bash", [`-e${opts?.debug ? "x" : ""}c`, cmd, "--", ...(opts?.args || [])], {
        cwd: opts?.cwd,
        env: { ...process.env, ...opts?.env },
    })
    ps.stdout.on('data', e => process.stdout.write(e))
    ps.stderr.on('data', e => process.stderr.write(e))

    return new Promise((resolve, reject) => {
        ps.on('error', function (e) {
            reject(e)
        })
        ps.on('close', function (code) {
            if (code !== 0) {
                reject(new Error(`exit code: ${code}`))
            } else {
                resolve(code)
            }
        })
    })
}

export {
    parseOptions
}