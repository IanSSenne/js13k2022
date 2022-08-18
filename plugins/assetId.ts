import type esbuild from "esbuild";
let _instanceId = 0;
const idMap = new Map<number, number>();
export const getNextAssetId = (instance: number) => {
  let next =
    idMap.has(instance) !== undefined ? idMap.get(instance) || 0 : 999999;
  idMap.set(instance, next + 1);
  return next;
};
export const plugin: (
  isDev: boolean,
  outputTarget: string
) => esbuild.Plugin = (_isDev: boolean, _outputTarget: string) => {
  const instanceId = _instanceId++;
  return {
    name: "assetId",
    instanceId,
    setup(build) {
      console.log(`[${instanceId}] Setup assetId plugin`);
      idMap.set(instanceId, 0);
      build.onStart(() => {
        idMap.set(instanceId, 0);
      });
    },
  };
};
