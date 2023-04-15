const fs = require("fs/promises");
const path = require("path");

async function run() {
  const files = ["cmd.ts", "cmd-with-config.ts"];

  const contents = {};
  for (const file of files) {
    const content = await fs.readFile(path.join(__dirname, file), {
      encoding: "utf-8",
    });
    contents[file] = content;
  }

  let indexContents = [`export const files:{[name:string]:string} = {}`];
  for (let file in contents) {
    indexContents.push(`files["${file}"] = ${JSON.stringify(contents[file])}`);
  }
  await fs.writeFile(
    path.join(__dirname, "index.ts"),
    indexContents.join("\n\n")
  );
}

run();
