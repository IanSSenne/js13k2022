import type esbuild from "esbuild";
import fs from "fs-extra";
import { resolve } from "path";
import { performance } from "perf_hooks";

export const plugin: (
  isDev: boolean,
  outputTarget: string
) => esbuild.Plugin = (isDev: boolean, _outputTarget: string) => ({
  name: "logger",
  setup(build) {
    let startTime = 0;
    const log = isDev
      ? (message: string) => console.log(`[DEV] ${message}`)
      : (message: string) => console.log(`[PROD] ${message}`);
    build.onStart(() => {
      startTime = performance.now();
      log("Build started");
    });
  },
});
