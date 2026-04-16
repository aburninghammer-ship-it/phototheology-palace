// Bible Rendered Room Images (51 Sets)
// Images served from /public/bible-rendered/ to avoid Vite processing

const makePath = (n: number) => `/bible-rendered/set-${String(n).padStart(2, '0')}.jpg`;

export const bibleRenderedImages: Record<number, string> = Object.fromEntries(
  Array.from({ length: 50 }, (_, i) => [i + 1, makePath(i + 1)])
);
// Rev 17-22 uses the original set 50 image
bibleRenderedImages[51] = bibleRenderedImages[50];

export const getBibleRenderedImage = (setNumber: number): string | undefined => {
  if (setNumber < 1 || setNumber > 51) {
    return undefined;
  }
  return bibleRenderedImages[setNumber];
};

export default bibleRenderedImages;
