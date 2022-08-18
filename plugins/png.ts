import type esbuild from "esbuild";
import fs from "fs-extra";
import { resolve } from "path";

export const plugin: (
  isDev: boolean,
  outputTarget: string
) => esbuild.Plugin = (isDev: boolean, outputTarget: string) => ({
  name: "png loader",
  setup(build) {
    let id = 0;
    build.onStart(() => {
      id = 0;
    });
    build.onLoad(
      {
        filter: /\.png$/,
      },
      async (meta): Promise<esbuild.OnLoadResult | null | undefined> => {
        id++;
        const _path = resolve(process.cwd(), outputTarget, id + ".png");
        fs.promises.copyFile(meta.path, _path);
        if (isDev)
          fs.promises.writeFile(
            meta.path + ".d.ts",
            `// MANAGED_DTS\ndeclare const _default:"/${id}.png";\nexport default _default;`
          );
        return {
          contents: `export default "/${id}.png"`,
        };
      }
    );
  },
});
