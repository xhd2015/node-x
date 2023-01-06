!function(e,n){if("object"==typeof exports&&"object"==typeof module)module.exports=n();else if("function"==typeof define&&define.amd)define([],n);else{var o=n();for(var t in o)("object"==typeof exports?exports:e)[t]=o[t]}}(globalThis,(()=>(()=>{"use strict";var e={247:function(e,n,o){var t=this&&this.__awaiter||function(e,n,o,t){return new(o||(o=Promise))((function(r,i){function s(e){try{l(t.next(e))}catch(e){i(e)}}function a(e){try{l(t.throw(e))}catch(e){i(e)}}function l(e){var n;e.done?r(e.value):(n=e.value,n instanceof o?n:new o((function(e){e(n)}))).then(s,a)}l((t=t.apply(e,n||[])).next())}))};Object.defineProperty(n,"__esModule",{value:!0}),n.run=void 0;const r=o(81);n.run=function(e,n){return t(this,void 0,void 0,(function*(){const o=r.spawn("bash",[`-e${(null==n?void 0:n.debug)?"x":""}c`,e,"--",...(null==n?void 0:n.args)||[]],{cwd:null==n?void 0:n.cwd,env:Object.assign(Object.assign({},process.env),null==n?void 0:n.env)});return o.stdout.on("data",(e=>process.stdout.write(e))),o.stderr.on("data",(e=>process.stderr.write(e))),new Promise(((e,n)=>{o.on("error",(function(e){n(e)})),o.on("close",(function(o){0!==o?n(new Error(`exit code: ${o}`)):e(o)}))}))}))}},258:(e,n)=>{Object.defineProperty(n,"__esModule",{value:!0}),n.formatWebpackConfigJS=n.formatTsConfigJSON=n.formatPackageJSON=void 0,n.formatPackageJSON=function(e){return`{\n        "name": "${e||"tmp"}",\n        "version": "0.0.1",\n        "dependencies": {\n        },\n        "scripts": {\n            "build": "webpack --config webpack.config.js --progress --mode=production",\n            "build-dev": "webpack --config webpack.config.js --progress --mode=development",\n            "start":"npm install && npm run build && node bin/run.js \\"$@\\""\n        },\n        "devDependencies": {\n            "@babel/cli": "^7.1.0",\n            "@babel/core": "^7.1.0",\n            "@babel/preset-env": "^7.1.0",\n            "@types/node": "^18.11.18",\n            "babel-loader": "^8.1.0",\n            "file-loader": "^6.0.0",\n            "ts-loader": "^9.3.1",\n            "webpack-cli": "^4.10.0"\n        }\n    }\n    `},n.formatTsConfigJSON=function(){return'{\n        // Change this to match your project\n        // "include": [],\n        "compilerOptions": {\n            // Tells TypeScript to read JS files, as\n            // normally they are ignored as source files\n            // "allowJs": true,\n            // Generate d.ts files\n            // "declaration": true,\n            // This compiler run should\n            // only output d.ts files\n            // "emitDeclarationOnly": true,\n            // Types should go into this directory.\n            // Removing this would place the .d.ts files\n            // next to the .js files\n            //   "outDir": "dist"\n            "target": "es6",\n            "lib": [\n                "ES2021",\n                "ES2021.String"\n            ],\n            // "target": "es6",\n            "module": "commonjs",\n            // "module": "ES2015",\n            // "outDir": "src/debug",\n            "moduleResolution": "node",\n            "rootDirs": ["./"]\n        },\n        "exclude": []\n    }'},n.formatWebpackConfigJS=function(){return'const path = require("path");\n    \n    module.exports = {\n      entry: {\n        run: {\n          import: "./run.ts",\n          filename: "run.js",\n        },\n      },\n      output: {\n        path: path.resolve(__dirname, "bin"),\n        libraryTarget: "umd", // for nodejs need this\n        globalObject: "globalThis", // goja only recognize globalThis, not the default global.\n      },\n      module: {\n        rules: [\n          {\n            test: /.ts$/,\n            // exclude: /(node_modules)/,\n            use: {\n              loader: "ts-loader",\n              options: {\n                transpileOnly: true,\n              },\n            },\n          },\n          {\n            test: /.(js)$/,\n            exclude: /(node_modules)/,\n            resolve: {\n              extensions: [".ts", ".js"],\n            },\n            use: {\n              loader: "babel-loader",\n              options: {\n                presets: ["@babel/preset-env"],\n              },\n            },\n          },\n        ],\n      },\n      resolve: {\n        alias: {\n          "@": path.resolve(__dirname, "./"),\n        },\n        extensions: [".ts", ".js"],\n      },\n      target: "node",\n      node:{\n        __filename:true,\n        __dirname:true,  // these two options make the __filename & __dirname correspond to original file name\n      },\n      plugins: [],\n      // devtool: "source-map",\n    };\n    '}},192:function(e,n,o){var t=this&&this.__awaiter||function(e,n,o,t){return new(o||(o=Promise))((function(r,i){function s(e){try{l(t.next(e))}catch(e){i(e)}}function a(e){try{l(t.throw(e))}catch(e){i(e)}}function l(e){var n;e.done?r(e.value):(n=e.value,n instanceof o?n:new o((function(e){e(n)}))).then(s,a)}l((t=t.apply(e,n||[])).next())}))};Object.defineProperty(n,"__esModule",{value:!0}),n.run=void 0;const r=o(17),i=o(292),s=o(37),a=o(258),l=o(247),d=o(113);function c(){return t(this,void 0,void 0,(function*(){const{script:e,args:n,debug:o,code:t,help:c,printDir:u,force:p,clean:f}=function(e){const n={args:[]},o=e.length;for(let t=0;t<o;t++){const o=e[t];if("--"===o){n.args.push(...e.slice(t+1));break}if("-h"===o||"--help"===o)n.help=!0;else if("-x"===o||"--debug"===o)n.debug=!0;else if("-c"===o||"--code"===o)n.code=!0;else if("-p"===o||"--print-dir"===o)n.printDir=!0;else if("-f"===o||"--force"===o)n.force=!0;else if("--clean"===o)n.clean=!0;else{if(o.startsWith("-"))throw new Error(`unrecognized option: ${o}`);n.args.push(o)}}return[n.script,...n.args]=n.args,n}(process.argv.slice(2));if(c)return void console.log('Usage: nx [OPTIONS] <script> [--] [script-args...]\n\nOptions:\n  -h, --help        show help message\n  -p, --print-dir   print the generated directory\n  -x, --debug       log debug info\n  -c, --code        open the directory with vscode\n  -f, --force       force install modules\n      --clean       clean the target dir before writing files\n\nYou can set `nx` as an alias to `node "$(npm -g root)/node-ext/bin/node-ext.js"` to simplify the usage.\nNOTE: you must not use with npx: `npx -g node-ext`, npx simply does make `npm install` fails without fair reason.\nSetup:\n  $ npm install -g node-ext # install or upgrade to newest version\n  $ echo "alias nx=\'node \\"\\$(npm -g root)/node-ext/bin/node-ext.js\\"\'" >> ~/.bash_profile\n\nExample:\n  $ nx --help       # show help\n  $ nx test.ts      # run test.ts\n  $ nx -c test.ts   # open the directory\n  $ nx update       # update node-ext version \n');if(!e)throw new Error("requires script to run");if("update"===e)return void(yield(0,l.run)("npm remove -g node-ext; npm install -g node-ext",{debug:o}));const m=r.resolve(e);if(!r.isAbsolute(m))throw new Error(`failed to make ${e} absolute, the resolved path is ${m}`);if(!(yield i.stat(m).catch((n=>{throw new Error(`not exists: ${e}`)}))).isFile())throw new Error(`not a file: ${e}`);const h=(0,s.tmpdir)(),g=r.join(h,"nx-sync"),b=r.dirname(m);if(!r.isAbsolute(b))throw new Error(`failed to detect absolute dir of ${e}, the resolved dir is ${b}`);if(b===g||b.startsWith(g))throw new Error(`${e} resides in nx-sync dir: ${g}, try another location`);const v=r.join(g,b);o&&console.error("target dir:",v),f&&(yield i.rm(v,{recursive:!0})),yield i.mkdir(v,{recursive:!0});const x=(0,a.formatPackageJSON)("tmp"),w=(0,a.formatTsConfigJSON)(),y=(0,a.formatWebpackConfigJS)(),j=yield i.readFile(r.join(__dirname,"cmd.js")),_="package.json.checksum",$=p?"":yield i.readFile(r.join(v,_),{encoding:"utf-8"}).catch((e=>{})),k=(0,d.createHash)("md5").update(x).digest("hex"),O={"run.ts":`\n// some globals\nimport * as cmd from "./cmd.js"\nglobalThis.node_ext = { cmd }\n\nimport "${m}";\n`,"package.json":x,[_]:k,"tsconfig.json":w,"webpack.config.js":y,"cmd.js":j};if(yield Promise.all(Object.keys(O).map((e=>i.writeFile(r.join(v,e),O[e])))),u)return void console.log(v);if(t)return void(yield(0,l.run)(`code --goto ${m} ${v}`,{debug:o}));let T=p||$!==k;if(!T){let e=!1;yield i.stat(r.join(v,"node_modules")).then((n=>e=n.isDirectory())).catch((e=>{})),T=!e}const S=o?"":"&>/dev/null";yield(0,l.run)(`\n    set -e\n    (\n        cd "$TARGET_DIR"\n        ${T?"npm install --no-audit --no-fund "+S:""}  # npm install is slow so we need a checksum to avoid repeat\n        npm run build-dev ${S} ; # dev mode webpack can use build cache\n    )\n    node "$TARGET_DIR/bin/run.js" "$@"\n    `,{debug:o,args:n,env:{TARGET_DIR:v}})}))}o(81),n.run=c,c().catch((e=>{console.error(e.message),process.exit(1)})).finally((()=>{}))},81:e=>{e.exports=require("child_process")},113:e=>{e.exports=require("crypto")},292:e=>{e.exports=require("fs/promises")},37:e=>{e.exports=require("os")},17:e=>{e.exports=require("path")}},n={};return function o(t){var r=n[t];if(void 0!==r)return r.exports;var i=n[t]={exports:{}};return e[t].call(i.exports,i,i.exports,o),i.exports}(192)})()));