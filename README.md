# About `node-ext`

`node-ext` is an enhanced version of `node`.
It defaults with support of `typescript`, `ES5 Module`.

# Install

```bash
# install
npm install -g node-ext # this will link /usr/local/bin/nx to node-ext/bin/nx, if not linked previous.
nx --help

# run
echo 'console.log("hello world")' >test.ts
nx test.ts

# edit test.ts with vscode in a prepared directory
nx test.ts --code
```

# Special instructions

If you need to install third-party libraries, i.e. libraries not shipped with `node-ext`, you can specify them in the file with special instructions prefixed with `//!node-ext`, the syntax is:

```js
//!node-ext: install a@v b@v c@v
//!node-ext: use name DIR
```

Example:

```js
//!node-ext: install fs io@0.0.1
//!node-ext: use my-lib ~/my-lib
```

# Why not using `npx`

`npx` is problemtic with `npm install` in a temp directory.So we prefer to not use `npx`, rather just use `node`.

# How it works?

It autoamatically generate `package.json`,`tsconfig.json`,`webpackage.config.js` on the fly for any running configuration.

# Typescript issues

## cannot find @node-ext?

The reason is that you have a `tsconfig.json` in your `src` directory, so the ts language server use that instead of the one generated by `nx`.

You can work this out by temporariy renaming that `tsconfig.json` to `tsconfig.json.bak` when you edit in the temp directory opened by `nx --code`.

# install @types/node

```bash
npm install --save-dev @types/node
```
