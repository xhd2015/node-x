

export function iterLines<T>(s: string, fn: (start: number, end: number, s: string) => T): T[] {
    return iterMatch(s, (s, i) => s.indexOf("\n", i), fn)
}

export function iterMatch<T>(s: string, next: (s: string, i: number) => number, fn: (start: number, end: number, s: string) => T): T[] {
    let i = 0
    const res: T[] = []
    const n = s.length
    for (let i = 0; i < n;) {
        let idx = next(s, i)
        if (idx < 0) {
            idx = n
        }
        res.push(fn(i, idx, s))
        i = idx + 1
    }
    return res
}

export function trimPrefix(s: string, prefix: string): [s: string, ok: boolean] {
    if (s?.startsWith?.(prefix)) {
        return [s.slice(prefix.length), true]
    }
    return [s, false]
}
// function testIterLines() {
//     const s = "abcd\n\nee\nxxx\nee"
//     iterLines(s, (start, end) => {
//         console.log("found line: ", s.slice(start, end))
//     })
// }

// testIterLines()