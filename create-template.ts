export function formatPackageJSON(name: string): string {
  return `{
        "name": "${name || "tmp"}",
        "version": "0.0.1",
        "dependencies": {
        },
        "scripts": {
            "build": "webpack --config webpack.config.js --progress --mode=production",
            "build-dev": "webpack --config webpack.config.js --progress --mode=development"
        },
        "devDependencies": {
            "@babel/cli": "^7.1.0",
            "@babel/core": "^7.1.0",
            "@babel/preset-env": "^7.1.0",
            "@types/node": "^18.11.18",
            "babel-loader": "^8.1.0",
            "file-loader": "^6.0.0",
            "ts-loader": "^9.3.1",
            "webpack-cli": "^4.10.0"
        }
    }
    `
}
export function formatTsConfigJSON(): string {
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
            "target": "es6",
            "lib": [
                "ES2021",
                "ES2021.String"
            ],
            // "target": "es6",
            "module": "commonjs",
            // "module": "ES2015",
            // "outDir": "src/debug",
            "moduleResolution": "node",
            "rootDirs": ["./"]
        },
        "exclude": []
    }`
}


export function formatWebpackConfigJS(): string {
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
        alias: {
          "@": path.resolve(__dirname, "./"),
        },
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