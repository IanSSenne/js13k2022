require("ts-node/register");
const _isDev = process.argv.includes("dev");
const esbuild = require("esbuild");
const path = require("path");
const fs = require("fs-extra");
const minifyHTML = require("html-minify").minify;
const pngLoader = require("./plugins/png");
const cleanWorkspace = require("./plugins/clean");
const createHtml = require("./plugins/createHtml");
const logger = require("./plugins/logger");
const archiver = require("./plugins/prodArchiver");
const assetId = require("./plugins/assetId");
const build = async (isDev, shouldWatch, outputTarget) => {
  const output = path.join(__dirname, outputTarget, "bundle.js");
  const input = path.join(__dirname, "src", "main.ts");
  const assetIdInstance = assetId.plugin(isDev, outputTarget);
  // extra properties are not allowed on esbuild plugins.
  const assetInstanceId = assetIdInstance.instanceId;
  delete assetIdInstance.instanceId;
  esbuild.build({
    entryPoints: [input],
    outfile: output,
    minify: !isDev,
    target: "esnext",
    bundle: true,
    platform: "browser",
    format: "esm",
    sourcemap: isDev ? "inline" : false,
    plugins: [
      pngLoader.plugin(isDev, outputTarget, assetInstanceId),
      cleanWorkspace.plugin(isDev, outputTarget),
      createHtml.plugin(isDev, outputTarget),
      logger.plugin(isDev, outputTarget),
      archiver.plugin(isDev, outputTarget),
      assetIdInstance,
    ],
    watch: shouldWatch,
  });
};
if (_isDev) build(true, true, "dist/dev");
build(false, _isDev, "dist/prod");
if (_isDev) {
  const express = require("express");
  const devApp = express();
  devApp.use(express.static(path.join(__dirname, "dist/dev")));
  devApp.listen(3000, () => {
    console.log("Dev App Server started on port 3000");
  });
  const prodApp = express();
  prodApp.use(express.static(path.join(__dirname, "dist/prod")));
  prodApp.listen(3001, () => {
    console.log("Prod App Server started on port 3001");
  });
}
