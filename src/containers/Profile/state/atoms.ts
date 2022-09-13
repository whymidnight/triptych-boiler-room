import { atom } from "recoil";
import {UserData, SpaceData} from './interfaces';

export const userDataAtom = atom<UserData | null>({
  key: "userData",
  default: null,
});

export const spaceDataAtom = atom<SpaceData | null>({
  key: "spaceData",
  default: null,
});

