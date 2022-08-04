import { atom } from "recoil";

export const phaseAtom = atom({
  key: "phase",
  default: 0,
});

export const betAmountAtom = atom({
  key: "betAmount",
  default: 0,
});
