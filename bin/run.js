!function(e,n){if("object"==typeof exports&&"object"==typeof module)module.exports=n();else if("function"==typeof define&&define.amd)define([],n);else{var t=n();for(var o in t)("object"==typeof exports?exports:e)[o]=t[o]}}(globalThis,(()=>(()=>{"use strict";var e={258:(e,n)=>{Object.defineProperty(n,"__esModule",{value:!0}),n.formatWebpackConfigJS=n.formatTsConfigJSON=n.formatPackageJSON=void 0,n.formatPackageJSON=function(e){const n=(null==e?void 0:e.installMap)||{};return`{\n        "name": "${(null==e?void 0:e.name)||"tmp"}",\n        "version": "0.0.1",\n        "scripts": {\n            "build": "webpack --config webpack.config.js --progress --mode=production",\n            "build-dev": "webpack --config webpack.config.js --progress --mode=development",\n            "start":"npm install && npm run build && node bin/run.js \\"$@\\""\n        },\n        "dependencies": ${JSON.stringify(n)} ,\n        "devDependencies": {\n            "@babel/cli": "^7.1.0",\n            "@babel/core": "^7.1.0",\n            "@babel/preset-env": "^7.1.0",\n            "@types/node": "^18.11.18",\n            "babel-loader": "^8.1.0",\n            "file-loader": "^6.0.0",\n            "ts-loader": "^9.3.1",\n            "webpack-cli": "^4.10.0"\n        }\n    }\n    `},n.formatTsConfigJSON=function(e){const n={};return Object.keys((null==e?void 0:e.importMap)||{}).forEach((t=>{let o=e.importMap[t];o.endsWith("/")||(o+="/"),n[t+"/*"]=[o+"*"]})),`{\n        // Change this to match your project\n        // "include": [],\n        "compilerOptions": {\n            // Tells TypeScript to read JS files, as\n            // normally they are ignored as source files\n            // "allowJs": true,\n            // Generate d.ts files\n            // "declaration": true,\n            // This compiler run should\n            // only output d.ts files\n            // "emitDeclarationOnly": true,\n            // Types should go into this directory.\n            // Removing this would place the .d.ts files\n            // next to the .js files\n            //   "outDir": "dist"\n            "target": "es6",\n            "lib": [\n                "ES2021",\n                "ES2021.String"\n            ],\n            // "target": "es6",\n            "module": "commonjs",\n            // "module": "ES2015",\n            // "outDir": "src/debug",\n            "moduleResolution": "node",\n            "rootDirs": ["./"],\n            "paths": ${JSON.stringify(n)}\n        },\n        "exclude": []\n    }`},n.formatWebpackConfigJS=function(e){const n=[];return Object.keys((null==e?void 0:e.importMap)||{}).forEach((t=>{let o=e.importMap[t].trim();n.push(`"${t}": path.resolve(__dirname,"${o}")`)})),`const path = require("path");\n    \n    module.exports = {\n      entry: {\n        run: {\n          import: "./run.ts",\n          filename: "run.js",\n        },\n      },\n      output: {\n        path: path.resolve(__dirname, "bin"),\n        libraryTarget: "umd", // for nodejs need this\n        globalObject: "globalThis", // goja only recognize globalThis, not the default global.\n      },\n      module: {\n        rules: [\n          {\n            test: /.ts$/,\n            // exclude: /(node_modules)/,\n            use: {\n              loader: "ts-loader",\n              options: {\n                transpileOnly: true,\n              },\n            },\n          },\n          {\n            test: /.(js)$/,\n            exclude: /(node_modules)/,\n            resolve: {\n              extensions: [".ts", ".js"],\n            },\n            use: {\n              loader: "babel-loader",\n              options: {\n                presets: ["@babel/preset-env"],\n              },\n            },\n          },\n        ],\n      },\n      resolve: {\n        alias: ${"{"+n.join(",\n")+"}"},\n        extensions: [".ts", ".js"],\n      },\n      target: "node",\n      node:{\n        __filename:true,\n        __dirname:true,  // these two options make the __filename & __dirname correspond to original file name\n      },\n      plugins: [],\n      // devtool: "source-map",\n    };\n    `}},900:function(e,n,t){var o=this&&this.__awaiter||function(e,n,t,o){return new(t||(t=Promise))((function(i,r){function s(e){try{a(o.next(e))}catch(e){r(e)}}function l(e){try{a(o.throw(e))}catch(e){r(e)}}function a(e){var n;e.done?i(e.value):(n=e.value,n instanceof t?n:new t((function(e){e(n)}))).then(s,l)}a((o=o.apply(e,n||[])).next())}))};Object.defineProperty(n,"__esModule",{value:!0}),n.runCmd=n.parseOptions=n.runOutput=n.catchedRun=n.run=void 0;const i=t(81),r=t(265);function s(e,n){return o(this,void 0,void 0,(function*(){const t=i.spawn("bash",[`-e${(null==n?void 0:n.debug)?"x":""}c`,e,"--",...(null==n?void 0:n.args)||[]],{cwd:null==n?void 0:n.cwd,env:Object.assign(Object.assign({},process.env),null==n?void 0:n.env)});t.stderr.on("data",(e=>process.stderr.write(e)));let o="";return(null==n?void 0:n.needStdout)?t.stdout.on("data",(e=>o+=e)):t.stdout.on("data",(e=>process.stdout.write(e))),new Promise(((i,r)=>{t.on("error",(function(e){r(e)})),t.on("close",(function(t){if(0!==t){let o=null==n?void 0:n.description;const i=100;if(!o)if(e.length<=i)o=e;else{const n=e.split("\n").map((e=>e.trim())).join("\n");o=n.length<=i?n:n.slice(0,i)+"..."}r(new Error(`exit code ${t}: ${o}`))}else i({exitCode:t,stdout:o})}))}))}))}Object.defineProperty(n,"parseOptions",{enumerable:!0,get:function(){return r.parse}}),n.run=s,n.runCmd=s,n.catchedRun=function(e){return o(this,void 0,void 0,(function*(){e().catch((e=>{console.error((null==e?void 0:e.message)||e),process.exit(1)}))}))},n.runOutput=function(e,n){return o(this,void 0,void 0,(function*(){return s(e,Object.assign(Object.assign({},n),{needStdout:!0})).then((e=>e.stdout.endsWith("\n")?e.stdout.slice(0,e.stdout.length-1):e.stdout))}))}},265:(e,n)=>{Object.defineProperty(n,"__esModule",{value:!0}),n.parse=void 0,n.parse=function(e,n,t){null==t&&(t=process.argv.slice(2));const o=n.split(/\s+/),i={},r={},s={};for(let e of o){let n,t=e.lastIndexOf("=");-1!=t&&(n=e.slice(t+1),e=e.slice(0,t));let o="zero";e.endsWith("::")?(o="many",e=e.slice(0,e.length-2)):e.endsWith(":")&&(o="one",e=e.slice(0,e.length-1));const l=e.split(",");if(0==l.length)continue;const a=l[l.length-1];if(null!=r[a])throw new Error(`duplicate option name:${a}`);r[a]=o,n&&(s[a]=n);for(const e of l)if(0!=e.length){if(null!=i[e])throw new Error(`duplicate option name:${e}`);i[e]=a}}const l=[],a={},c={};let u=0;function d(e,n){let o=n===c;o&&(n=null);const l=i[e];if(!l)throw new Error(`no such option:${e}`);const d=s[l];if(d&&(a[d]=e),"zero"===r[l]){if(o)return void(a[l]=!0);if(null!=n)if("on"==n||"On"==n||"ON"==n||"true"==n||"True"==n||"TRUE"==n)a[l]=!0;else{if("off"!=n&&"Off"!=n&&"OFF"!=n&&"false"!=n&&"False"!=n&&"FALSE"!=n)throw new Error(`option requires no argument:${e},except on/On/ON/true/True/TRUE or off/Off/OFF/false/False/FALSE`);a[l]=!1}else a[l]=!0}else if("one"===r[l]){if(o&&(n=t[++u]),null==n)throw new Error(`option requires one argument:${e}`);a[l]=n}else{if("many"!==r[l])throw new Error(`unknown option repeat:${e} ${r[l]}`);if(o&&(n=t[++u]),null==n)throw new Error(`option requires argument:${e}`);null==a[l]?a[l]=[n]:a[l].push(n)}}for(;u<t.length;u++){const e=t[u];if("--"==e){l.push(...t.slice(u+1));break}if("-"!=e)if(e.startsWith("--")){let n=e.slice(2);const t=n.lastIndexOf("=");let o;-1!=t?(o=n.slice(t+1),n=n.slice(0,t)):o=c,d(n,o)}else if(e.startsWith("-")){const n=e.slice(1);if(1==n.length){d(n,c);continue}const t=n[0],o=i[t],s=r[o];if("one"==s||"many"==s)d(t,n.slice(1));else if("zero"==s){for(const e of n.slice(0,n.length-1))d(e,null);d(n[n.length-1],c)}}else l.push(e);else l.push(e)}function p(){let n=e;return n.startsWith("\n")&&(n=n.slice(1)),n.endsWith("\n")&&(n=n.slice(0,n.length-1)),n}return!0===a.help&&(console.log(p()),process.exit(0)),{args:l,options:a,getHelp:p}}},65:(e,n)=>{function t(e,n,t){const o=[],i=e.length;for(let r=0;r<i;){let s=n(e,r);s<0&&(s=i),o.push(t(r,s,e)),r=s+1}return o}Object.defineProperty(n,"__esModule",{value:!0}),n.addSuffix=n.trimSuffix=n.trimPrefix=n.iterMatch=n.iterLines=void 0,n.iterLines=function(e,n){return t(e,((e,n)=>e.indexOf("\n",n)),n)},n.iterMatch=t,n.trimPrefix=function(e,n){var t;return(null===(t=null==e?void 0:e.startsWith)||void 0===t?void 0:t.call(e,n))?[e.slice(n.length),!0]:[e,!1]},n.trimSuffix=function(e,n){var t;return(null===(t=null==e?void 0:e.endsWith)||void 0===t?void 0:t.call(e,n))?[e.slice(0,e.length-n.length),!0]:[e,!1]},n.addSuffix=function(e,n){return e.endsWith(n)?e:e+n}},192:function(e,n,t){var o=this&&this.__awaiter||function(e,n,t,o){return new(t||(t=Promise))((function(i,r){function s(e){try{a(o.next(e))}catch(e){r(e)}}function l(e){try{a(o.throw(e))}catch(e){r(e)}}function a(e){var n;e.done?i(e.value):(n=e.value,n instanceof t?n:new t((function(e){e(n)}))).then(s,l)}a((o=o.apply(e,n||[])).next())}))};Object.defineProperty(n,"__esModule",{value:!0}),n.run=void 0;const i=t(17),r=t(292),s=t(37),l=t(258),a=t(900),c=t(113),u=t(65);function d(){return o(this,void 0,void 0,(function*(){const{args:e,options:n}=(0,a.parseOptions)("Usage: nx [OPTIONS] <script> [--] [script-args...]\n\nOptions:\n  -h, --help        show help message\n  -p, --print-dir   print the generated directory\n      --root        print root directory and exit\n  -x, --debug       log debug info\n  -c, --code        open the directory with vscode\n  -f, --force       force install modules\n      --clean       clean the target dir before writing files\n      --rm          remove the target dir and exit\n      --keep-link   don't resolve the script if it is a link\n      --install     install dependencies and exit, i.e. run `npm install` in target directory\n      --mode=production|development    default mode: development           \n\nOnce installed with `npm install -g node-ext`, `nx` will be automatically linked to /usr/local/bin so you can just use `nx` to run scripts\n\nExample:\n  $ nx --help           # show help\n  $ nx test.ts          # run test.ts\n  $ nx -x test.ts       # run test.ts, with debug info\n  $ nx --code test.ts   # open the directory\n  $ nx update           # update node-ext version\n\nCompare with `ts-node`: you can also use `ts-node` to run typescript, e.g. `npx -g ts-node --transpile-only test.ts`.\nThe advantage that `nx` provides is it can provide default `webpack.config.js` and `tsconfg.json`,\nand with `--code` option we can edit ts files with vscode super easily.\n\n","h,help p,print-dir root x,debug c,code f,force clean rm keep-link install mode:"),{debug:t,force:o,clean:d,rm:f,root:h,"print-dir":m,install:g,"keep-link":v,mode:b}=n;let x=null==n?void 0:n.code;const[w,...y]=e,O=(0,s.tmpdir)(),j=i.join(O,"nx-sync");if(h)return void console.log(j);if(!w)throw new Error("requires script to run");if("update"===w)return void(yield(0,a.run)("npm remove -g node-ext; npm install -g node-ext",{debug:t}));let $=i.resolve(w);if(!i.isAbsolute($))throw new Error(`failed to make ${w} absolute, the resolved path is ${$}`);v||($=yield r.realpath($));const k=yield r.stat($).catch((e=>{throw new Error(`not exists: ${w}`)}));let _=!1;if(k.isDirectory())x=!0,_=!0;else if(!k.isFile())throw new Error(`not a file: ${w}`);const E=_?$:i.dirname($);if(!i.isAbsolute(E))throw new Error(`failed to detect absolute dir of ${w}, the resolved dir is ${E}`);if(E===j||E.startsWith(j))throw new Error(`${w} resides in nx-sync dir: ${j}, try another location`);const[S,T]=yield Promise.all([_?null:p($),(0,a.runOutput)("npm -g root")]),P=Object.assign(Object.assign({},function(e,n){const t={};return Object.keys(e||{}).forEach((o=>{let r=e[o],[s,l]=(0,u.trimPrefix)(r,"$NPM_ROOT/");if(l)r=i.join(n,s);else{let[e,n]=(0,u.trimPrefix)(r,"~/");n&&(r=i.join(process.env.HOME,e))}t[o]=r})),t}(null==S?void 0:S.importMap,T)),{"@":"./","@node-ext":i.resolve(T,"node-ext/lib")}),M=i.join(j,E);if(t&&console.error("target dir:",M),(d||f)&&(yield r.rm(M,{recursive:!0}),f))return;yield r.mkdir(M,{recursive:!0});const W=(0,l.formatPackageJSON)({name:"tmp",installMap:null==S?void 0:S.installMap}),J=(0,l.formatTsConfigJSON)({importMap:P}),R=(0,l.formatWebpackConfigJS)({importMap:P}),F="package.json.checksum",N=o?"":yield r.readFile(i.join(M,F),{encoding:"utf-8"}).catch((e=>{})),q=(0,c.createHash)("md5").update(W).digest("hex"),C={"package.json":W,[F]:q,"tsconfig.json":J,"webpack.config.js":R};if(_||(C["run.ts"]=`import "${$}"`),yield Promise.all([...Object.keys(C).map((e=>r.writeFile(i.join(M,e),C[e]))),(0,a.run)(`rm -rf "${M}/src" ; ln -s "${E}" "${M}/src"`,{debug:t})]),m)return void console.log(M);if(x){const e=_?"":`--goto "${M}/src/${i.basename($)}"`;return void(yield(0,a.run)(`code ${e} "${M}"`,{debug:t}))}if(g)return void(yield(0,a.run)("npm install --no-audit --no-fund",{debug:t,cwd:M}));let D=o||N!==q;if(!D){let e=!1;yield r.stat(i.join(M,"node_modules")).then((n=>e=n.isDirectory())).catch((e=>{})),D=!e}const A="npm run "+("production"===b?"build":"build-dev"),I=t?"":"&>/dev/null";yield(0,a.run)(`\n    set -e\n    (\n        cd "$TARGET_DIR"\n        ${D?"npm install --no-audit --no-fund "+I:""}  # npm install is slow so we need a checksum to avoid repeat\n        ${A} ${I} ; # dev mode webpack can use build cache\n    )\n    node "$TARGET_DIR/bin/run.js" "$@"\n    `,{debug:t,args:y,env:{TARGET_DIR:M}}).catch((e=>{t&&console.error((null==e?void 0:e.message)||e),process.exit(1)}))}))}function p(e){var n;return o(this,void 0,void 0,(function*(){const t=(s=yield r.readFile(e,{encoding:"utf-8"}),(0,u.iterLines)(s,((e,n)=>{const t=s.slice(e,n);if(t.startsWith(f))return t.slice(f.length).trim()})).filter((e=>e))),o={},i={};var s;return null===(n=null==t?void 0:t.forEach)||void 0===n||n.call(t,(e=>{if(e.startsWith("#"))return;let[n,t]=(0,u.trimPrefix)(e,"use ");if(t){let[t,i]=n.split(" ",2);if(t=t.trim(),i=i.trim(),!t||!i)throw new Error(`invalid ${e}: requires name or dir`);o[t]=i}else[n,t]=(0,u.trimPrefix)(e,"install "),t&&n.split(" ").map((e=>e.trim())).map((e=>e.split("@",2))).filter((e=>e[0])).forEach((e=>i[e[0]]=e[1]||"latest"))})),{importMap:o,installMap:i}}))}n.run=d;const f="//!node-ext:";d().catch((e=>{console.error(e.message),process.exit(1)})).finally((()=>{}))},81:e=>{e.exports=require("child_process")},113:e=>{e.exports=require("crypto")},292:e=>{e.exports=require("fs/promises")},37:e=>{e.exports=require("os")},17:e=>{e.exports=require("path")}},n={};return function t(o){var i=n[o];if(void 0!==i)return i.exports;var r=n[o]={exports:{}};return e[o].call(r.exports,r,r.exports,t),r.exports}(192)})()));