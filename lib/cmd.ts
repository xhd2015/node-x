
import * as child_process from "child_process"
import { parse as parseOptions } from "./options"

export interface RunOptions {
    cwd?: string
    debug?: boolean
    args?: string[]
    env?: { [env: string]: string }
    description?: string // description text for error message
    needStdout?: boolean
    pipeStdin?: boolean
}

// return exit code
export async function run(cmd: string, opts?: RunOptions): Promise<{ exitCode: number, stdout?: string }> {
    const ps = child_process.spawn("bash", [`-e${opts?.debug ? "x" : ""}c`, cmd, "--", ...(opts?.args || [])], {
        cwd: opts?.cwd,
        env: { ...process.env, ...opts?.env },
    })
    if (opts?.pipeStdin) {
        process.stdin.pipe(ps.stdin, { end: true })
    }
    ps.stderr.on('data', e => process.stderr.write(e))
    let stdout = ''
    if (opts?.needStdout) {
        ps.stdout.on('data', e => stdout += e)
    } else {
        ps.stdout.on('data', e => process.stdout.write(e))
    }

    return new Promise((resolve, reject) => {
        ps.on('error', function (e) {
            // console.log("on error:", e)
            reject(e)
        })
        ps.on('close', function (code) {
            if (code !== 0) {
                let description = opts?.description
                const limit = 100
                if (!description) {
                    if (cmd.length <= limit) {
                        description = cmd
                    } else {
                        const cmdStr = cmd.split("\n").map(line => line.trim()).join("\n")
                        if (cmdStr.length <= limit) {
                            description = cmdStr
                        } else {
                            description = cmdStr.slice(0, limit) + "..."
                        }
                    }
                }
                const errMsg = `exit code ${code}: ${description}`
                reject(new Error(errMsg))
            } else {
                resolve({ exitCode: code, stdout })
            }
        })
    })
}

export async function catchedRun(fn: () => Promise<void>) {
    fn().catch(e => {
        console.error(e?.message || e)
        process.exit(1)
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
    parseOptions,
    run as runCmd,
}