// Bible Rendered Room Images (51 Sets)
import set01 from "./set-01.jpg";
import set02 from "./set-02.jpg";
import set03 from "./set-03.jpg";
import set04 from "./set-04.jpg";
import set05 from "./set-05.jpg";
import set06 from "./set-06.jpg";
import set07 from "./set-07.jpg";
import set08 from "./set-08.jpg";
import set09 from "./set-09.jpg";
import set10 from "./set-10.jpg";
import set11 from "./set-11.jpg";
import set12 from "./set-12.jpg";
import set13 from "./set-13.jpg";
import set14 from "./set-14.jpg";
import set15 from "./set-15.jpg";
import set16 from "./set-16.jpg";
import set17 from "./set-17.jpg";
import set18 from "./set-18.jpg";
import set19 from "./set-19.jpg";
import set20 from "./set-20.jpg";
import set21 from "./set-21.jpg";
import set22 from "./set-22.jpg";
import set23 from "./set-23.jpg";
import set24 from "./set-24.jpg";
import set25 from "./set-25.jpg";
import set26 from "./set-26.jpg";
import set27 from "./set-27.jpg";
import set28 from "./set-28.jpg";
import set29 from "./set-29.jpg";
import set30 from "./set-30.jpg";
import set31 from "./set-31.jpg";
import set32 from "./set-32.jpg";
import set33 from "./set-33.jpg";
import set34 from "./set-34.jpg";
import set35 from "./set-35.jpg";
import set36 from "./set-36.jpg";
import set37 from "./set-37.jpg";
import set38 from "./set-38.jpg";
import set39 from "./set-39.jpg";
import set40 from "./set-40.jpg";
import set41 from "./set-41.jpg";
import set42 from "./set-42.jpg";
import set43 from "./set-43.jpg";
import set44 from "./set-44.jpg";
import set45 from "./set-45.jpg";
import set46 from "./set-46.jpg";
import set47 from "./set-47.jpg";
import set48 from "./set-48.jpg";
import set49 from "./set-49.jpg";
import set50 from "./set-50.jpg";

export const bibleRenderedImages: Record<number, string> = {
  1: set01,
  2: set02,
  3: set03,
  4: set04,
  5: set05,
  6: set06,
  7: set07,
  8: set08,
  9: set09,
  10: set10,
  11: set11,
  12: set12,
  13: set13,
  14: set14,
  15: set15,
  16: set16,
  17: set17,
  18: set18,
  19: set19,
  20: set20,
  21: set21,
  22: set22,
  23: set23,
  24: set24,
  25: set25,
  26: set26,
  27: set27,
  28: set28,
  29: set29,
  30: set30,
  31: set31,
  32: set32,
  33: set33,
  34: set34,
  35: set35,
  36: set36,
  37: set37,
  38: set38,
  39: set39,
  40: set40,
  41: set41,
  42: set42,
  43: set43,
  44: set44,
  45: set45,
  46: set46,
  47: set47,
  48: set48,
  49: set49,
  50: set50,
  51: set50, // Rev 17-22 uses the original set 50 image
};

export const getBibleRenderedImage = (setNumber: number): string | undefined => {
  if (setNumber < 1 || setNumber > 51) {
    return undefined;
  }
  return bibleRenderedImages[setNumber];
};

export default bibleRenderedImages;
