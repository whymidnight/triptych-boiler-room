import { Metaplex } from "@metaplex-foundation/js-next";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Transaction, Message } from "@solana/web3.js";

import { Box, Grid, CircularProgress } from "@mui/material";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useRecoilState } from "recoil";
import { PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection } from "@solana/web3.js";
import axios from "axios";

/*
import {
  get_quests,
  get_quested,
  enroll_questor,
  enroll_questees,
  start_quests,
  end_quests,
  do_rngs,
  mint_rewards,
  get_rewards,
} from "../../wasm_fns/questing";
*/
import {
  resyncAtom,
  nftsAtom,
  nftsSelectionAtom,
  nftsQuestedAtom,
  nftsQuestedExhaustAtom,
  questsAtom,
  questedAtom,
  questsSelectionAtom,
  questsProgressionAtom,
  showCompletedAtom,
  showStartedAtom,
  pairingsAtom,
  questsProposalsAtom,
  recoveryStateAtom,
  activeQuestProposalsAtom,
  globalEnumAtom,
  stakingProgressionAtom,
  questsKPIsAtom,
  questTabsAtom,
  refreshIntervalAtom,
  shouldRefreshIntervalAtom,
  loadingAtom,
} from "./state/atoms";
import { StyledCard } from "../../components/cards";

import Snackbar from "@mui/material/Snackbar";
import { Stack } from "@mui/material";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import AppBar from "@mui/material/AppBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";

import { NFTGalleryItems, QuestStart } from "./enrollment";
import { QuestedGalleryItems, QuestedGalleryItemsHeader } from "./manage";
import { QuestAction } from "./rewards";
import { exec } from "child_process";

declare function get_quests(oracle: String): Promise<any>;
declare function get_quests_kpis(oracle: String, holder: String): Promise<any>;
declare function get_quests_proposals(
  oracle: String,
  holder: String
): Promise<any>;
declare function select_quest(wallet_publicKey: String): Promise<any>;
declare function new_quest_proposal(
  wallet_publicKey: String,
  quest: String,
  depositingLeft: String,
  depositingRight: String
): Promise<any>;
declare function onboard_from_singletons(
  wallet_publicKey: String,
  quest: String,
  depositing: String
): Promise<any>;
declare function flush_quest_records(
  wallet_publicKey: String,
  quest: String,
  proposalIndexes: String
): Promise<any>;
declare function start_quests(
  holder: String,
  quest: String,
  proposalIndexes: String
): Promise<any>;
declare function claim_quest_staking_rewards(
  holder: String,
  quest: String,
  proposalIndexes: String
): Promise<any>;
declare function end_quests(
  holder: String,
  quest: String,
  proposalIndexes: String
): Promise<any>;
declare function do_rngs(
  wallet_publicKey: String,
  questees: String,
  oracle: String,
  questIndex: String
): Promise<any>;
declare function mint_rewards(
  wallet_publicKey: String,
  questees: String,
  oracle: String,
  questIndex: String
): Promise<any>;
declare function get_rewards(
  wallet_publicKey: String,
  questees: String,
  oracle: String,
  questIndex: String
): Promise<any>;

export const ORACLE = new PublicKey(
  "BqVJxUsAfWdgTz6i5SCHYKNPxmU7ofHH9WPKpdD63iiE"
);
export const CONNECTION = "https://devnet.genesysgo.net";

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

//@ts-ignore
export const QuestsGalleryItems = ({
  onSelection,
  onManage,
  onReward,
  onRecover,
}) => {
  const [loading, setLoading] = useRecoilState(loadingAtom);
  const [questsProposals, setQuestsProposals] =
    useRecoilState(questsProposalsAtom);
  const [quests] = useRecoilState(questsAtom);
  const [quested] = useRecoilState(questedAtom);
  const [nftsQuestedExhaust] = useRecoilState(nftsQuestedExhaustAtom);
  const [questsKeys, setQuestsKeys] = useState([]);
  const [tab, setTab] = useRecoilState(questTabsAtom);
  const [refreshInterval, setRefreshInterval] =
    useRecoilState(refreshIntervalAtom);
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };
  const [shouldRefreshInterval, setShouldRefreshInterval] = useRecoilState(
    shouldRefreshIntervalAtom
  );

  // 4jAu28eBUWzqNkYCLC17rWBCDEhs47juszS6dsABpkrw, 6tzi4GYZMTrCv9gJi6iXBC2eheD9EZBMBUxM1WHAibd8
  useEffect(() => {
    const wlQuests = [];

    const keys = Object.keys(quests);
    switch (tab) {
      case 0: {
        setQuestsKeys(
          keys.filter((quest) => !wlQuests.some((wlQuest) => wlQuest === quest))
        );
        break;
      }
      case 1: {
        setQuestsKeys(
          keys.filter((quest) => wlQuests.some((wlQuest) => wlQuest === quest))
        );
        break;
      }
      case 2: {
        setQuestsKeys([]);
        break;
      }
    }
  }, [quests, tab, setQuestsKeys]);

  const handleIntervalChange = useCallback((event: SelectChangeEvent) => {
    setRefreshInterval(Number(event.target.value));
  }, []);

  return (
    <>
      <Tabs value={tab} onChange={handleTabChange} centered>
        <Tab label="Staking Quests" />
        <Tab label="Whitelist Quests" />
      </Tabs>
      <Grid justifyContent="center" alignItems="center" container>
        {(() => {
          switch (tab) {
            case 2: {
              setShouldRefreshInterval(false);
              setLoading(false);
              return <StyledCard></StyledCard>;
            }
            default: {
              return questsKeys.map((quest) => {
                return (
                  <>
                    <Grid xs={10} sm={3} key={quest}>
                      <Box textAlign="center">
                        <StyledCard>
                          <StyledCard sx={{ padding: "5%" }}>
                            <Typography
                              gutterBottom
                              variant="h5"
                              component="div"
                            >
                              {quests[quest].Name}
                            </Typography>
                            <Typography
                              gutterBottom
                              variant="h5"
                              component="div"
                            >
                              {
                                //@ts-ignore
                                String("Quest")
                              }
                            </Typography>
                          </StyledCard>
                          <Grid
                            container
                            alignItems="center"
                            justifyContent="center"
                          >
                            <Grid item xs={12} sx={{ padding: "5% 0%" }}>
                              <QuestedGalleryItemsHeader
                                quest={quest}
                                kpis={[
                                  "totalStaked",
                                  quests[quest].StakingConfig !== null
                                    ? "stakingReward"
                                    : "",
                                ]}
                              />
                            </Grid>
                            <Grid item xs={12} sx={{ padding: "5% 0%" }}>
                              <QuestedGalleryItemsHeader
                                quest={quest}
                                kpis={[
                                  quests[quest].Tender !== null
                                    ? "entryCost"
                                    : "",
                                  "type",
                                ]}
                              />
                            </Grid>
                            <Grid item xs={12} sx={{ padding: "5% 0%" }}>
                              <QuestedGalleryItemsHeader
                                quest={quest}
                                kpis={[
                                  quests[quest].StakingConfig !== null
                                    ? "payoutMeta"
                                    : "",
                                ]}
                              />
                            </Grid>
                          </Grid>
                          <CardContent>
                            <Typography
                              gutterBottom
                              variant="h5"
                              component="div"
                              sx={{ paddingTop: "2px" }}
                            >
                              Layout:
                            </Typography>
                            <Grid container>
                              <Grid item xs={5} sx={{ padding: "10px" }}>
                                <Typography
                                  align="right"
                                  gutterBottom
                                  variant="h5"
                                  component="div"
                                >
                                  {
                                    //@ts-ignore
                                    String(
                                      //@ts-ignore
                                      quests.hasOwnProperty(quest)
                                        ? quests[quest].PairsConfig.Left
                                        : 0
                                    )
                                  }
                                </Typography>
                              </Grid>
                              <Grid item xs={7} sx={{ padding: "10px" }}>
                                <Typography
                                  align="left"
                                  gutterBottom
                                  variant="h5"
                                  component="div"
                                >
                                  {
                                    //@ts-ignore
                                    String("Gen One's")
                                  }
                                </Typography>
                              </Grid>
                            </Grid>
                            <Grid container>
                              <Grid item xs={5} sx={{ padding: "10px" }}>
                                <Typography
                                  align="right"
                                  gutterBottom
                                  variant="h5"
                                  component="div"
                                >
                                  {
                                    //@ts-ignore
                                    String(
                                      //@ts-ignore
                                      quests.hasOwnProperty(quest)
                                        ? quests[quest].PairsConfig.Right
                                        : 0
                                    )
                                  }
                                </Typography>
                              </Grid>
                              <Grid item xs={7} sx={{ padding: "10px" }}>
                                <Typography
                                  align="left"
                                  gutterBottom
                                  variant="h5"
                                  component="div"
                                >
                                  {
                                    //@ts-ignore
                                    String("Gen Two's")
                                  }
                                </Typography>
                              </Grid>
                            </Grid>
                          </CardContent>
                          <CardActions style={{ justifyContent: "center" }}>
                            <Button
                              variant="outlined"
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                              disabled={
                                questsProposals.hasOwnProperty(quest) &&
                                questsProposals[quest].filter(
                                  //@ts-ignore
                                  ({ Started, Finished }) =>
                                    Started && !Finished
                                ).length > 0
                                  ? false
                                  : true
                              }
                              onClick={(event) => onManage(event, quest)}
                              size="small"
                            >
                              Manage
                            </Button>
                            <Button
                              variant="outlined"
                              style={{
                                display: "flex",
                                justifyContent: "center",
                                alignItems: "center",
                              }}
                              onClick={(event) => onSelection(event, quest)}
                              size="small"
                            >
                              Begin
                            </Button>
                            {/*
                             * EXPERIMENTAL RECOVERY
                            questsProposals.hasOwnProperty(quest) &&
                              questsProposals[quest].filter(
                                (item) =>
                                  !item.Started &&
                                  !item.Withdrawn &&
                                  (item.StartTime === null ||
                                    item.StartTime === 0)
                              ).length > 0 && (
                                <Button
                                  variant="outlined"
                                  style={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                  }}
                                  onClick={(event) => onRecover(event, quest)}
                                  size="small"
                                >
                                  Recover
                                </Button>
                              )
                              */}
                            {quests.hasOwnProperty(quest) &&
                              quests[quest].StakingConfig !== null && (
                                <Button
                                  variant="outlined"
                                  disabled={
                                    quests.hasOwnProperty(quest) &&
                                    quests[quest].StakingConfig !== null &&
                                    questsProposals.hasOwnProperty(quest) &&
                                    questsProposals[quest].filter(
                                      //@ts-ignore
                                      ({ Started, Finished }) =>
                                        Started && !Finished
                                    ).length > 0
                                      ? false
                                      : true
                                  }
                                  onClick={(event) => onReward(event, quest)}
                                  size="small"
                                >
                                  Rewards
                                </Button>
                              )}
                          </CardActions>
                        </StyledCard>
                      </Box>
                    </Grid>
                  </>
                );
              });
            }
          }
        })()}
      </Grid>
    </>
  );
};

export const QuestsGallery = () => {
  const connection = useMemo(() => new Connection(CONNECTION), []);

  const wallet = useWallet();
  const [nfts, setNfts] = useRecoilState(nftsAtom);
  const [quests, setQuests] = useRecoilState(questsAtom);
  const [questsKPIs, setQuestsKPIs] = useRecoilState(questsKPIsAtom);
  const [questsProposals, setQuestsProposals] =
    useRecoilState(questsProposalsAtom);
  const [activeQuestProposals, setActiveQuestProposals] = useRecoilState(
    activeQuestProposalsAtom
  );
  const [, setQuested] = useRecoilState(questedAtom);
  const [questSelection, setQuestsSelection] =
    useRecoilState(questsSelectionAtom);
  const [nftsSelection, setNftsSelection] = useRecoilState(nftsSelectionAtom);
  const [nftsQuested] = useRecoilState(nftsQuestedAtom);
  const [nftsQuestedExhaust, setNftsQuestedExhaust] = useRecoilState(
    nftsQuestedExhaustAtom
  );
  const [showCompleted, setShowCompleted] = useRecoilState(showCompletedAtom);
  const [globalEnum, setGlobalEnum] = useRecoilState(globalEnumAtom);
  const [showStarted, setShowStarted] = useRecoilState(showStartedAtom);
  const [questsProgression, setQuestsProgression] = useRecoilState(
    questsProgressionAtom
  );

  const [recoveryState, setRecoveryState] = useRecoilState(recoveryStateAtom);

  const [activate, setActivate] = useState(true);
  const [pairings, setPairings] = useRecoilState(pairingsAtom);
  const [stakingProgression, setStakingProgression] = useRecoilState(
    stakingProgressionAtom
  );

  const [resync, setResync] = useRecoilState(resyncAtom);
  const [open, setOpen] = React.useState(false);
  const [openMessage, setOpenMessage] = React.useState("");
  const [refreshInterval, setRefreshInterval] =
    useRecoilState(refreshIntervalAtom);
  const [shouldRefreshInterval, setShouldRefreshInterval] = useRecoilState(
    shouldRefreshIntervalAtom
  );
  const [loading, setLoading] = useRecoilState(loadingAtom);
  const [index, setIndex] = React.useState(0);
  const [LOADING_MSGS, setLoadingMessages] = useState([
    "Fetching Quests",
    "Fetching NFTs",
  ]);
  const [walletPublicKey, setWalletPublicKey] = useState<PublicKey | null>(
    null
  );

  React.useEffect(() => {
    if (!wallet.publicKey) return;

    setWalletPublicKey(wallet.publicKey);
    // setWalletPublicKey(new PublicKey(""))
  }, [wallet]);

  React.useEffect(() => {
    const intervalId = setInterval(
      () => setIndex((index) => index + 1),
      3000 // every 3 seconds
    );
    return () => clearTimeout(intervalId);
  }, []);

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  async function fetchQuests() {
    if (!walletPublicKey) {
      return;
    }
    if (!shouldRefreshInterval) return;

    try {
      const requests = await Promise.allSettled([
        get_quests(ORACLE.toString()),
        get_quests_proposals(ORACLE.toString(), walletPublicKey.toString()),
        get_quests_kpis(ORACLE.toString(), walletPublicKey.toString()),
      ]);

      const questsJson = requests[0];
      const questsProposalsJson = requests[1];
      const questsKPIsJson = requests[2];

      //@ts-ignore
      const quests = JSON.parse(String.fromCharCode(...questsJson.value));
      const questsProposals = JSON.parse(
        //@ts-ignore
        String.fromCharCode(...questsProposalsJson.value)
      );
      const questsKPIs = JSON.parse(
        //@ts-ignore
        String.fromCharCode(...questsKPIsJson.value)
      );

      console.log(quests);
      setQuests(quests);
      setQuestsProposals(questsProposals);
      setQuestsKPIs(questsKPIs);
      console.log("auto-refreshed quests");
    } catch (e) {
      console.log(e);
      console.log("failed to auto-refresh kpis");
    }
    setLoading(false);
  }

  useEffect(() => {
    if (shouldRefreshInterval === false) return;
    const interval = setInterval(fetchQuests, refreshInterval * 1000);
    return () => clearInterval(interval);
  }, [wallet, walletPublicKey, refreshInterval, shouldRefreshInterval]);

  useEffect(() => {
    async function fetchNfts() {
      if (!walletPublicKey) {
        return;
      }

      let myNfts = await Promise.all(
        (
          await Metaplex.make(new Connection(CONNECTION))
            .nfts()
            //@ts-ignore
            // .findAllByOwner(walletPublicKey.toBase58())
            .findAllByOwner(walletPublicKey.toBase58())
        ).map(async (nft) => {
          let offchainMetadata = {};
          try {
            // offchainMetadata = (await axios.get(nft.uri)).data;
          } catch (e) {
            console.log("fail");
          }
          return { ...nft, offchainMetadata };
        })
      );

      //@ts-ignore
      setNfts(myNfts);
      //@ts-ignore
      setNftsSelection(myNfts.map(() => false));
    }
    fetchNfts();
  }, [
    wallet,
    walletPublicKey,
    walletPublicKey,
    resync,
    setNfts,
    setNftsSelection,
  ]);

  const onBack = useCallback(
    (_) => {
      async function fetchQuestProposals() {
        const questsProposalsJson = await get_quests_proposals(
          ORACLE.toString(),
          walletPublicKey.toString()
        );
        const questsProposals = JSON.parse(
          String.fromCharCode(...questsProposalsJson)
        );

        setQuestsProposals(questsProposals);
      }

      fetchQuestProposals();

      if (questsProgression === 1) {
        setShouldRefreshInterval(false);
        if (stakingProgression - 1 < 0) {
          setQuestsProgression(questsProgression - 1);
          return;
        }
        if (
          stakingProgression === 1 &&
          quests[questSelection].PairsConfig.Left === 0
        ) {
          setQuestsProgression(0);
          return;
        }
        setStakingProgression(stakingProgression - (1 % 2));
        return;
      }
      if (questsProgression - 1 === 0 || questsProgression + 1 === 0) {
        setPairings({
          // @ts-ignore
          genOneDraggable: [],
          genOneStaking: [],
          genTwoDraggable: [],
          genTwoStaking: [],
        });
        setShouldRefreshInterval(true);
      }
      if (questsProgression > 0) setQuestsProgression(questsProgression - 1);
      if (questsProgression < 0) setQuestsProgression(questsProgression + 1);
    },
    [
      quests,
      questSelection,
      questsProgression,
      setQuestsProgression,
      stakingProgression,
      setShouldRefreshInterval,
    ]
  );
  const onRecover = useCallback(
    (_, quest) => {
      async function flush() {
        const recoveries = nftsQuested.filter(
          (_, index) => recoveryState[index]
        );

        // flush quest records
        try {
          const flushRecordsTxs = JSON.parse(
            String.fromCharCode(
              ...(await flush_quest_records(
                // @ts-ignore
                walletPublicKey.toString(),
                questSelection,
                // @ts-ignore
                JSON.stringify(recoveries.map((item) => item.index))
              ))
            )
          );

          if (flushRecordsTxs.length > 0) {
            for (const flushTxB of flushRecordsTxs) {
              try {
                let flushTx = Transaction.populate(
                  new Message(flushTxB.message)
                );
                flushTx.recentBlockhash = (
                  await connection.getRecentBlockhash("finalized")
                ).blockhash;
                setOpenMessage("Please Approve Quest Withdrawal Transaction.");
                setOpen(true);
                flushTx = await wallet.signTransaction(flushTx);
                const signature = await connection.sendRawTransaction(
                  flushTx.serialize()
                );
                setOpen(true);
                setOpenMessage("Quest Withdrawal Transaction Submitted.");
                console.log(signature);
                setOpen(true);
                setOpenMessage("Quest Withdrawal Transaction Succeeded.");
                await connection.confirmTransaction(signature, "confirmed");
              } catch (e) {
                setOpenMessage("Quest Withdrawal Transaction Failed. :(");
                setOpen(true);
              }
            }
          }
        } catch (e) {
          setOpenMessage(e.message);
          setOpen(true);

          await new Promise((resolve) => setTimeout(resolve, 2 * 1000));
        }
        setQuestsSelection("");
        setQuestsProgression(0);
        setShouldRefreshInterval(true);
      }

      async function claimRewards() {
        const recoveries = nftsQuested.filter(
          (_, index) => recoveryState[index]
        );

        // flush quest records
        try {
          const flushRecordsTxs = JSON.parse(
            String.fromCharCode(
              ...(await claim_quest_staking_rewards(
                // @ts-ignore
                walletPublicKey.toString(),
                questSelection,
                // @ts-ignore
                JSON.stringify(recoveries.map((item) => item.index))
              ))
            )
          );

          if (flushRecordsTxs.length > 0) {
            for (const flushTxB of flushRecordsTxs) {
              try {
                let flushTx = Transaction.populate(
                  new Message(flushTxB.message)
                );
                flushTx.recentBlockhash = (
                  await connection.getRecentBlockhash("finalized")
                ).blockhash;
                setOpenMessage("Please Approve Claim Reward Transaction.");
                setOpen(true);
                flushTx = await wallet.signTransaction(flushTx);
                const signature = await connection.sendRawTransaction(
                  flushTx.serialize()
                );
                console.log(signature);
                setOpen(true);
                setOpenMessage("Claim Reward Transaction Submitted!");
                await connection.confirmTransaction(signature, "confirmed");
                setOpen(true);
                setOpenMessage("Claim Reward Transaction Succeeded!");
              } catch (e) {
                setOpen(true);
                setOpenMessage("Claim Reward Transaction Failed! :(");
              }
            }
          }
        } catch (e) {
          setOpenMessage(e.message);
          setOpen(true);

          await new Promise((resolve) => setTimeout(resolve, 2 * 1000));
        }
      }

      async function endQuests() {
        const recoveries = nftsQuested.filter(
          (_, index) => recoveryState[index]
        );

        // flush quest records
        try {
          const flushRecordsTxs = JSON.parse(
            String.fromCharCode(
              ...(await end_quests(
                // @ts-ignore
                walletPublicKey.toString(),
                questSelection,
                // @ts-ignore
                JSON.stringify(recoveries.map((item) => item.index))
              ))
            )
          );

          if (Object.keys(flushRecordsTxs).length > 0) {
            try {
              for (const flushTxB of flushRecordsTxs) {
                let flushTx = Transaction.populate(
                  new Message(flushTxB.message)
                );
                flushTx.recentBlockhash = (
                  await connection.getRecentBlockhash("finalized")
                ).blockhash;
                setOpenMessage("Please Approve Quest End Transaction.");
                setOpen(true);
                flushTx = await wallet.signTransaction(flushTx);
                const signature = await connection.sendRawTransaction(
                  flushTx.serialize()
                );
                setOpen(true);
                setOpenMessage("Quest End Transaction Submitted!");
                console.log(signature);
                setOpen(true);
                setOpenMessage("Refreshing!");

                connection
                  .confirmTransaction(signature, "finalized")
                  .then(async (_) => {
                    if (
                      quests[questSelection].Rewards !== null &&
                      quests[questSelection].Rewards.length > 0
                    ) {
                      const transactionResponse =
                        await connection.getTransaction(signature);
                      if (!transactionResponse.meta.logMessages) return;
                      if (
                        transactionResponse.meta.logMessages.filter((line) =>
                          line.includes("minted reward")
                        ).length === 1
                      ) {
                        setOpen(true);
                        setOpenMessage("Congratulations! You won!");
                      } else {
                        setOpen(true);
                        setOpenMessage(
                          "Sorry! You did not win a Quest Reward!"
                        );
                      }
                    }
                  });
              }
            } catch (e) {
              console.log(e);
              setOpenMessage("Quest End Transaction Failed. :(");
              setOpen(true);
            }
          }
        } catch (e) {
          setOpenMessage(e.message);
          setOpen(true);

          await new Promise((resolve) => setTimeout(resolve, 2 * 1000));
        }
        await gc();
        setQuestsSelection("");
        setQuestsProgression(0);
        setShouldRefreshInterval(true);
      }

      async function gc() {
        const questsProposalsJson = await get_quests_proposals(
          ORACLE.toString(),
          walletPublicKey.toString()
        );
        const questsProposals = JSON.parse(
          String.fromCharCode(...questsProposalsJson)
        );

        setQuestsProposals(questsProposals);
      }

      async function executor() {
        if (questsProgression === -1) {
          if (globalEnum === "recover") {
            await flush();
          }
          if (globalEnum === "reward") {
            await claimRewards();
          }
          if (globalEnum === "manage") {
            await endQuests();
          }
        } else {
          setShowStarted(false);
          setShowCompleted(false);
          setQuestsSelection(quest);
          setQuestsProgression(-1);
          setShouldRefreshInterval(false);
          setGlobalEnum("recover");
        }
      }

      executor();
    },
    [
      wallet,
      walletPublicKey,
      quests,
      questsProgression,
      setQuestsProgression,
      recoveryState,
      setOpen,
      setOpenMessage,
      setQuestsProposals,
      setShouldRefreshInterval,
    ]
  );
  const onNext = useCallback(
    (_) => {
      async function newQuestProposal() {
        if (wallet === null) {
          return;
        }
        if (
          quests[questSelection].PairsConfig.Left === 1 &&
          quests[questSelection].PairsConfig.Right === 0
        ) {
          try {
            const onboardTxs = JSON.parse(
              String.fromCharCode(
                ...(await onboard_from_singletons(
                  // @ts-ignore
                  walletPublicKey.toString(),
                  questSelection,
                  JSON.stringify(
                    nftsSelection[0]
                      // @ts-ignore
                      .map(({ mint }) => mint.toString())
                  )
                ))
              )
            );

            if (onboardTxs.length > 0) {
              for (const onboardTx of onboardTxs) {
                try {
                  let enrollQuesteesTx = Transaction.populate(
                    new Message(onboardTx.message)
                  );
                  enrollQuesteesTx.recentBlockhash = (
                    await connection.getRecentBlockhash("finalized")
                  ).blockhash;
                  setOpenMessage("Please Approve Quest Start Transaction.");
                  setOpen(true);
                  enrollQuesteesTx = await wallet.signTransaction(
                    enrollQuesteesTx
                  );
                  const signature = await connection.sendRawTransaction(
                    enrollQuesteesTx.serialize()
                  );
                  setOpen(true);
                  setOpenMessage("Quest Start Transaction Submitted.");
                  console.log(signature);
                  await connection.confirmTransaction(signature, "confirmed");
                  setOpen(true);
                  setOpenMessage("Quest Start Transaction Succeeded.");
                } catch (e) {
                  setOpenMessage("Quest Start Transaction Failed. :(");
                  setOpen(true);
                }
              }
            }
          } catch (e) {
            setOpenMessage(e.message);
            setOpen(true);

            await new Promise((resolve) => setTimeout(resolve, 2 * 1000));
          }
          setQuestsProgression(0);
          setShouldRefreshInterval(true);
        } else {
          try {
            const enrollQuesteesIx = JSON.parse(
              String.fromCharCode(
                ...(await new_quest_proposal(
                  // @ts-ignore
                  walletPublicKey.toString(),
                  questSelection,
                  JSON.stringify(
                    nftsSelection[0]
                      // @ts-ignore
                      .map(({ mint }) => mint.toString())
                  ),
                  JSON.stringify(
                    nftsSelection[1]
                      // @ts-ignore
                      .map(({ mint }) => mint.toString())
                  )
                ))
              )
            );

            if (Object.keys(enrollQuesteesIx).length > 0) {
              setActiveQuestProposals([enrollQuesteesIx.proposalIndex]);

              try {
                let enrollQuesteesTx = Transaction.populate(
                  new Message(enrollQuesteesIx.transaction.message)
                );
                enrollQuesteesTx.recentBlockhash = (
                  await connection.getRecentBlockhash("finalized")
                ).blockhash;
                setOpenMessage("Please Approve Quest Start Transaction.");
                setOpen(true);
                enrollQuesteesTx = await wallet.signTransaction(
                  enrollQuesteesTx
                );
                const signature = await connection.sendRawTransaction(
                  enrollQuesteesTx.serialize()
                );
                setOpenMessage("Quest Start Transaction Submitted.");
                setOpen(true);
                console.log(signature);
                await connection.confirmTransaction(signature, "confirmed");
                setOpenMessage("Quest Start Transaction Succeeded.");
                setOpen(true);
              } catch (e) {
                setOpenMessage("Quest Start Transaction Failed. :(");
                setOpen(true);
              }
            }
          } catch (e) {
            setOpenMessage(e.message);
            setOpen(true);

            await new Promise((resolve) => setTimeout(resolve, 2 * 1000));
          }
          /*
          setQuestsProgression(2);
          setShouldRefreshInterval(false);
          */
          setQuestsSelection("");
          setQuestsProgression(0);
          setShouldRefreshInterval(true);
        }
      }

      async function doRngs() {
        const doRngsIx = JSON.parse(
          String.fromCharCode(
            ...(await do_rngs(
              // @ts-ignore
              walletPublicKey.toString(),
              JSON.stringify(
                nftsQuested
                  .filter((_, nftIndex) => nftsSelection[nftIndex])
                  // @ts-ignore
                  .map(({ mint }) => mint.toString())
              ),
              ORACLE.toString(),
              // @ts-ignore
              String(quests[questSelection].Index)
            ))
          )
        );

        if (Object.keys(doRngsIx).length > 0) {
          let doRngsTx = Transaction.populate(new Message(doRngsIx.message));
          doRngsTx.recentBlockhash = (
            await connection.getRecentBlockhash("finalized")
          ).blockhash;
          doRngsTx = await wallet.signTransaction(doRngsTx);
          const signature = await connection.sendRawTransaction(
            doRngsTx.serialize()
          );
          console.log(signature);
          await connection.confirmTransaction(signature, "confirmed");
        }
        setQuestsProgression(-2);
        setShouldRefreshInterval(false);
        return;
      }

      async function gc() {
        const questsProposalsJson = await get_quests_proposals(
          ORACLE.toString(),
          walletPublicKey.toString()
        );
        const questsProposals = JSON.parse(
          String.fromCharCode(...questsProposalsJson)
        );

        setQuestsProposals(questsProposals);
      }

      async function executor() {
        if (questsProgression > 0) {
          if (
            quests[questSelection].PairsConfig.Left +
              quests[questSelection].PairsConfig.Right ===
            [...nftsSelection[0], ...nftsSelection[1]].length
          ) {
            await newQuestProposal();
          } else {
            if (
              quests[questSelection].PairsConfig.Left === 1 &&
              quests[questSelection].PairsConfig.Right === 0
            ) {
              await newQuestProposal();
            } else {
              setStakingProgression((1 + stakingProgression) % 2);
            }
          }
        }

        if (questsProgression < 0) {
          if (showCompleted) {
            await doRngs();
          } else {
            setQuestsProgression(-2);
            setShouldRefreshInterval(false);
          }
        }
      }

      executor();
    },
    [
      wallet,
      walletPublicKey,
      connection,
      questSelection,
      questsProgression,
      nfts,
      nftsSelection,
      setQuestsProgression,
      nftsQuested,
      quests,
      showCompleted,
      stakingProgression,
      setOpen,
      setOpenMessage,
      setShouldRefreshInterval,
    ]
  );
  const onManage = useCallback(
    (_, quest) => {
      setResync(resync + 1);
      setShowStarted(true);
      setShowCompleted(false);
      setQuestsSelection(quest);
      setQuestsProgression(-1);
      setShouldRefreshInterval(false);
      setGlobalEnum("manage");
    },
    [
      resync,
      setQuestsProgression,
      setShouldRefreshInterval,
      setQuestsSelection,
      setResync,
      setShowCompleted,
    ]
  );
  const onReward = useCallback(
    (_, quest) => {
      setGlobalEnum("reward");
      setQuestsSelection(quest);
      setShowStarted(true);
      setShowCompleted(true);
      setResync(resync + 1);
      setQuestsProgression(-1);
      setShouldRefreshInterval(false);
    },
    [
      resync,
      setQuestsProgression,
      setShouldRefreshInterval,
      setQuestsSelection,
      setResync,
      setShowCompleted,
    ]
  );
  const onQuestSelection = useCallback(
    (_, quest) => {
      async function selectQuest() {
        const selectQuestIx = JSON.parse(
          String.fromCharCode(
            // @ts-ignore
            ...(await select_quest(walletPublicKey.toString(), quest))
          )
        );

        if (Object.keys(selectQuestIx).length > 0) {
          try {
            let selectQuestTx = Transaction.populate(
              new Message(selectQuestIx.message)
            );
            console.log(selectQuestTx);
            const recentBlockhash = (
              await connection.getRecentBlockhash("finalized")
            ).blockhash;
            selectQuestTx.recentBlockhash = recentBlockhash;
            setOpenMessage("Please Approve Quest Selection Transaction.");
            setOpen(true);
            selectQuestTx = await wallet.signTransaction(selectQuestTx);
            const signature = await connection.sendRawTransaction(
              selectQuestTx.serialize()
            );
            setOpenMessage("Quest Selection Submitted.");
            setOpen(true);
            console.log(signature);
            await connection.confirmTransaction(signature, "confirmed");
            setOpenMessage("Quest Selection Succeeded.");
            setOpen(true);
          } catch (e) {
            setOpen(true);
            setOpenMessage("Quest Selection Failed. :(");
            return;
          }
        }
        setShowCompleted(false);
        setResync(resync + 1);
        setQuestsSelection(quest);
        setQuestsProgression(1);
        setShouldRefreshInterval(false);
        setGlobalEnum("enrollment");

        /*
          Set appropriate Staking Progression
            on `quest.PairsConfig`
        */
        setStakingProgression(0);
        if (quests[quest].PairsConfig.Left === 0) {
          setStakingProgression(1);
        }
      }

      setActiveQuestProposals([]);

      setNfts([]);
      setPairings({
        // @ts-ignore
        genOneDraggable: [],
        genOneStaking: [],
        genTwoDraggable: [],
        genTwoStaking: [],
      });
      selectQuest();
    },
    [
      connection,
      resync,
      nfts,
      wallet,
      walletPublicKey,
      quests,
      setQuestsSelection,
      setQuestsProgression,
      setShouldRefreshInterval,
      setNftsSelection,
      setResync,
      setShowCompleted,
      setActiveQuestProposals,
      setGlobalEnum,
      setOpen,
      setOpenMessage,
    ]
  );

  const onQuestStart = useCallback(
    (_, quest) => {
      async function startQuests() {
        if (activeQuestProposals.length === 0) return;
        const startQuestsIx = JSON.parse(
          String.fromCharCode(
            ...(await start_quests(
              // @ts-ignore
              walletPublicKey.toString(),
              quest,
              JSON.stringify(activeQuestProposals)
            ))
          )
        );

        if (Object.keys(startQuestsIx).length > 0) {
          try {
            let startQuestsTx = Transaction.populate(
              new Message(startQuestsIx.message)
            );
            startQuestsTx.recentBlockhash = (
              await connection.getRecentBlockhash("finalized")
            ).blockhash;
            setOpen(true);
            setOpenMessage("Please Approve Start Quest Transaction.");
            startQuestsTx = await wallet.signTransaction(startQuestsTx);
            const signature = await connection.sendRawTransaction(
              startQuestsTx.serialize()
            );
            setOpenMessage("Start Quest Transaction Submitted.");
            setOpen(true);
            console.log(signature);
            await connection.confirmTransaction(signature, "confirmed");
            setOpenMessage("Start Quest Transaction Succeeded.");
            setOpen(true);
          } catch (e) {
            setOpen(true);
            setOpenMessage("Start Quest Transaction Failed.");
          }
          setQuestsProgression(0);
          setShouldRefreshInterval(true);
        }
      }

      startQuests();
    },
    [
      connection,
      quests,
      nfts,
      nftsSelection,
      wallet,
      walletPublicKey,
      setQuestsProgression,
      setShouldRefreshInterval,
      activeQuestProposals,
      setOpen,
      setOpenMessage,
    ]
  );

  const onQuestAction = useCallback(
    (_, quest) => {
      async function makeClaims() {
        const makeClaimsTxs = JSON.parse(
          String.fromCharCode(
            ...(await mint_rewards(
              // @ts-ignore
              walletPublicKey.toString(),
              JSON.stringify(
                nftsQuested
                  .filter((_, nftIndex) => nftsSelection[nftIndex])
                  // @ts-ignore
                  .map(({ mint }) => mint.toString())
              ),
              ORACLE.toString(),
              // @ts-ignore
              String(quests[quest].Index)
            ))
          )
        );

        if (makeClaimsTxs.length > 0) {
          for (const mintTx of makeClaimsTxs) {
            let rewardTx = Transaction.populate(new Message(mintTx.message));
            rewardTx.recentBlockhash = (
              await connection.getRecentBlockhash("finalized")
            ).blockhash;
            rewardTx = await wallet.signTransaction(rewardTx);
            const signature = await connection.sendRawTransaction(
              rewardTx.serialize()
            );
            console.log(signature);
            await connection.confirmTransaction(signature, "confirmed");
          }
        }
      }

      async function endQuests() {
        const endQuestsIx = JSON.parse(
          String.fromCharCode(
            ...(await end_quests(
              // @ts-ignore
              wallet.publicKey.toString(),
              JSON.stringify(
                nftsQuested
                  .filter((_, nftIndex) => nftsSelection[nftIndex])
                  // @ts-ignore
                  .map(({ mint }) => mint.toString())
              ),
              ORACLE.toString(),
              // @ts-ignore
              String(quests[quest].Index)
            ))
          )
        );

        if (Object.keys(endQuestsIx).length > 0) {
          let endQuestsTx = Transaction.populate(
            new Message(endQuestsIx.message)
          );
          endQuestsTx.recentBlockhash = (
            await connection.getRecentBlockhash("finalized")
          ).blockhash;
          endQuestsTx = await wallet.signTransaction(endQuestsTx);
          const signature = await connection.sendRawTransaction(
            endQuestsTx.serialize()
          );
          console.log(signature);
          await connection.confirmTransaction(signature, "confirmed");
          setQuestsProgression(0);
          setShouldRefreshInterval(true);
        }
      }

      if (showCompleted) {
        makeClaims();
      } else {
        endQuests();
      }
    },
    [
      connection,
      showCompleted,
      quests,
      nftsQuested,
      nftsSelection,
      wallet,
      walletPublicKey,
      walletPublicKey,
      setQuestsProgression,
    ]
  );

  const onNftSelection = useCallback(
    (_, nftIndex) => {
      setNftsSelection((currNftSelection) => {
        let nftSelectionClone = Object.assign([], currNftSelection);
        // @ts-ignore
        nftSelectionClone[nftIndex] = !currNftSelection[nftIndex];
        return nftSelectionClone;
      });
    },
    [setNftsSelection]
  );

  let body;
  switch (questsProgression) {
    case -2: {
      body = <QuestAction onSelection={onQuestAction} />;
      break;
    }
    case -1: {
      body = <QuestedGalleryItems onSelection={onNftSelection} />;
      break;
    }
    case 0: {
      body = (
        <QuestsGalleryItems
          onSelection={onQuestSelection}
          onManage={onManage}
          onReward={onReward}
          onRecover={onRecover}
        />
      );
      break;
    }
    case 1: {
      body = <NFTGalleryItems onSelection={onNftSelection} />;
      break;
    }
    case 2: {
      body = <QuestStart onSelection={onQuestStart} />;
      break;
    }
  }

  const topBarXsPoints = useMemo(() => {
    var cols = 0;
    if (globalEnum === "recover") {
      console.log("waldo");
      cols += 1;
    }
    if (globalEnum === "recover" && activeQuestProposals.length > 0) {
      cols += 2;
    }
    if (questsProgression === 2 || questsProgression === 1) {
      cols += 2;
    }

    return Number(12 / cols);
  }, [globalEnum, questsProgression, activeQuestProposals]);

  const buttonText = useMemo(() => {
    switch (globalEnum) {
      case "enrollment":
        return "Recover";
      case "reward":
        return "Claim";
      case "recover":
        return "Recover";
      case "manage":
        return "Withdraw";
    }

    return "okay";
  }, [globalEnum]);

  return (
    <>
      <div
        style={{
          paddingTop: "10vh",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          overflowY: "scroll",
        }}
      >
        {questsProgression !== 0 && (
          <StyledCard>
            <Grid container>
              <Grid item xs={topBarXsPoints} sx={{ justifyContent: "center" }}>
                <StyledCard>
                  <Button
                    sx={{
                      fontSize: "1.1rem",
                      width: "-webkit-fill-available",
                      borderRadius: "25px",
                      color: "#94F3E4",
                    }}
                    onClick={onBack}
                  >
                    Back
                  </Button>
                </StyledCard>
              </Grid>
              {questsProposals.hasOwnProperty(questSelection) &&
                ((globalEnum === "manage" &&
                  recoveryState.filter((item) => item).length > 0) ||
                  (globalEnum === "reward" &&
                    recoveryState.filter((item) => item).length > 0) ||
                  (globalEnum === "recover" &&
                    activeQuestProposals.length > 0)) && (
                  <>
                    <Grid
                      item
                      xs={topBarXsPoints}
                      sx={{ justifyContent: "center" }}
                    >
                      <StyledCard>
                        <Button
                          sx={{
                            fontSize: "1.1rem",
                            width: "-webkit-fill-available",
                            borderRadius: "25px",
                            color: "#94F3E4",
                          }}
                          onClick={(event) => onRecover(event, questSelection)}
                        >
                          {buttonText}
                        </Button>
                      </StyledCard>
                    </Grid>
                  </>
                )}
              {questsProgression === 1 && (
                <Grid
                  item
                  xs={topBarXsPoints}
                  sx={{ justifyContent: "center" }}
                >
                  <StyledCard>
                    <Button
                      sx={{
                        fontSize: "1.1rem",
                        width: "-webkit-fill-available",
                        borderRadius: "25px",
                        color: "#94F3E4",
                      }}
                      onClick={onNext}
                    >
                      Next
                    </Button>
                  </StyledCard>
                </Grid>
              )}
              {(questsProgression === 2 ||
                (globalEnum === "recover" &&
                  activeQuestProposals.length > 0)) && (
                <Grid
                  item
                  xs={topBarXsPoints}
                  sx={{ justifyContent: "center" }}
                >
                  <StyledCard>
                    <Button
                      sx={{
                        fontSize: "1.1rem",
                        width: "-webkit-fill-available",
                        borderRadius: "25px",
                      }}
                      onClick={(event) => onQuestStart(event, questSelection)}
                    >
                      Start
                    </Button>
                  </StyledCard>
                </Grid>
              )}
            </Grid>
          </StyledCard>
        )}
        <Snackbar
          open={open}
          autoHideDuration={10 * 1000}
          onClose={handleClose}
          sx={{ zIndex: 100000000 }}
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
        >
          <Alert
            onClose={handleClose}
            severity="success"
            sx={{ width: "100%" }}
          >
            {openMessage}
          </Alert>
        </Snackbar>
        <StyledCard>
          {body}
          {loading === true && (
            <StyledCard>
              <Stack justifyContent="center" alignContent="center">
                <Typography gutterBottom variant="h5" component="div">
                  Loading...
                </Typography>
                <br />
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <CircularProgress />
                </div>
                <br />
                <br />
                <Typography gutterBottom variant="h5" component="div">
                  {LOADING_MSGS[index % LOADING_MSGS.length]}
                </Typography>
              </Stack>
            </StyledCard>
          )}
        </StyledCard>
      </div>
    </>
  );
};

export const XQuesting = () => {
  return (
    <>
      <QuestsGallery />
    </>
  );
};
