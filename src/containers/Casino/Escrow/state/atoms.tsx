import { atom } from "recoil";

export const escrowBalanceAtom = atom({
  key: "escrowBalance",
  default: 0,
});

export const walletBalanceAtom = atom({
  key: "walletBalance",
  default: 0,
});

export const depositTransactionAtom = atom({
  key: "depositTransaction",
  default: "",
});
