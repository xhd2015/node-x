

import { atExit } from "@node-ext/at_exit"

atExit(() => {
    console.log("shit")
})


setInterval(() => {
    console.log("run...")
}, 1 * 1000)