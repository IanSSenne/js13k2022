import type esbuild from "esbuild";
import fflate from "fflate";
import fs from "fs-extra";
import { resolve } from "path";
function createFileTreeFromDirectory(base: string, path: string): any {
  const files = fs.readdirSync(path);
  const fileTree: any = {};
  let size = 0;
  for (const file of files) {
    const filePath = resolve(path, file);
    const stats = fs.statSync(filePath);
    if (stats.isDirectory()) {
      const [s, f] = createFileTreeFromDirectory(base, filePath);
      size += s;
      fileTree[file] = f;
    } else {
      size += stats.size;
      fileTree[file] = fs.readFileSync(filePath);
    }
  }
  return [size, fileTree];
}
function byteLengthToFileSize(size: number) {
  const units = ["B", "KB", "MB", "GB", "TB"];
  let i = 0;
  while (size >= 1024) {
    size /= 1024;
    i++;
  }
  return `${size.toFixed(2)} ${units[i]}`;
}
function formatNumber(num: number) {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
}
export const plugin: (
  isDev: boolean,
  outputTarget: string
) => esbuild.Plugin = (isDev: boolean, outputTarget: string) => ({
  name: "archiver",
  setup(build) {
    if (!isDev) {
      build.onEnd(() => {
        const [size, tree] = createFileTreeFromDirectory(
          process.cwd(),
          resolve(process.cwd(), outputTarget)
        );
        fflate.zip(
          tree,
          {
            level: 9,
          },
          (err, data) => {
            if (err) {
              console.log("[ZIP]", err);
            }
            fs.writeFileSync(
              resolve(process.cwd(), "dist", "production.zip"),
              data
            );
            const readableSize = byteLengthToFileSize(data.length);
            console.log(
              `[ZIP] Archived ${byteLengthToFileSize(
                size
              )} -> ${readableSize} (${(
                100 -
                (data.length / size) * 100
              ).toFixed(2)}% saved) \n[ZIP] usage: ${(
                data.length / 133.12
              ).toFixed(2)}% (${formatNumber(data.length)}/${formatNumber(
                13312
              )} bytes)`
            );
          }
        );
      });
    }
  },
});
