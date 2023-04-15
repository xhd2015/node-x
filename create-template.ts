export interface PackageJSONOptions {
  name?: string
  installMap?: InstallMap
}
export function formatPackageJSON(opts?: PackageJSONOptions): string {
  const installMap = opts?.installMap || {}
  // using 'node ./node_modules/.bin/webpack' instead of 'webpack' helps resolve permission problem,sometimes webpack's x permission is missing
  return `{
        "name": "${opts?.name || "tmp"}",
        "version": "0.0.1",
        "scripts": {
            "build": "node ./node_modules/.bin/webpack --config webpack.config.js --progress --mode=production",
            "build-dev": "node ./node_modules/.bin/webpack --config webpack.config.js --progress --mode=development",
            "start":"npm install && npm run build && node bin/run.js \\"$@\\""
        },
        "dependencies": ${JSON.stringify(installMap)} ,
        "devDependencies": {
            "@babel/cli": "^7.1.0",
            "@babel/core": "^7.1.0",
            "@babel/preset-env": "^7.1.0",
            "@types/node": "^18.11.18",
            "babel-loader": "^8.1.0",
            "file-loader": "^6.0.0",
            "ts-loader": "^9.3.1",
            "webpack-cli": "^4.10.0",
            "@types/node": "^18.15.11"
        }
    }
    `
}

export interface InstallMap {
  [name: string]: string // name -> version
}
export interface ImportMap {
  [name: string]: string // name -> directory, example: "@" => "./"
}

export interface TsConfigOptions {
  importMap?: ImportMap
}

// the @node-ext/ and @/ alias for tsconfig.json makes it simple to import builtin-libs
export function formatTsConfigJSON(opts?: TsConfigOptions): string {
  // {
  //   "@/*":["./*"],
  //   "@node-ext/*": ["./lib/*"]
  // }
  const mapJSON = {}
  Object.keys(opts?.importMap || {}).forEach(name => {
    let dir = opts.importMap[name]
    if (!dir.endsWith("/")) {
      dir = dir + "/"
    }
    mapJSON[name + "/*"] = [dir + "*"]
  })
  return `{
        // Change this to match your project
        // "include": [],
        "compilerOptions": {
            // Tells TypeScript to read JS files, as
            // normally they are ignored as source files
            // "allowJs": true,
            // Generate d.ts files
            // "declaration": true,
            // This compiler run should
            // only output d.ts files
            // "emitDeclarationOnly": true,
            // Types should go into this directory.
            // Removing this would place the .d.ts files
            // next to the .js files
            //   "outDir": "dist"
            "target": "ES2021",
            "lib": [
                "ES2021",
                "ES2021.String"
            ],
            // "target": "es6",
            "module": "commonjs",
            // "module": "ES2015",
            // "outDir": "src/debug",
            "moduleResolution": "node",
            "rootDirs": ["./"],
            "paths": ${JSON.stringify(mapJSON)}
        },
        "exclude": []
    }`
}

export interface WebpackConfigOptions {
  importMap?: ImportMap
}

export function formatWebpackConfigJS(opts?: WebpackConfigOptions): string {
  // example
  // {
  //   "@": path.resolve(__dirname, "./"),
  //   "@node-ext": path.resolve(__dirname, "./lib")
  // }
  const aliasMap = []
  Object.keys(opts?.importMap || {}).forEach(name => {
    let dir = opts.importMap[name].trim()
    aliasMap.push(`"${name}": path.resolve(__dirname,"${dir}")`)
  })
  const aliasJSON = "{" + aliasMap.join(",\n") + "}"
  return `const path = require("path");
    
    module.exports = {
      entry: {
        run: {
          import: "./run.ts",
          filename: "run.js",
        },
      },
      output: {
        path: path.resolve(__dirname, "bin"),
        libraryTarget: "umd", // for nodejs need this
        globalObject: "globalThis", // goja only recognize globalThis, not the default global.
      },
      module: {
        rules: [
          {
            test: /\.ts$/,
            // exclude: /(node_modules)/,
            use: {
              loader: "ts-loader",
              options: {
                transpileOnly: true,
              },
            },
          },
          {
            test: /\.(js)$/,
            exclude: /(node_modules)/,
            resolve: {
              extensions: [".ts", ".js"],
            },
            use: {
              loader: "babel-loader",
              options: {
                presets: ["@babel/preset-env"],
              },
            },
          },
        ],
      },
      resolve: {
        alias: ${aliasJSON},
        extensions: [".ts", ".js"],
      },
      target: "node",
      node:{
        __filename:true,
        __dirname:true,  // these two options make the __filename & __dirname correspond to original file name
      },
      plugins: [],
      // devtool: "source-map",
    };
    `
}