
import * as child_process from "child_process"
import { parse as parseOptions } from "./options"

export interface RunOptions {
    cwd?: string
    debug?: boolean
    args?: string[]
    env?: { [env: string]: string }
    needStdout?: boolean
}

// return exit code
export async function run(cmd: string, opts?: RunOptions): Promise<{ exitCode: number, stdout?: string }> {
    const ps = child_process.spawn("bash", [`-e${opts?.debug ? "x" : ""}c`, cmd, "--", ...(opts?.args || [])], {
        cwd: opts?.cwd,
        env: { ...process.env, ...opts?.env },
    })
    ps.stderr.on('data', e => process.stderr.write(e))
    let stdout = ''
    if (opts?.needStdout) {
        ps.stdout.on('data', e => stdout += e)
    } else {
        ps.stdout.on('data', e => process.stdout.write(e))
    }


    return new Promise((resolve, reject) => {
        ps.on('error', function (e) {
            reject(e)
        })
        ps.on('close', function (code) {
            if (code !== 0) {
                reject(new Error(`exit code: ${code}`))
            } else {
                resolve({ exitCode: code, stdout })
            }
        })
    })
}

export async function runOutput(cmd: string, opts?: RunOptions): Promise<string> {
    return run(cmd, { ...opts, needStdout: true }).then(e => {
        if (e.stdout.endsWith("\n")) {
            return e.stdout.slice(0, e.stdout.length - 1)
        }
        return e.stdout
    })
}

export {
    parseOptions
}