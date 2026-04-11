// Genesis 1-50 24FPS Room Images (Complete Book)
// Images served from /public/24fps/genesis/ — no Vite processing

export const genesisImages: string[] = Array.from(
  { length: 50 },
  (_, i) => `/24fps/genesis/genesis-${String(i + 1).padStart(2, '0')}.jpg`
);

export const getGenesisImage = (chapter: number): string => {
  if (chapter < 1 || chapter > 50) {
    throw new Error(`Chapter ${chapter} is out of range. Must be between 1 and 50.`);
  }
  return genesisImages[chapter - 1];
};
