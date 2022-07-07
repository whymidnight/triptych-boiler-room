import {Metaplex} from "@metaplex-foundation/js-next";

import React, {useState, useEffect, useCallback, useMemo} from "react";
import {Transaction, Message} from "@solana/web3.js";

import {Box, Grid} from "@mui/material";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import {useRecoilState} from "recoil";
import {PublicKey} from "@solana/web3.js";
import {useWallet} from "@solana/wallet-adapter-react";
import {Connection} from "@solana/web3.js";
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
  questsKPIsAtom
} from "./state/atoms";
import {StyledCard} from "../../components/cards";

import {NFTGalleryItems, QuestStart} from "./enrollment";
import {QuestedGalleryItems, QuestedGalleryItemsHeader} from "./manage";
import {QuestAction} from "./rewards";

declare function get_quests(oracle: String): Promise<any>;
declare function get_quests_kpis(
  oracle: String,
  holder: String,
): Promise<any>;
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
  depositing: String,
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

export const ORACLE = new PublicKey("9fXiLRZGeipeHEMkC8kV7S7t8eNcoSrTfA9mwd6DM2t4");

//@ts-ignore
export const QuestsGalleryItems = ({
  onSelection,
  onManage,
  onReward,
  onRecover,
}) => {
  const [questsProposals, setQuestsProposals] =
    useRecoilState(questsProposalsAtom);
  const [quests] = useRecoilState(questsAtom);
  const [quested] = useRecoilState(questedAtom);
  const [nftsQuestedExhaust] = useRecoilState(nftsQuestedExhaustAtom);
  const questsKeys = Object.keys(quests);

  return (
    <Grid justifyContent="center" alignItems="center" container>
      {questsKeys.length > 0 &&
        questsKeys.map((quest) => {
          return (
            <>
              <Grid xs={10} sm={3} key={quest}>
                <Box textAlign="center">
                  <StyledCard>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <CardMedia
                        style={{height: "10vh"}}
                        component="img"
                        height="280"
                        image="https://www.arweave.net/GLeORZQuLxFzDFK0aBQKwhQUUF0-4eawXnrjdtmv5fg?ext=png"
                      />
                    </div>
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="div">
                        {
                          //@ts-ignore
                          String(
                            "Debug: " +
                            //@ts-ignore
                            quests[quest].Index +
                            " Name: " +
                            //@ts-ignore
                            quests[quest].Name
                          )
                        }
                      </Typography>
                      <Typography
                        gutterBottom
                        variant="h5"
                        component="div"
                        sx={{paddingTop: "2px"}}
                      >
                        Layout:
                      </Typography>
                      <Grid container>
                        <Grid item xs={5} sx={{padding: "10px"}}>
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
                                quests[quest].PairsConfig.Left
                              )
                            }
                          </Typography>
                        </Grid>
                        <Grid item xs={7} sx={{padding: "10px"}}>
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
                        <Grid item xs={5} sx={{padding: "10px"}}>
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
                                quests[quest].PairsConfig.Right
                              )
                            }
                          </Typography>
                        </Grid>
                        <Grid item xs={7} sx={{padding: "10px"}}>
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
                      <QuestedGalleryItemsHeader quest={quest} />
                    </CardContent>
                    <CardActions style={{justifyContent: "center"}}>
                      <Button
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                        disabled={
                          questsProposals.hasOwnProperty(quest) &&
                            questsProposals[quest].filter(
                              //@ts-ignore
                              ({Started, Finished}) => Started && !Finished
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
                        style={{
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                        onClick={(event) => onSelection(event, quest)}
                        size="small"
                      >
                        Start
                      </Button>
                      {questsProposals.hasOwnProperty(quest) &&
                        questsProposals[quest].filter(
                          (item) => !item.Started && !item.Withdrawn
                        ).length > 0 && (
                          <Button
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
                        )}
                      <Button
                        disabled={
                          quests.hasOwnProperty(quest) &&
                            quests[quest].StakingConfig !== null &&
                            questsProposals.hasOwnProperty(quest) &&
                            questsProposals[quest].filter(
                              //@ts-ignore
                              ({Started, Finished}) => Started && !Finished
                            ).length > 0
                            ? false
                            : true
                        }
                        onClick={(event) => onReward(event, quest)}
                        size="small"
                      >
                        Rewards
                      </Button>
                    </CardActions>
                  </StyledCard>
                </Box>
              </Grid>
            </>
          );
        })}
    </Grid>
  );
};

export const QuestsGallery = () => {
  const connection = useMemo(
    () => new Connection("https://devnet.genesysgo.net"),
    []
  );

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
  const [stakingProgression, setStakingProgression] = useRecoilState(stakingProgressionAtom);

  const [resync, setResync] = useRecoilState(resyncAtom);

  useEffect(() => {
    async function fetchQuests() {
      if (!wallet.publicKey) {
        return;
      }

      const questsJson = await get_quests(ORACLE.toString());
      const quests = JSON.parse(String.fromCharCode(...questsJson));
      setQuests(quests);

      const questsProposalsJson = await get_quests_proposals(
        ORACLE.toString(),
        wallet.publicKey.toString()
      );
      const questsProposals = JSON.parse(
        String.fromCharCode(...questsProposalsJson)
      );

      setQuestsProposals(questsProposals);

      const questsKPIsJson = await get_quests_kpis(
        ORACLE.toString(),
        wallet.publicKey.toString(),
      );
      const questsKPIs = JSON.parse(
        String.fromCharCode(...questsKPIsJson)
      );

      setQuestsKPIs(questsKPIs);
    }
    if (questsProgression === 0) {
      fetchQuests();
    }
  }, [wallet, questsProgression, setQuests, setQuestsProposals]);

  useEffect(() => {
    async function fetchNfts() {
      if (!wallet.publicKey) {
        return;
      }

      let myNfts = await Promise.all(
        (
          await Metaplex.make(new Connection("https://api.devnet.solana.com"))
            .nfts()
            //@ts-ignore
            .findAllByOwner(wallet.publicKey.toBase58())
        )
          .map(async (nft) => {
            let offchainMetadata = {};
            try {
              // offchainMetadata = (await axios.get(nft.uri)).data;
            } catch (e) {
              console.log("fail");
            }
            return {...nft, offchainMetadata};
          })
      );

      //@ts-ignore
      setNfts(myNfts);
      //@ts-ignore
      setNftsSelection(myNfts.map(() => false));
    }
    fetchNfts();
  }, [wallet, resync, setNfts, setNftsSelection]);

  const onBack = useCallback(
    (_) => {
      async function fetchQuestProposals() {
        const questsProposalsJson = await get_quests_proposals(
          ORACLE.toString(),
          wallet.publicKey.toString()
        );
        const questsProposals = JSON.parse(
          String.fromCharCode(...questsProposalsJson)
        );

        setQuestsProposals(questsProposals);
      }

      fetchQuestProposals();

      if (questsProgression === 1) {
        if (stakingProgression - 1 < 0) {
          setQuestsProgression(questsProgression - 1);
          return;
        }
        setStakingProgression(stakingProgression - 1);
        return;
      }
      if (questsProgression - 1 === 0)
        setPairings({
          // @ts-ignore
          genOneDraggable: [],
          genOneStaking: [],
          genTwoDraggable: [],
          genTwoStaking: [],
        });
      if (questsProgression > 0) setQuestsProgression(questsProgression - 1);
      if (questsProgression < 0) setQuestsProgression(questsProgression + 1);

    },
    [questsProgression, setQuestsProgression, stakingProgression]
  );
  const onRecover = useCallback(
    (_, quest) => {
      async function flush() {
        const recoveries = nftsQuested.filter(
          (_, index) => recoveryState[index]
        );

        console.log(
          questSelection,
          recoveries.map((item) => item.index)
        );

        // flush quest records
        const flushRecordsTxs = JSON.parse(
          String.fromCharCode(
            ...(await flush_quest_records(
              // @ts-ignore
              wallet.publicKey.toString(),
              questSelection,
              // @ts-ignore
              JSON.stringify(recoveries.map((item) => item.index))
            ))
          )
        );

        if (flushRecordsTxs.length > 0) {
          for (const flushTxB of flushRecordsTxs) {
            const flushTx = Transaction.populate(new Message(flushTxB.message));
            flushTx.recentBlockhash = (
              await connection.getRecentBlockhash("finalized")
            ).blockhash;
            const signature = await wallet.sendTransaction(flushTx, connection);
            console.log(signature);
            await connection.confirmTransaction(signature, "confirmed");
          }
        }
        setQuestsSelection("");
        setQuestsProgression(0);
      }

      async function claimRewards() {
        const recoveries = nftsQuested.filter(
          (_, index) => recoveryState[index]
        );

        console.log(
          questSelection,
          recoveries.map((item) => item.index)
        );

        // flush quest records
        const flushRecordsTxs = JSON.parse(
          String.fromCharCode(
            ...(await claim_quest_staking_rewards(
              // @ts-ignore
              wallet.publicKey.toString(),
              questSelection,
              // @ts-ignore
              JSON.stringify(recoveries.map((item) => item.index))
            ))
          )
        );

        if (flushRecordsTxs.length > 0) {
          for (const flushTxB of flushRecordsTxs) {
            const flushTx = Transaction.populate(new Message(flushTxB.message));
            flushTx.recentBlockhash = (
              await connection.getRecentBlockhash("finalized")
            ).blockhash;
            const signature = await wallet.sendTransaction(flushTx, connection);
            console.log(signature);
            await connection.confirmTransaction(signature, "confirmed");
          }
        }
      }

      async function endQuests() {
        const recoveries = nftsQuested.filter(
          (_, index) => recoveryState[index]
        );

        console.log(
          questSelection,
          recoveries.map((item) => item.index)
        );

        // flush quest records
        const flushRecordsTx = JSON.parse(
          String.fromCharCode(
            ...(await end_quests(
              // @ts-ignore
              wallet.publicKey.toString(),
              questSelection,
              // @ts-ignore
              JSON.stringify(recoveries.map((item) => item.index))
            ))
          )
        );

        if (Object.keys(flushRecordsTx).length > 0) {
          const flushTx = Transaction.populate(
            new Message(flushRecordsTx.message)
          );
          flushTx.recentBlockhash = (
            await connection.getRecentBlockhash("finalized")
          ).blockhash;
          const signature = await wallet.sendTransaction(flushTx, connection);
          console.log(signature);
          await connection.confirmTransaction(signature, "confirmed");
        }
        setQuestsSelection("");
        setQuestsProgression(0);
      }

      if (questsProgression === -1) {
        if (globalEnum === "recover") {
          flush();
        }
        if (globalEnum === "reward") {
          claimRewards();
        }
        if (globalEnum === "manage") {
          endQuests();
        }
      } else {
        setShowStarted(false);
        setShowCompleted(false);
        setQuestsSelection(quest);
        setQuestsProgression(-1);
        setGlobalEnum("recover");
      }
    },
    [questsProgression, setQuestsProgression, recoveryState]
  );
  const onNext = useCallback(
    (_) => {
      async function newQuestProposal() {
        if (wallet === null) {
          return;
        }
        if (quests[questSelection].PairsConfig.Left === 1 && quests[questSelection].PairsConfig.Right === 0) {
          console.log("singleton")
          const onboardTxs = JSON.parse(
            String.fromCharCode(
              ...(await onboard_from_singletons(
                // @ts-ignore
                wallet.publicKey.toString(),
                questSelection,
                JSON.stringify(
                  nftsSelection[0]
                    // @ts-ignore
                    .map(({mint}) => mint.toString())
                ),
              ))
            )
          );

          if (onboardTxs.length > 0) {
            for (const onboardTx of onboardTxs) {

              const enrollQuesteesTx = Transaction.populate(
                new Message(onboardTx.message)
              );
              enrollQuesteesTx.recentBlockhash = (
                await connection.getRecentBlockhash("finalized")
              ).blockhash;
              const signature = await wallet.sendTransaction(
                enrollQuesteesTx,
                connection
              );
              console.log(signature);
              await connection.confirmTransaction(signature, "confirmed");
            }
          }
          setQuestsProgression(0);

        } else {
          console.log(nftsSelection);
          const enrollQuesteesIx = JSON.parse(
            String.fromCharCode(
              ...(await new_quest_proposal(
                // @ts-ignore
                wallet.publicKey.toString(),
                questSelection,
                JSON.stringify(
                  nftsSelection[0]
                    // @ts-ignore
                    .map(({mint}) => mint.toString())
                ),
                JSON.stringify(
                  nftsSelection[1]
                    // @ts-ignore
                    .map(({mint}) => mint.toString())
                ),
              ))
            )
          );

          if (Object.keys(enrollQuesteesIx).length > 0) {
            setActiveQuestProposals([enrollQuesteesIx.proposalIndex]);

            const enrollQuesteesTx = Transaction.populate(
              new Message(enrollQuesteesIx.transaction.message)
            );
            enrollQuesteesTx.recentBlockhash = (
              await connection.getRecentBlockhash("finalized")
            ).blockhash;
            const signature = await wallet.sendTransaction(
              enrollQuesteesTx,
              connection
            );
            console.log(signature);
            await connection.confirmTransaction(signature, "confirmed");
          }
          setQuestsProgression(2);
        }
      }

      async function doRngs() {
        const doRngsIx = JSON.parse(
          String.fromCharCode(
            ...(await do_rngs(
              // @ts-ignore
              wallet.publicKey.toString(),
              JSON.stringify(
                nftsQuested
                  .filter((_, nftIndex) => nftsSelection[nftIndex])
                  // @ts-ignore
                  .map(({mint}) => mint.toString())
              ),
              ORACLE.toString(),
              // @ts-ignore
              String(quests[questSelection].Index)
            ))
          )
        );

        if (Object.keys(doRngsIx).length > 0) {
          const doRngsTx = Transaction.populate(new Message(doRngsIx.message));
          doRngsTx.recentBlockhash = (
            await connection.getRecentBlockhash("finalized")
          ).blockhash;
          const signature = await wallet.sendTransaction(doRngsTx, connection);
          console.log(signature);
          await connection.confirmTransaction(signature, "confirmed");
        }
        setQuestsProgression(-2);
        return;
      }

      async function executor() {
        if (questsProgression > 0) {
          if (quests[questSelection].PairsConfig.Left + quests[questSelection].PairsConfig.Right === [...nftsSelection[0], ...nftsSelection[1]].length) {
            console.log("....");
            newQuestProposal();
          } else {
            if (quests[questSelection].PairsConfig.Left === 1 && quests[questSelection].PairsConfig.Right === 0) {
              newQuestProposal();
            } else {
              console.log("asdf");
              setStakingProgression((1 + stakingProgression) % 2);
            }
          }
        }

        if (questsProgression < 0) {
          if (showCompleted) {
            doRngs();
          } else {
            setQuestsProgression(-2);
          }
        }
      }

      executor();
    },
    [
      wallet,
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
    ]
  );
  const onManage = useCallback(
    (_, quest) => {
      setResync(resync + 1);
      setShowStarted(true);
      setShowCompleted(false);
      setQuestsSelection(quest);
      setQuestsProgression(-1);
      setGlobalEnum("manage");
    },
    [
      resync,
      setQuestsProgression,
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
    },
    [
      resync,
      setQuestsProgression,
      setQuestsSelection,
      setResync,
      setShowCompleted,
    ]
  );
  const onQuestSelection = useCallback(
    (_, quest) => {
      async function selectQuest() {
        console.log(quest);
        const selectQuestIx = JSON.parse(
          String.fromCharCode(
            // @ts-ignore
            ...(await select_quest(wallet.publicKey.toString(), quest))
          )
        );

        if (Object.keys(selectQuestIx).length > 0) {
          const selectQuestTx = Transaction.populate(
            new Message(selectQuestIx.message)
          );
          const recentBlockhash = (
            await connection.getRecentBlockhash("finalized")
          ).blockhash;
          selectQuestTx.recentBlockhash = recentBlockhash;
          const signature = await wallet.sendTransaction(
            selectQuestTx,
            connection
          );
          console.log(signature);
          await connection.confirmTransaction(signature, "confirmed");
        }
        setShowCompleted(false);
        setResync(resync + 1);
        setQuestsSelection(quest);
        setQuestsProgression(1);
        setGlobalEnum("enrollment");
        setStakingProgression(0);
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
      setQuestsSelection,
      setQuestsProgression,
      setNftsSelection,
      setResync,
      setShowCompleted,
      setActiveQuestProposals,
      setGlobalEnum,
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
              wallet.publicKey.toString(),
              quest,
              JSON.stringify(activeQuestProposals)
            ))
          )
        );

        if (Object.keys(startQuestsIx).length > 0) {
          const startQuestsTx = Transaction.populate(
            new Message(startQuestsIx.message)
          );
          startQuestsTx.recentBlockhash = (
            await connection.getRecentBlockhash("finalized")
          ).blockhash;
          const signature = await wallet.sendTransaction(
            startQuestsTx,
            connection
          );
          console.log(signature);
          await connection.confirmTransaction(signature, "confirmed");
          setQuestsProgression(0);
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
      setQuestsProgression,
      activeQuestProposals,
    ]
  );

  const onQuestAction = useCallback(
    (_, quest) => {
      async function makeClaims() {
        const makeClaimsTxs = JSON.parse(
          String.fromCharCode(
            ...(await mint_rewards(
              // @ts-ignore
              wallet.publicKey.toString(),
              JSON.stringify(
                nftsQuested
                  .filter((_, nftIndex) => nftsSelection[nftIndex])
                  // @ts-ignore
                  .map(({mint}) => mint.toString())
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
            const signature = await wallet.sendTransaction(
              rewardTx,
              connection
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
                  .map(({mint}) => mint.toString())
              ),
              ORACLE.toString(),
              // @ts-ignore
              String(quests[quest].Index)
            ))
          )
        );

        if (Object.keys(endQuestsIx).length > 0) {
          const endQuestsTx = Transaction.populate(
            new Message(endQuestsIx.message)
          );
          endQuestsTx.recentBlockhash = (
            await connection.getRecentBlockhash("finalized")
          ).blockhash;
          const signature = await wallet.sendTransaction(
            endQuestsTx,
            connection
          );
          console.log(signature);
          await connection.confirmTransaction(signature, "confirmed");
          setQuestsProgression(0);
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
    if (
      globalEnum === "recover"
    ) {
      console.log("waldo");
      cols += 1;
    }
    if (
      globalEnum === "recover"
      && activeQuestProposals.length > 0
    ) {
      console.log("waldo");
      cols += 2;
    }
    if (questsProgression === 2 || questsProgression === 1) {
      cols += 2;
    }

    console.log(cols);
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
      {Object.values(quests).length > 0 && (
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
                <Grid
                  item
                  xs={topBarXsPoints}
                  sx={{justifyContent: "center"}}
                >
                  <StyledCard>
                    <Button
                      sx={{
                        fontSize: "1.1rem",
                        width: "-webkit-fill-available",
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
                        sx={{justifyContent: "center"}}
                      >
                        <StyledCard>
                          <Button
                            sx={{
                              fontSize: "1.1rem",
                              width: "-webkit-fill-available",
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
                    sx={{justifyContent: "center"}}
                  >
                    <StyledCard>
                      <Button
                        sx={{
                          fontSize: "1.1rem",
                          width: "-webkit-fill-available",
                        }}
                        onClick={onNext}
                      >
                        Next
                      </Button>
                    </StyledCard>
                  </Grid>
                )}
                {questsProgression === 2 && (
                  <Grid
                    item
                    xs={topBarXsPoints}
                    sx={{justifyContent: "center"}}
                  >
                    <StyledCard>
                      <Button
                        sx={{
                          fontSize: "1.1rem",
                          width: "-webkit-fill-available",
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
          {body}
        </div>
      )}
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
