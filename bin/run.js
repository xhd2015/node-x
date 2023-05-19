!function(e,n){if("object"==typeof exports&&"object"==typeof module)module.exports=n();else if("function"==typeof define&&define.amd)define([],n);else{var t=n();for(var o in t)("object"==typeof exports?exports:e)[o]=t[o]}}(globalThis,(()=>(()=>{"use strict";var e={258:(e,n)=>{Object.defineProperty(n,"__esModule",{value:!0}),n.formatWebpackConfigJS=n.formatTsConfigJSON=n.formatPackageJSON=void 0,n.formatPackageJSON=function(e){const n=e?.installMap||{},t={"@babel/cli":"^7.1.0","@babel/core":"^7.1.0","@babel/preset-env":"^7.1.0","babel-loader":"^8.1.0","file-loader":"^6.0.0","ts-loader":"^9.3.1","webpack-cli":"^4.10.0","@types/node":"^18.15.11"};Object.keys(n||{}).forEach((e=>{t[`@types/${e}`]="latest"}));const o={name:`${e?.name||"tmp"}`,version:"0.0.1",scripts:{build:"node ./node_modules/.bin/webpack --config webpack.config.js --progress --mode=production","build-dev":"node ./node_modules/.bin/webpack --config webpack.config.js --progress --mode=development",start:"npm install && npm run build && node bin/run.js"},dependencies:n,devDependencies:t};return JSON.stringify(o,null,"    ")},n.formatTsConfigJSON=function(e){const n={};return Object.keys(e?.importMap||{}).forEach((t=>{let o=e.importMap[t];o.endsWith("/")||(o+="/"),n[t+"/*"]=[o+"*"]})),`{\n        // Change this to match your project\n        // "include": [],\n        "compilerOptions": {\n            // Tells TypeScript to read JS files, as\n            // normally they are ignored as source files\n            // "allowJs": true,\n            // Generate d.ts files\n            // "declaration": true,\n            // This compiler run should\n            // only output d.ts files\n            // "emitDeclarationOnly": true,\n            // Types should go into this directory.\n            // Removing this would place the .d.ts files\n            // next to the .js files\n            //   "outDir": "dist"\n            "target": "ES2021",\n            "lib": [\n                "ES2021",\n                "ES2021.String"\n            ],\n            // "target": "es6",\n            "module": "commonjs",\n            // "module": "ES2015",\n            // "outDir": "src/debug",\n            "moduleResolution": "node",\n            "rootDirs": ["./"],\n            "paths": ${JSON.stringify(n)}\n        },\n        "exclude": []\n    }`},n.formatWebpackConfigJS=function(e){const n=[];return Object.keys(e?.importMap||{}).forEach((t=>{let o=e.importMap[t].trim();n.push(`"${t}": path.resolve(__dirname,"${o}")`)})),`const path = require("path");\n    \n    module.exports = {\n      entry: {\n        run: {\n          import: "./run.ts",\n          filename: "run.js",\n        },\n      },\n      output: {\n        path: path.resolve(__dirname, "bin"),\n        libraryTarget: "umd", // for nodejs need this\n        globalObject: "globalThis", // goja only recognize globalThis, not the default global.\n      },\n      module: {\n        rules: [\n          {\n            test: /.ts$/,\n            // exclude: /(node_modules)/,\n            use: {\n              loader: "ts-loader",\n              options: {\n                transpileOnly: true,\n              },\n            },\n          },\n          {\n            test: /.(js)$/,\n            exclude: /(node_modules)/,\n            resolve: {\n              extensions: [".ts", ".js"],\n            },\n            use: {\n              loader: "babel-loader",\n              options: {\n                presets: ["@babel/preset-env"],\n              },\n            },\n          },\n        ],\n      },\n      resolve: {\n        alias: ${"{"+n.join(",\n")+"}"},\n        extensions: [".ts", ".js"],\n      },\n      target: "node",\n      node:{\n        __filename:true,\n        __dirname:true,  // these two options make the __filename & __dirname correspond to original file name\n      },\n      plugins: [],\n      // devtool: "source-map",\n    };\n    `}},900:(e,n,t)=>{Object.defineProperty(n,"__esModule",{value:!0}),n.runCmd=n.parseOptions=n.runOutput=n.catchedRun=n.run=void 0;const o=t(81),r=t(265);async function s(e,n){const t=o.spawn("bash",[`-e${n?.debug?"x":""}c`,e,"--",...n?.args||[]],{cwd:n?.cwd,env:{...process.env,...n?.env}});n?.pipeStdin&&process.stdin.pipe(t.stdin,{end:!0}),t.stderr.on("data",(e=>process.stderr.write(e)));let r="";return n?.needStdout?t.stdout.on("data",(e=>r+=e)):t.stdout.on("data",(e=>process.stdout.write(e))),new Promise(((o,s)=>{t.on("error",(function(e){s(e)})),t.on("close",(function(t){if(0!==t){let o=n?.description;const r=100;if(!o)if(e.length<=r)o=e;else{const n=e.split("\n").map((e=>e.trim())).join("\n");o=n.length<=r?n:n.slice(0,r)+"..."}s(new Error(`exit code ${t}: ${o}`))}else o({exitCode:t,stdout:r})}))}))}Object.defineProperty(n,"parseOptions",{enumerable:!0,get:function(){return r.parse}}),n.run=s,n.runCmd=s,n.catchedRun=async function(e){e().catch((e=>{console.error(e?.message||e),process.exit(1)}))},n.runOutput=async function(e,n){return s(e,{...n,needStdout:!0}).then((e=>e.stdout.endsWith("\n")?e.stdout.slice(0,e.stdout.length-1):e.stdout))}},265:(e,n)=>{Object.defineProperty(n,"__esModule",{value:!0}),n.parse=void 0,n.parse=function(e,n,t,o){t&&(o||Array.isArray(t)||(t=(o=t)?.argv)),null==t&&(t=process.argv.slice(2));const r=n.split(/\s+/),s={},i={},l={},a=o?.stopAtfirstArg;for(let e of r){let n,t=e.lastIndexOf("=");-1!=t&&(n=e.slice(t+1),e=e.slice(0,t));let o="zero";e.endsWith("::")?(o="many",e=e.slice(0,e.length-2)):e.endsWith(":")&&(o="one",e=e.slice(0,e.length-1));const r=e.split(",");if(0==r.length)continue;const a=r[r.length-1];if(null!=i[a])throw new Error(`duplicate option name:${a}`);i[a]=o,n&&(l[a]=n);for(const e of r)if(0!=e.length){if(null!=s[e])throw new Error(`duplicate option name:${e}`);s[e]=a}}const c=[],d={},u={};let p=0;function f(e,n){let o=n===u;o&&(n=null);const r=s[e];if(!r)throw new Error(`no such option:${e}`);const a=l[r];if(a&&(d[a]=e),"zero"===i[r]){if(o)return void(d[r]=!0);if(null!=n)if("on"==n||"On"==n||"ON"==n||"true"==n||"True"==n||"TRUE"==n)d[r]=!0;else{if("off"!=n&&"Off"!=n&&"OFF"!=n&&"false"!=n&&"False"!=n&&"FALSE"!=n)throw new Error(`option requires no argument:${e},except on/On/ON/true/True/TRUE or off/Off/OFF/false/False/FALSE`);d[r]=!1}else d[r]=!0}else if("one"===i[r]){if(o&&(n=t[++p]),null==n)throw new Error(`option requires one argument:${e}`);d[r]=n}else{if("many"!==i[r])throw new Error(`unknown option repeat:${e} ${i[r]}`);if(o&&(n=t[++p]),null==n)throw new Error(`option requires argument:${e}`);null==d[r]?d[r]=[n]:d[r].push(n)}}for(;p<t.length;p++){const e=t[p];if("--"==e){c.push(...t.slice(p+1));break}if("-"!=e)if(e.startsWith("--")){let n=e.slice(2);const t=n.lastIndexOf("=");let o;-1!=t?(o=n.slice(t+1),n=n.slice(0,t)):o=u,f(n,o)}else if(e.startsWith("-")){const n=e.slice(1);if(1==n.length){f(n,u);continue}const t=n[0],o=s[t],r=i[o];if("one"==r||"many"==r)f(t,n.slice(1));else if("zero"==r){for(const e of n.slice(0,n.length-1))f(e,null);f(n[n.length-1],u)}}else{if(a){c.push(...t.slice(p));break}c.push(e)}else c.push(e)}function m(){let n=e;return n.startsWith("\n")&&(n=n.slice(1)),n.endsWith("\n")&&(n=n.slice(0,n.length-1)),n}return!0===d.help&&(console.log(m()),process.exit(0)),{args:c,options:d,getHelp:m}}},65:(e,n)=>{function t(e,n,t){const o=[],r=e.length;for(let s=0;s<r;){let i=n(e,s);i<0&&(i=r),o.push(t(s,i,e)),s=i+1}return o}Object.defineProperty(n,"__esModule",{value:!0}),n.addSuffix=n.trimSuffix=n.trimPrefix=n.iterMatch=n.iterLines=void 0,n.iterLines=function(e,n){return t(e,((e,n)=>e.indexOf("\n",n)),n)},n.iterMatch=t,n.trimPrefix=function(e,n){return e?.startsWith?.(n)?[e.slice(n.length),!0]:[e,!1]},n.trimSuffix=function(e,n){return e?.endsWith?.(n)?[e.slice(0,e.length-n.length),!0]:[e,!1]},n.addSuffix=function(e,n){return e.endsWith(n)?e:e+n}},650:(e,n)=>{Object.defineProperty(n,"__esModule",{value:!0}),n.files=void 0,n.files={},n.files["cmd.ts"]='//#!node-ext: install moment\n\nimport { run as runCmd, parseOptions } from "@node-ext/cmd"\nimport { resolveShellPath } from "@node-ext/env"\nimport path = require("path")\nimport dateFormat from \'dateformat\'\nimport { mkdir, readFile } from "fs/promises"\n\nconst help = `\nUsage: __CMD__ flush working\n       __CMD__ download working\n\nOptions:\n  -h, --help               help\n  -x, --debug              debug\n  -f, --force              force lock\n`\n\nexport interface Options {\n    help?: boolean\n    debug?: boolean\n}\n\nasync function run() {\n    // argv: [node, sync.js, ...]\n    const { args: [cmd, ...args], options } = parseOptions<Options>(help, "h,help x,debug f,force")\n    const { debug, force, pause } = options\n    if (!cmd) {\n        throw new Error("requires cmd")\n    }\n    if (cmd === \'flush\') {\n        // do flush\n    } else {\n        throw new Error(`unknown cmd: ${cmd}`)\n    }\n}\n\nrun().catch(e => {\n    console.error(e.message)\n    process.exit(1)\n})',n.files["cmd-with-config.ts"]='//#!node-ext: install moment\n\nimport { run as runCmd, parseOptions } from "@node-ext/cmd"\nimport { resolveShellPath } from "@node-ext/env"\nimport path = require("path")\nimport dateFormat from \'dateformat\'\nimport { mkdir, readFile } from "fs/promises"\n\nconst help = `\nUsage: __CMD__ flush working\n       __CMD__ download working\n\nOptions:\n  -h, --help               help\n  -x, --debug              debug\n  -f, --force              force lock\n`\n\nexport interface Config {\n    use?: string\n}\n\nasync function init() {\n    const cfgJSON = await readFile(resolveShellPath("~/.nx-sync.json"), { \'encoding\': \'utf-8\' }).catch(() => { })\n\n    let cfg: Config\n    try {\n        cfg = cfgJSON ? JSON.parse(cfgJSON as string) : null\n    } catch (e) {\n\n    }\n\n    // create ~/.nx-sync/\n    await mkdir(resolveShellPath("~/.nx-sync"), { recursive: true })\n}\n\nexport interface Options {\n    help?: boolean\n    debug?: boolean\n}\n\nasync function run() {\n    await init()\n\n    // argv: [node, sync.js, ...]\n    const { args: [cmd, ...args], options } = parseOptions<Options>(help, "h,help x,debug f,force")\n    const { debug, force, pause } = options\n    if (!cmd) {\n        throw new Error("requires cmd")\n    }\n    if (cmd === \'flush\') {\n        // do flush\n    } else {\n        throw new Error(`unknown cmd: ${cmd}`)\n    }\n}\n\nrun().catch(e => {\n    console.error(e.message)\n    process.exit(1)\n})'},81:e=>{e.exports=require("child_process")},113:e=>{e.exports=require("crypto")},292:e=>{e.exports=require("fs/promises")},37:e=>{e.exports=require("os")},17:e=>{e.exports=require("path")}},n={};function t(o){var r=n[o];if(void 0!==r)return r.exports;var s=n[o]={exports:{}};return e[o](s,s.exports,t),s.exports}var o={};return(()=>{var e=o;Object.defineProperty(e,"__esModule",{value:!0}),e.run=void 0;const n=t(17),r=t(292),s=t(37),i=t(258),l=t(900),a=t(113),c=t(65),d=t(650);async function u(){const e=process.env.NX_FLAGS;let t=[...process.argv.slice(2)];e&&(t=[...e.split(" ").map((e=>e.trim())),...t]);const{args:o,options:c}=(0,l.parseOptions)("Usage: nx [OPTIONS] <script> [--] [script-args...]\n\nOptions:\n  -h, --help          show help message\n  -p, --print-dir     print the generated directory\n      --root          print root directory and exit\n  -x, --debug         log debug info\n  -c, --code          open the directory with vscode\n  -f, --force         force install modules\n      --clean         clean the target dir before writing files\n      --rm            remove the target dir and exit\n      --keep-link     don't resolve the script if it is a link\n      --install       install dependencies and exit, i.e. run `npm install` in target directory\n      --mode=production|development    default mode: development\n      --template NAME used with nx create,by default cmd.ts is used. If NAME is list,list all available names\n\nSubcommands:\n  update            update nx\n  create FILE.ts    create a typescript file with given template          \n\nOnce installed with `npm install -g node-ext`, `nx` will be automatically linked to /usr/local/bin so you can just use `nx` to run scripts\n\nExample:\n  $ nx --help           # show help\n  $ nx test.ts          # run test.ts\n  $ nx -x test.ts       # run test.ts, with debug info\n  $ nx --code test.ts   # open the directory\n  $ nx update           # update node-ext version\n\nCompare with `ts-node`: you can also use `ts-node` to run typescript, e.g. `npx -g ts-node --transpile-only test.ts`.\nThe advantage that `nx` provides is it can provide default `webpack.config.js` and `tsconfg.json`,\nand with `--code` option we can edit ts files with vscode super easily.\n\n","h,help p,print-dir fast rebuild root x,debug c,code f,force clean rm keep-link install mode: template:",{argv:t,stopAtfirstArg:!0}),{debug:u,force:m,clean:h,rm:g,root:w,"print-dir":b,install:x,"keep-link":v,mode:y}=c;let O=c?.code;const[$,..._]=o,j=(0,s.tmpdir)(),k=n.join(j,"nx-sync");if(w)return void console.log(k);if(!$)throw new Error("requires script to run");if("update"===$)return void await(0,l.run)("npm remove -g node-ext; npm install -g node-ext",{debug:u});if("create"===$){if("list"===c.template){const e=Object.keys(d.files).map((e=>(e.endsWith(".ts")&&(e=e.slice(0,e.length-".ts".length)),e)));return void console.log(e.join("\n"))}if(!_?.[0])throw new Error("requires script name: nx create FILE");let e=!0;if(await r.stat(_[0]).catch((()=>{e=!1})),e)throw new Error(`file already exists: ${_[0]}`);let n=c.template;n||(n="cmd.ts");const t=d.files[n]||d.files[n+".ts"];if(!t)throw new Error(`template ${n} does not exist`);return await r.writeFile(_[0],t,{encoding:"utf-8"}),void await(0,l.run)(`nx --code ${_[0]}`)}let E=n.resolve($);if(!n.isAbsolute(E))throw new Error(`failed to make ${$} absolute, the resolved path is ${E}`);v||(E=await r.realpath(E));const S=await r.stat(E).catch((e=>{throw new Error(`not exists: ${$}`)}));let M=!1;if(S.isDirectory())O=!0,M=!0;else if(!S.isFile())throw new Error(`not a file: ${$}`);const P=M?E:n.dirname(E);if(!n.isAbsolute(P))throw new Error(`failed to detect absolute dir of ${$}, the resolved dir is ${P}`);if(P===k||P.startsWith(k))throw new Error(`${$} resides in nx-sync dir: ${k}, try another location`);const[T,F]=await Promise.all([M?null:p(E),(0,l.runOutput)("npm -g root")]),C={};Object.keys(T?.installMap||{}).forEach((e=>{C[e]=`./node_modules/${e}`}));const N={...f(T?.importMap,F),...C,"@":"./","@node-ext":n.resolve(F,"node-ext/lib")},W=n.join(k,P);if(u&&console.error("target dir:",W),(h||g)&&(await r.rm(W,{recursive:!0}),g))return;await r.mkdir(W,{recursive:!0});const J=(0,i.formatPackageJSON)({name:"tmp",installMap:T?.installMap}),q=(0,i.formatTsConfigJSON)({importMap:N}),A=(0,i.formatWebpackConfigJS)({importMap:N}),D="package.json.checksum",R=m?"":await r.readFile(n.join(W,D),{encoding:"utf-8"}).catch((e=>{})),I=(0,a.createHash)("md5").update(J).digest("hex"),L={"package.json":J,[D]:I,"tsconfig.json":q,"webpack.config.js":A};if(M||(L["run.ts"]=`import "${E}"`),await Promise.all([...Object.keys(L).map((e=>r.writeFile(n.join(W,e),L[e]))),(0,l.run)(`rm -rf "${W}/src" ; ln -s "${P}" "${W}/src"`,{debug:u})]),b)return void console.log(W);if(O){const e=M?"":`--goto "${W}/src/${n.basename(E)}"`;return void await(0,l.run)(`code ${e} "${W}"`,{debug:u})}if(x)return void await(0,l.run)("npm install --no-audit --no-fund",{debug:u,cwd:W});let G=m||""===R||c?.rebuild||!c?.fast&&R!==I;if(!G){let e=!1;await r.stat(n.join(W,"node_modules")).then((n=>e=n.isDirectory())).catch((e=>{})),G=!e}let U=m||c?.rebuild||!c?.fast;const z="npm run "+("production"===y?"build":"build-dev"),H=c?.rebuild||u?"":"&>/dev/null";await(0,l.run)(`\n    set -e\n    (\n        cd "$TARGET_DIR"\n        ${G?"npm install --no-audit --no-fund "+H:""}  # npm install is slow so we need a checksum to avoid repeat\n        ${U?`${z} ${H} ;`:""} # dev mode webpack can use build cache\n    )\n    ${c?.rebuild?"":' node "$TARGET_DIR/bin/run.js" "$@"'}\n    `,{debug:u,args:_,env:{TARGET_DIR:W},pipeStdin:!0}).catch((e=>{u&&console.error(e?.message||e),process.exit(1)}))}async function p(e){const n=(s=await r.readFile(e,{encoding:"utf-8"}),(0,c.iterLines)(s,((e,n)=>{const t=s.slice(e,n);if(t.startsWith(m))return t.slice(m.length).trim()})).filter((e=>e))),t={},o={};var s;return n?.forEach?.((e=>{if(e.startsWith("#"))return;let[n,r]=(0,c.trimPrefix)(e,"use ");if(r){let[o,r]=n.split(" ",2);if(o=o.trim(),r=r.trim(),!o||!r)throw new Error(`invalid ${e}: requires name or dir`);t[o]=r}else[n,r]=(0,c.trimPrefix)(e,"install "),r&&n.split(" ").map((e=>e.trim())).map((e=>e.split("@",2))).filter((e=>e[0])).forEach((e=>o[e[0]]=e[1]||"latest"))})),{importMap:t,installMap:o}}function f(e,t){const o={};return Object.keys(e||{}).forEach((r=>{let s=e[r],[i,l]=(0,c.trimPrefix)(s,"$NPM_ROOT/");if(l)s=n.join(t,i);else{let[e,t]=(0,c.trimPrefix)(s,"~/");t&&(s=n.join(process.env.HOME,e))}o[r]=s})),o}e.run=u;const m="//!node-ext:";u().catch((e=>{console.error(e.message),process.exit(1)})).finally((()=>{}))})(),o})()));