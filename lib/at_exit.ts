

const atExists: Function[] = []

export function atExit(f: Function) {
    atExists.push(f)
}

process.on('exit', () => {
    atExists.forEach(f => {
        f()
    })
})