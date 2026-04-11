// Genesis 1-50 24FPS Room Images (Complete Book)
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
import genesis25 from "./genesis-25.jpg";
import genesis26 from "./genesis-26.jpg";
import genesis27 from "./genesis-27.jpg";
import genesis28 from "./genesis-28.jpg";
import genesis29 from "./genesis-29.jpg";
import genesis30 from "./genesis-30.jpg";
import genesis31 from "./genesis-31.jpg";
import genesis32 from "./genesis-32.jpg";
import genesis33 from "./genesis-33.jpg";
import genesis34 from "./genesis-34.jpg";
import genesis35 from "./genesis-35.jpg";
import genesis36 from "./genesis-36.jpg";
import genesis37 from "./genesis-37.jpg";
import genesis38 from "./genesis-38.jpg";
import genesis39 from "./genesis-39.jpg";
import genesis40 from "./genesis-40.jpg";
import genesis41 from "./genesis-41.jpg";
import genesis42 from "./genesis-42.jpg";
import genesis43 from "./genesis-43.jpg";
import genesis44 from "./genesis-44.jpg";
import genesis45 from "./genesis-45.jpg";
import genesis46 from "./genesis-46.jpg";
import genesis47 from "./genesis-47.jpg";
import genesis48 from "./genesis-48.jpg";
import genesis49 from "./genesis-49.jpg";
import genesis50 from "./genesis-50.jpg";

export const genesisImages = [
  genesis01, genesis02, genesis03, genesis04, genesis05,
  genesis06, genesis07, genesis08, genesis09, genesis10,
  genesis11, genesis12, genesis13, genesis14, genesis15,
  genesis16, genesis17, genesis18, genesis19, genesis20,
  genesis21, genesis22, genesis23, genesis24, genesis25,
  genesis26, genesis27, genesis28, genesis29, genesis30,
  genesis31, genesis32, genesis33, genesis34, genesis35,
  genesis36, genesis37, genesis38, genesis39, genesis40,
  genesis41, genesis42, genesis43, genesis44, genesis45,
  genesis46, genesis47, genesis48, genesis49, genesis50,
];

export const getGenesisImage = (chapter: number): string => {
  if (chapter < 1 || chapter > 50) {
    throw new Error(`Chapter ${chapter} is out of range. Must be between 1 and 50.`);
  }
  return genesisImages[chapter - 1];
};
