import {atom} from "recoil";

export const resyncAtom = atom({
  key: "resync",
  default: 0,
});
export const nftsAtom = atom({
  key: "nfts",
  default: [],
});

export const nftsSelectionAtom = atom({
  key: "nftsSelection",
  default: [],
});

export const nftsQuestedAtom = atom({
  key: "nftsQuested",
  default: [],
});
export const nftsQuestedExhaustAtom = atom({
  key: "nftsQuestedExhaust",
  default: [],
});

export const questsAtom = atom({
  key: "quests",
  default: {},
});

export const questedAtom = atom({
  key: "quested",
  default: {},
});

export const pairingsAtom = atom({
  key: "pairings",
  default: {
    genOneDraggable: [],
    genOneStaking: [],
    genTwoDraggable: [],
    genTwoStaking: [],
  },
});

export const questsSelectionAtom = atom({
  key: "questsSelection",
  default: "",
});

export const questsProgressionAtom = atom({
  key: "questsProgression",
  default: 0,
});

export const showCompletedAtom = atom({
  key: "showCompleted",
  default: false,
});

export const showStartedAtom = atom({
  key: "showStarted",
  default: false,
});

export const globalEnumAtom = atom({
  key: "globalEnum",
  default: "",
});

export const questsProposalsAtom = atom({
  key: "questsProposals",
  default: {},
});


export const activeQuestProposalsAtom = atom({
  key: "activeQuestProposals",
  default: [],
});

export const recoveryStateAtom = atom({
  key: "recoveryState",
  default: [],
});

export const stakingProgressionAtom = atom({
  key: "stakingProgression",
  default: 0,
});

export const questsKPIsAtom = atom({
  key: "questsKPIs",
  default: {},
});
