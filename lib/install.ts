

// when running postinstall after npm install
// the directory is set to the package's root
import { readFile, writeFile } from "fs/promises"
import { runCmd, RunOptions, runOutput } from "./cmd"
import { resolveShellPath } from "./env"
import { addSuffix } from "./str"

// add line to profile if profile exists
export async function addToPath(profile: string, line: string): Promise<boolean> {
    const content = await readFile(profile, { encoding: 'utf-8' }).catch(e => { })
    if (!content) {
        return false
    }
    if (content.includes(line)) {
        return false
    }
    await writeFile(profile, addSuffix(content, "\n") + line + "\n")
    return true
}

export const commonProfiles = ["~/.bashrc", "~/.bash_profile", "~/.zshrc", "~/.profile"]
export async function addToCommonProfiles(line: string): Promise<string[]> {
    const res = []
    await Promise.all(commonProfiles.map(async p => {
        const updated = await addToPath(resolveShellPath(p), line)
        if (updated) {
            res.push(p)
        }
    }))
    return res
}

export async function getNpmGlobalRoot(): Promise<string> {
    return await runOutput(`npm -g root || true`)
}

// pwd;{ if [[ -d /usr/local/bin && ! -e /usr/local/bin/nx ]];then ln -sf \"$(npm -g root)/node-ext/bin/nx\" /usr/local/bin/nx;fi } || true
export async function linkToPath(name: string, file: string, opts?: RunOptions) {
    if (!name) {
        throw new Error("requires name")
    }
    if (!file) {
        throw new Error("requires file")
    }
    const paths = (process.env["PATH"] || "").split(":")

    // try to link to /usr/local/bin
    if (paths.includes("/usr/local/bin")) {
        let ok = true
        await runCmd(`
        if [[ ! -d /usr/local/bin ]];then exit 1;fi
        
        # nx exists, and is not a link file, then do not replace
        if [[ -e "/usr/local/bin/${name}" && ! -L "/usr/local/bin/${name}" ]];then exit 1;fi

        ln -sf "${file}" "/usr/local/bin/${name}"
        `, opts).catch(() => ok = false)
        if (ok) {
            return
        }
    }

    // then install to ~/.nx/bin
    await runCmd(`
    mkdir -p ~/.nx/bin
    ln -sf "${file}" ~/.nx/bin/"${name}"
    `, opts)

    // already added
    if (paths.includes("~/.nx/bin") || paths.includes(resolveShellPath("~/.nx/bin"))) {
        return
    }
    const updated = await addToCommonProfiles("export PATH=~/.nx/bin:$PATH # nx")
    if (updated.length === 0) {
        return
    }
    console.log(`updated profiles: ${updated.join(",")}, please source profiles if needed`)
}