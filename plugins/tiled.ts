import type esbuild from "esbuild";
import fs from "fs-extra";
import { resolve } from "path";
import { getNextAssetId } from "./assetId";
export const plugin: (
  isDev: boolean,
  outputTarget: string,
  assetInstanceId: number
) => esbuild.Plugin = (
  isDev: boolean,
  outputTarget: string,
  assetInstanceId: number
) => ({
  name: "tiled loader",
  setup(build) {
    build.onLoad(
      {
        filter: /\.map\.json$/,
      },
      async (meta): Promise<esbuild.OnLoadResult | null | undefined> => {
        let id = getNextAssetId(assetInstanceId);
        const fileName = id.toString();
        const _path = resolve(process.cwd(), outputTarget, fileName);

        const rawMapData = fs.readFileSync(_path);
        const mapJSON = rawMapData.toJSON();

        console.log(mapJSON);



        // fs.promises.copyFile(meta.path, _path);
        if (isDev)
          // fs.promises.writeFile(
          //   meta.path + ".d.ts",
          //   `// MANAGED_DTS\ndeclare const _default:"/${fileName}";\nexport default _default;`
          // );
        return {
          contents: `export default "/${fileName}"`,
        };
      }
    );
  },
});
