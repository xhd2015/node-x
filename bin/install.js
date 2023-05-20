!function(e,n){if("object"==typeof exports&&"object"==typeof module)module.exports=n();else if("function"==typeof define&&define.amd)define([],n);else{var t=n();for(var o in t)("object"==typeof exports?exports:e)[o]=t[o]}}(globalThis,(()=>(()=>{"use strict";var e={900:(e,n,t)=>{Object.defineProperty(n,"__esModule",{value:!0}),n.runCmd=n.parseOptions=n.runOutput=n.catchedRun=n.run=void 0;const o=t(81),r=t(265);async function i(e,n){const t=o.spawn("bash",[`-e${n?.debug?"x":""}c`,e,"--",...n?.args||[]],{cwd:n?.cwd,env:{...process.env,...n?.env}});n?.onCreated&&n.onCreated(t),n?.stdin&&n.stdin.pipe(t.stdin,{end:!0}),t.stderr.on("data",(e=>process.stderr.write(e)));let r="";return n?.needStdout?t.stdout.on("data",(e=>r+=e)):t.stdout.on("data",(e=>process.stdout.write(e))),new Promise(((o,i)=>{t.on("error",(function(e){i(e)})),t.on("close",(function(t){if(0!==t){let o=n?.description;const r=100;if(!o)if(e.length<=r)o=e;else{const n=e.split("\n").map((e=>e.trim())).join("\n");o=n.length<=r?n:n.slice(0,r)+"..."}i(new Error(`exit code ${t}: ${o}`))}else o({exitCode:t,stdout:r})}))}))}Object.defineProperty(n,"parseOptions",{enumerable:!0,get:function(){return r.parse}}),n.run=i,n.runCmd=i,n.catchedRun=async function(e){e().catch((e=>{console.error(e?.message||e),process.exit(1)}))},n.runOutput=async function(e,n){return i(e,{...n,needStdout:!0}).then((e=>e.stdout.endsWith("\n")?e.stdout.slice(0,e.stdout.length-1):e.stdout))}},767:(e,n,t)=>{Object.defineProperty(n,"__esModule",{value:!0}),n.resolveShellPath=void 0;const o=t(17);n.resolveShellPath=function(e){return"~"===e?process.env.HOME:e.startsWith("~/")?(0,o.join)(process.env.HOME,e.slice("~/".length)):e}},597:(e,n,t)=>{Object.defineProperty(n,"__esModule",{value:!0}),n.linkToPath=n.getNpmGlobalRoot=n.addToCommonProfiles=n.commonProfiles=n.addToPath=void 0;const o=t(292),r=t(900),i=t(767),s=t(65);async function l(e,n){const t=await(0,o.readFile)(e,{encoding:"utf-8"}).catch((e=>{}));return!!t&&!t.includes(n)&&(await(0,o.writeFile)(e,(0,s.addSuffix)(t,"\n")+n+"\n"),!0)}async function c(e){const t=[];return await Promise.all(n.commonProfiles.map((async n=>{await l((0,i.resolveShellPath)(n),e)&&t.push(n)}))),t}n.addToPath=l,n.commonProfiles=["~/.bashrc","~/.bash_profile","~/.zshrc","~/.profile"],n.addToCommonProfiles=c,n.getNpmGlobalRoot=async function(){return await(0,r.runOutput)("npm -g root || true")},n.linkToPath=async function(e,n,t){if(!e)throw new Error("requires name");if(!n)throw new Error("requires file");const o=(process.env.PATH||"").split(":");if(o.includes("/usr/local/bin")){let o=!0;if(await(0,r.runCmd)(`\n        if [[ ! -d /usr/local/bin ]];then exit 1;fi\n        \n        # nx exists, and is not a link file, then do not replace\n        if [[ -e "/usr/local/bin/${e}" && ! -L "/usr/local/bin/${e}" ]];then exit 1;fi\n\n        ln -sf "${n}" "/usr/local/bin/${e}"\n        `,t).catch((()=>o=!1)),o)return}if(await(0,r.runCmd)(`\n    mkdir -p ~/.nx/bin\n    ln -sf "${n}" ~/.nx/bin/"${e}"\n    `,t),o.includes("~/.nx/bin")||o.includes((0,i.resolveShellPath)("~/.nx/bin")))return;const s=await c("export PATH=~/.nx/bin:$PATH # nx");0!==s.length&&console.log(`updated profiles: ${s.join(",")}, please source profiles if needed`)}},265:(e,n)=>{Object.defineProperty(n,"__esModule",{value:!0}),n.parse=void 0,n.parse=function(e,n,t,o){t&&(o||Array.isArray(t)||(t=(o=t)?.argv)),null==t&&(t=process.argv.slice(2));const r=t,i=n.split(/\s+/),s={},l={},c={},u=o?.stopAtFirstArg;for(let e of i){let n,t=e.lastIndexOf("=");-1!=t&&(n=e.slice(t+1),e=e.slice(0,t));let o="zero";e.endsWith("::")?(o="many",e=e.slice(0,e.length-2)):e.endsWith(":")&&(o="one",e=e.slice(0,e.length-1));const r=e.split(",");if(0==r.length)continue;const i=r[r.length-1];if(null!=l[i])throw new Error(`duplicate option name:${i}`);l[i]=o,n&&(c[i]=n);for(const e of r)if(0!=e.length){if(null!=s[e])throw new Error(`duplicate option name:${e}`);s[e]=i}}const a=[],f={},d={};let p=0;function h(e,n){let o=n===d;o&&(n=null);const r=s[e];if(!r)throw new Error(`no such option:${e}`);const i=c[r];if(i&&(f[i]=e),"zero"===l[r]){if(o)return void(f[r]=!0);if(null!=n)if("on"==n||"On"==n||"ON"==n||"true"==n||"True"==n||"TRUE"==n)f[r]=!0;else{if("off"!=n&&"Off"!=n&&"OFF"!=n&&"false"!=n&&"False"!=n&&"FALSE"!=n)throw new Error(`option requires no argument:${e},except on/On/ON/true/True/TRUE or off/Off/OFF/false/False/FALSE`);f[r]=!1}else f[r]=!0}else if("one"===l[r]){if(o&&(n=t[++p]),null==n)throw new Error(`option requires one argument:${e}`);f[r]=n}else{if("many"!==l[r])throw new Error(`unknown option repeat:${e} ${l[r]}`);if(o&&(n=t[++p]),null==n)throw new Error(`option requires argument:${e}`);null==f[r]?f[r]=[n]:f[r].push(n)}}for(;p<r.length;p++){const e=t[p];if("--"==e){a.push(...r.slice(p+1));break}if("-"!=e)if(e.startsWith("--")){let n=e.slice(2);const t=n.lastIndexOf("=");let o;-1!=t?(o=n.slice(t+1),n=n.slice(0,t)):o=d,h(n,o)}else if(e.startsWith("-")){const n=e.slice(1);if(1==n.length){h(n,d);continue}const t=n[0],o=s[t],r=l[o];if("one"==r||"many"==r)h(t,n.slice(1));else if("zero"==r){for(const e of n.slice(0,n.length-1))h(e,null);h(n[n.length-1],d)}}else{if(u){a.push(...r.slice(p));break}a.push(e)}else a.push(e)}function m(){let n=e;return n.startsWith("\n")&&(n=n.slice(1)),n.endsWith("\n")&&(n=n.slice(0,n.length-1)),n}return!0===f.help&&(console.log(m()),process.exit(0)),{args:a,options:f,getHelp:m}}},65:(e,n)=>{function t(e,n,t){const o=[],r=e.length;for(let i=0;i<r;){let s=n(e,i);s<0&&(s=r),o.push(t(i,s,e)),i=s+1}return o}Object.defineProperty(n,"__esModule",{value:!0}),n.addSuffix=n.trimSuffix=n.trimPrefix=n.iterMatch=n.iterLines=void 0,n.iterLines=function(e,n){return t(e,((e,n)=>e.indexOf("\n",n)),n)},n.iterMatch=t,n.trimPrefix=function(e,n){return e?.startsWith?.(n)?[e.slice(n.length),!0]:[e,!1]},n.trimSuffix=function(e,n){return e?.endsWith?.(n)?[e.slice(0,e.length-n.length),!0]:[e,!1]},n.addSuffix=function(e,n){return e.endsWith(n)?e:e+n}},81:e=>{e.exports=require("child_process")},292:e=>{e.exports=require("fs/promises")},17:e=>{e.exports=require("path")}},n={};function t(o){var r=n[o];if(void 0!==r)return r.exports;var i=n[o]={exports:{}};return e[o](i,i.exports,t),i.exports}var o={};return(()=>{var e=o;Object.defineProperty(e,"__esModule",{value:!0});const n=t(17),r=t(900),i=t(597);(0,r.catchedRun)((async function(){const e=await(0,i.getNpmGlobalRoot)();await(0,i.linkToPath)("nx",(0,n.join)(e,"node-ext/bin/nx"),{debug:!0})}))})(),o})()));