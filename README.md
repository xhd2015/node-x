# About `node-ext`

`node-ext` is an enhanced version of `node`.
It defaults with support of `typescript`, `ES5 Module`.

# Install

```bash
echo 'console.log("hello world")' >test.ts
npx node-ext test.ts

# or npx -g if you do not want to install anything
npx -g node-ext test.ts

# or if npx does not work, install first
npm install -g node-ext
npx -g node-ext test.ts
```

# How it works?

It autoamatically generate `package.json`,`tsconfig.json`,`webpackage.config.js` on the fly for any running configuration.

# install @types/node

```bash
npm install --save-dev @types/node
```
