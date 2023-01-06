#!/usr/bin/env node

// the problem with npx -g:
//   the spanwed shell: npm install, won't work as expected
// so we replace with  node ...
//
// require("./run.js");


require("./run.js");

//
//
// NOTE: the following implementation does not work
// as long as we are using npx, the problem won't be solved.
if(true){
   return
}

const {spawn} = require("child_process");
const path=require("path")

// console.log(process.argv) => [node,xxx.js,...]
const args = process.argv.slice(2)
// const ps=spawn("node",[path.join(__dirname,"run.js"),...args])

const ps=spawn("bash",["-c",`node ${path.join(__dirname,"run.js")} "$@"`,"--",...args])

ps.stdout.on("data", e => process.stdout.write(e))
ps.stderr.on("data", e => process.stderr.write(e))


ps.on('error', e=>{ console.error(e.message);process.exit(1); })
ps.on('close', function (code) {
    if (code !== 0) {
//        console.error(`exit code: ${code}`)
        process.exit(code)
    }
})

