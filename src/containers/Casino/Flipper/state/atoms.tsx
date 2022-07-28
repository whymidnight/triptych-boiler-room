import { atom } from "recoil";

export const balanceAtom = atom({
  key: "balance",
  default: 0,
});

export const earningsAtom = atom({
  key: "earnings",
  default: 0,
});

export const betSelectionAtom = atom({
  key: "betSelection",
  default: "1",
});

export const wagerSelectionAtom = atom({
  key: "wagerSelection",
  default: "heads",
});

export const flipTransactionSignatureAtom = atom({
  key: "fliPTransactionSignature",
  default: "",
});
