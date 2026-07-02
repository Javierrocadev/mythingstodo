export function mergeLottie(
  base: object,
  overlays: object[],
): object {
  const baseData = base as { layers?: object[] };
  const overlayLayers = overlays.flatMap(
    (o) => ((o as { layers?: object[] }).layers ?? []),
  );
  return {
    ...baseData,
    layers: [...overlayLayers, ...(baseData.layers ?? [])],
  };
}
