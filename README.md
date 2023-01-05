# About `node-x`

`node-x` is an enhanced version of `node`.
It defaults with support of `typescript`, `ES5 Module`.

# Install

```bash
echo 'console.log("hello world")' >test.ts
npx node-x test.ts

# or npx -g if you do not want to install anything
npx -g node-x test.test
```

# How it works?

It autoamatically generate `package.json`,`tsconfig.json`,`webpackage.config.js` on the fly for any running configuration.

# install @types/node

```bash
npm install --save-dev @types/node
```