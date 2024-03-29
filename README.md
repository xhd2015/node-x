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

# Usage examples

## Watch

```bash
nx --dev-watch dev.go --dev-watch-cmd '$NX_CMD func-to-ast|$NX_CMD ast-to-definitions' gen.ts
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

# For Maintenance of This Project

## Development

The project has a `webpack.config.js`, which pack `run.ts` into `bin/run.js`.
`bin/run.js` is ran by invoking `nx`, and `nx` is linked to `/usr/local/bin/nx`.

When running `nx` with given file `/path/to/x.ts`, `nx` will create a temporary directory called `$TMP/path/to`, where `$TMP` refers to `/tmp` on Linux, and other temp dir defined by specific OS. And it will link the `$TMP/path/to/src` to `/path/to`.

In the generated `webpack.config.js`, `@node-ext` will resolved to `NPM_ROOT/node-ext/lib`, where `NPM_ROOT` is the path to global npm node_modules root.

The script `npm run install-local` generates `bin/run.js` and copy that to `NPM_ROOT/node-ext/bin/run.js`, thus `install-local` installs local modifications of `run.ts` to global.

If you added some file in `lib`, you can run `npm run install-local-lib`.

## Publish

Change version in package.json,and run `npm publish`.

You can publish before committing changes to github.
