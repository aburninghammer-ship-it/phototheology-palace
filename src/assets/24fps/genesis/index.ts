// Genesis 1-24 24FPS Room Images
import genesis01 from "./genesis-01.jpg";
import genesis02 from "./genesis-02.jpg";
import genesis03 from "./genesis-03.jpg";
import genesis04 from "./genesis-04.jpg";
import genesis05 from "./genesis-05.jpg";
import genesis06 from "./genesis-06.jpg";
import genesis07 from "./genesis-07.jpg";
import genesis08 from "./genesis-08.jpg";
import genesis09 from "./genesis-09.jpg";
import genesis10 from "./genesis-10.jpg";
import genesis11 from "./genesis-11.jpg";
import genesis12 from "./genesis-12.jpg";
import genesis13 from "./genesis-13.jpg";
import genesis14 from "./genesis-14.jpg";
import genesis15 from "./genesis-15.jpg";
import genesis16 from "./genesis-16.jpg";
import genesis17 from "./genesis-17.jpg";
import genesis18 from "./genesis-18.jpg";
import genesis19 from "./genesis-19.jpg";
import genesis20 from "./genesis-20.jpg";
import genesis21 from "./genesis-21.jpg";
import genesis22 from "./genesis-22.jpg";
import genesis23 from "./genesis-23.jpg";
import genesis24 from "./genesis-24.jpg";

export const genesisImages = [
  genesis01,
  genesis02,
  genesis03,
  genesis04,
  genesis05,
  genesis06,
  genesis07,
  genesis08,
  genesis09,
  genesis10,
  genesis11,
  genesis12,
  genesis13,
  genesis14,
  genesis15,
  genesis16,
  genesis17,
  genesis18,
  genesis19,
  genesis20,
  genesis21,
  genesis22,
  genesis23,
  genesis24,
];

export const getGenesisImage = (chapter: number): string => {
  if (chapter < 1 || chapter > 24) {
    throw new Error(`Chapter ${chapter} is out of range. Must be between 1 and 24.`);
  }
  return genesisImages[chapter - 1];
};
