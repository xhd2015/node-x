

import { run } from "@node-ext/cmd"
import { pwd } from "@node-ext/shell"

// example:
//#!node-ext: install a c@1.2.0
//#!node-ext: use s ~/Scripts

console.log("hello world")

console.log("pwd:", pwd())


run("echo hello")