# About `node-ext`

`node-ext` is an enhanced version of `node`.
It defaults with support of `typescript`, `ES5 Module`.

# Install

```bash
# install
npm install -g node-ext
echo "alias nx='node \"\$(npm -g root)/node-ext/bin/node-ext.js\"'" >> ~/.bash_profile

source ~/.bash_profile

# run
echo 'console.log("hello world")' >test.ts
nx test.ts

# edit test.ts with vscode in a prepared directory
nx test.ts --code
```

# Why not using `npx`

`npx` is problemtic with `npm install` in a temp directory.So we prefer to not use `npx`, rather just use `node`.

# How it works?

It autoamatically generate `package.json`,`tsconfig.json`,`webpackage.config.js` on the fly for any running configuration.

# install @types/node

```bash
npm install --save-dev @types/node
```
