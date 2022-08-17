const isDev = process.argv.includes("dev");
const esbuild = require("esbuild");
const path = require("path");
const fs = require("fs-extra");
const minifyHTML = require("html-minify").minify;

const build = async () => {
  const output = path.join(__dirname, "dist", "bundle.js");
  const input = path.join(__dirname, "src", "main.ts");
  try {
    await fs.promises.rm(path.join(__dirname, "dist"), { recursive: true });
  } catch (e) {}
  await fs.promises.mkdir(path.join(__dirname, "dist"));
  const result = await esbuild.build({
    entryPoints: [input],
    outfile: output,
    minify: !isDev,
    target: "esnext",
    bundle: true,
    platform: "browser",
    format: "esm",
    sourcemap: isDev ? "external" : false,
    plugins: [],
  });
  const html = await fs.readFile(
    path.join(__dirname, "src", "index.html"),
    "utf8"
  );
  await fs.writeFile(
    path.join(__dirname, "dist", "index.html"),
    minifyHTML(html).replace(
      /<!--SCRIPTS-->/g,
      `<script type="module">${fs.readFileSync(path.join(__dirname, "dist", "bundle.js"), "utf8")}</script>`
    )
  );
  console.log(result);
  if (result.errors.length === 0) {
    console.log("Build success");
  } else {
    console.log("Build error");
  }
};
build();
