import type esbuild from "esbuild";
import fs from "fs-extra";
import { resolve } from "path";

export const plugin: (
  isDev: boolean,
  outputTarget: string
) => esbuild.Plugin = (_isDev: boolean, outputTarget: string) => ({
  name: "clean workspace",
  setup(build) {
    build.onStart(() => {
      fs.rmSync(outputTarget, { recursive: true });
      fs.mkdirSync(outputTarget, { recursive: true });
    });
  },
});
