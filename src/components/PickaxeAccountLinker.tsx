import { usePickaxeAccountLinker } from "@/hooks/usePickaxeAccountLinker";

/**
 * Silent component that automatically links Pickaxe premium accounts.
 * Checks if the logged-in user has a paid Pickaxe subscription and grants access.
 */
export const PickaxeAccountLinker = () => {
  usePickaxeAccountLinker();
  return null;
};
