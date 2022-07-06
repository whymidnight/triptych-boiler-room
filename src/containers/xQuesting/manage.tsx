import {Metaplex} from "@metaplex-foundation/js-next";
import {Connection, PublicKey} from "@solana/web3.js";
import {useEffect, useMemo, useState, useCallback} from "react";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import {StyledCard} from "../../components/cards";
import {Box, Grid, Stack, Divider} from "@mui/material";
import {useRecoilState} from "recoil";
import {
  questsProposalsAtom,
  questedAtom,
  questsAtom,
  nftsQuestedExhaustAtom,
  showCompletedAtom,
  showStartedAtom,
  nftsQuestedAtom,
  nftsSelectionAtom,
  questsSelectionAtom,
  questsProgressionAtom,
  recoveryStateAtom,
  activeQuestProposalsAtom,
  globalEnumAtom,
  questsKPIsAtom,
  resyncAtom,
} from "./state/atoms";

import axios from 'axios';
import {useWallet} from "@solana/wallet-adapter-react";
import {ORACLE} from './index';

declare function get_quests_kpis(
  oracle: String,
  holder: String,
): Promise<any>;

export const QuestedGalleryItemsHeader = ({quest}) => {
  const wallet = useWallet();
  const [questsKPIs, setQuestsKPIs] = useRecoilState(questsKPIsAtom);
  const [questsProposals] = useRecoilState(questsProposalsAtom);

  const [resync, setResync] = useRecoilState(resyncAtom);
  useEffect(() => {
    const interval = setInterval(() => {
      setResync(resync + 1);
    }, 5000);
    return () => clearInterval(interval);
  }, [resync, setResync]);

  useEffect(() => {
    async function fetchQuests() {
      if (!wallet.publicKey) {
        return;
      }

      const questsKPIsJson = await get_quests_kpis(
        ORACLE.toString(),
        wallet.publicKey.toString(),
      );
      const questsKPIs = JSON.parse(
        String.fromCharCode(...questsKPIsJson)
      );

      console.log("...", questsKPIs);
      setQuestsKPIs(questsKPIs);
    }
    fetchQuests();
  }, [wallet, resync, setQuestsKPIs]);



  const stakingRewards = useCallback(() => {
    console.log(questsProposals[quest])
    return 0;
  }, []);

  useEffect(() => {
    console.log(quest, questsKPIs)
  }, [questsKPIs]);

  return (
    <Grid container justifyContent="center" xs={12} sx={{color: 'white'}}>
      <StyledCard>
        <Grid container justifyContent="center" item sx={{width: '100%'}} direction="row">
          <Grid item sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}} xs={5}>
            <Stack>
              <Typography
                gutterBottom
                variant="h5"
                component="div"
                sx={{paddingTop: "2px"}}
              >
                {questsKPIs.hasOwnProperty(quest) ? Number(questsKPIs[quest].stakingRewards).toFixed(1) : "0.0"}
              </Typography>
              <Typography
                gutterBottom
                variant="h5"
                component="div"
                sx={{paddingTop: "2px"}}
              >
                stNBA
              </Typography>
            </Stack>
          </Grid>
          <Grid item xs={2} container direction="row" justifyContent="center" alignItems="center">
            <Divider
              orientation="vertical"
              style={{height: '100%', width: '1px', backgroundColor: 'orange'}} />
          </Grid>
          <Grid item xs={5}>
            <Typography
              gutterBottom
              variant="h5"
              component="div"
              sx={{paddingTop: "2px"}}
            >
              {questsKPIs.hasOwnProperty(quest) ? Number(questsKPIs[quest].totalStaked / (20 * 1000)).toFixed(4) : "0.0000"}%
            </Typography>
            <Typography
              gutterBottom
              variant="h5"
              component="div"
              sx={{paddingTop: "2px"}}
            >
              Total Apes Staked
            </Typography>
          </Grid>
        </Grid>
      </StyledCard>
    </Grid>
  );
}

//@ts-ignore
export const QuestedGalleryItems = ({onSelection}) => {
  const [nftsQuested, setNftsQuested] = useRecoilState(nftsQuestedAtom);
  const [quests] = useRecoilState(questsAtom);
  const [quested] = useRecoilState(questedAtom);
  const [nftsQuestedExhaust] = useRecoilState(nftsQuestedExhaustAtom);
  const [showCompleted] = useRecoilState(showCompletedAtom);
  const [questSelection] = useRecoilState(questsSelectionAtom);
  const [, setNftsSelection] = useRecoilState(nftsSelectionAtom);
  const [questsProposals] = useRecoilState(questsProposalsAtom);
  const [questsProgression, setQuestsProgression] = useRecoilState(
    questsProgressionAtom
  );
  const [activeQuestProposals, setActiveQuestProposals] = useRecoilState(activeQuestProposalsAtom);
  const [globalEnum, setGlobalEnum] = useRecoilState(globalEnumAtom);
  const [recoveryState, setRecoveryState] = useRecoilState(recoveryStateAtom);
  const [showStarted, setShowStarted] = useRecoilState(showStartedAtom);

  useEffect(() => {
    setNftsQuested([]);
  }, []);

  useEffect(() => {
    const recoveries = nftsQuested.filter((_, index) => recoveryState[index]);

    setActiveQuestProposals(recoveries.map((item) => item.index));

  }, [recoveryState]);
  useEffect(() => {
    async function normalizeQuested() {
      let purgatory = [];

      switch (globalEnum) {
        case "recover": {
          purgatory = questsProposals.hasOwnProperty(questSelection) ? questsProposals[questSelection].filter(({Started, Finished, Withdrawn}) => (!Started || Finished) && !Withdrawn) : [];
          console.log("asdfasdfasdfllllllllllllll", purgatory);
          break;
        }
        case "manage": {
          purgatory = questsProposals.hasOwnProperty(questSelection) ? questsProposals[questSelection].filter(({Started, Withdrawn}) => Started && !Withdrawn) : [];
          break;
        }
        case "reward": {
          purgatory = questsProposals.hasOwnProperty(questSelection) ? questsProposals[questSelection].filter(({Started, Withdrawn}) => Started && !Withdrawn) : [];
          break;
        }
        default: {
          console.log("congrats on another easter egg :)")
        }
      }


      console.log(".....", globalEnum, showStarted, questsProposals[questSelection]);

      const pairs = await Promise.all(purgatory.map(async (item) => {
        return {
          index: item.Index,
          fulfilled: item.Fulfilled,
          started: item.Started,
          depositsMints: [...item.DepositedLeft !== null ? item.DepositedLeft : [], ...item.DepositedRight !== null ? item.DepositedRight : []],
          depositsMetadata: await Promise.all(
            (
              await Metaplex.make(
                new Connection(
                  "https://sparkling-dark-shadow.solana-devnet.quiknode.pro/0e9964e4d70fe7f856e7d03bc7e41dc6a2b84452/"
                )
              )
                .nfts()
                .findAllByMintList(
                  //@ts-ignore
                  [...item.DepositedLeft !== null ? item.DepositedLeft.map((mint) => new PublicKey(mint)) : [], ...item.DepositedRight !== null ? item.DepositedRight.map((mint) => new PublicKey(mint)) : []],
                )
            ).map(async (nft) => {
              let metadata = {};
              try {
                metadata = (await axios.get(nft.uri)).data;
              } catch (e) {}
              return {...nft, offchainMetadata: metadata};
            })
          )
        };
      }));
      console.log(pairs);

      //@ts-ignore
      setNftsQuested(pairs);
      //@ts-ignore
      setRecoveryState(pairs.map(() => false));
    }
    normalizeQuested();
  }, [
    nftsQuestedExhaust,
    quested,
    showCompleted,
    quests,
    questSelection,
    setNftsQuested,
    setNftsSelection,
  ]);

  const buttonText = useCallback((state) => {
    switch (globalEnum) {
      case "recover": {
        if (state) return "Undo Recovery";
        return "Add Recovery";
      }
      case "manage": {
        if (state) return "Undo Withdraw";
        return "Withdraw";
      }
      case "reward": {
        if (state) return "Undo Claim";
        return "Claim Reward";
      }
      default: return "Congrats on the easter egg!"
    }
  }, [globalEnum]);

  return (
    <StyledCard className="xquesting-enrollment-container">
      <Grid justifyContent="center" alignItems="center" container sx={{}}>
        <QuestedGalleryItemsHeader quest={questSelection} />
        {nftsQuested.map(({depositsMetadata}, pairIndex) => (
          <StyledCard>
            <Grid container item key={pairIndex} justifyContent="center" >
              <Grid item xs={12} sx={{display: 'flex', justifyContent: 'center'}}>
                <Box>
                  <Button
                    style={{fontSize: '1rem', margin: '5px'}}
                    onClick={(event) => {
                      console.log(".........");
                      setRecoveryState((prev) => {
                        const clone = Object.assign([], prev)
                        clone[pairIndex] = !clone[pairIndex];
                        return clone;
                      });
                      // onSelection(event, pairIndex);
                    }}
                    size="small"
                  >
                    {
                      //@ts-ignore
                      buttonText(recoveryState[pairIndex])
                    }
                  </Button>
                </Box>
              </Grid>
              <Grid item xs={12} sx={{display: 'flex', justifyContent: 'center'}}>
                {depositsMetadata.map((depositMetadata, nftIndex) => (
                  <Grid item xs={12} sx={{display: 'flex', justifyContent: 'center'}}>
                    <CardMedia
                      sx={{height: '120px', width: '120px'}}
                      component="img"
                      height="120px"
                      image={
                        //@ts-ignore
                        depositMetadata.offchainMetadata.hasOwnProperty("image")
                          ? //@ts-ignore
                          depositMetadata.offchainMetadata.image
                          : "https://www.arweave.net/GLeORZQuLxFzDFK0aBQKwhQUUF0-4eawXnrjdtmv5fg?ext=png"
                      }
                    />
                  </Grid>
                ))}
              </Grid>
            </Grid>
          </StyledCard>
        ))}
      </Grid>
    </StyledCard >
  );
};
