import type esbuild from "esbuild";
import fs from "fs-extra";
// @ts-ignore
import { minify } from "html-minify";
import { minify as jsMinify } from "terser";
import path from "path";

export const plugin: (
  isDev: boolean,
  outputTarget: string
) => esbuild.Plugin = (isDev: boolean, outputTarget: string) => ({
  name: "html authoring",
  setup(build) {
    build.onEnd(async () => {
      const html = await fs.readFile(
        path.join(process.cwd(), "src", "index.html"),
        "utf8"
      );
      const js = fs.readFileSync(
        path.join(process.cwd(), outputTarget, "bundle.js"),
        "utf8"
      );
      await fs.writeFile(
        path.join(process.cwd(), outputTarget, "index.html"),
        (isDev ? html : minify(html)).replace(/\n|\r|\s{2,}/g, "").replace(
          /<!--SCRIPTS-->/g,
          `<script type="module">${
            isDev
              ? js
              : (
                  await jsMinify(js, {
                    module: true,
                  })
                ).code
          }</script>`
        )
      );
      await fs.promises.rm(path.join(process.cwd(), outputTarget, "bundle.js"));
    });
  },
});
