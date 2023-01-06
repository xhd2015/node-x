import { join } from "path"

export function resolveShellPath(s: string): string {
    if (s === '~') {
        return process.env["HOME"]
    }
    if (s.startsWith("~/")) {
        return join(process.env["HOME"], s.slice("~/".length))
    }
    return s
}