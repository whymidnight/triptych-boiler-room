import {Metaplex} from "@metaplex-foundation/js-next";
import {Connection, PublicKey} from "@solana/web3.js";
import {useEffect, useMemo, useState, useCallback} from "react";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import {StyledCard} from "../../components/cards";
import {Box, Grid} from "@mui/material";
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
} from "./state/atoms";

import axios from 'axios';

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
    <StyledCard className="xquesting-enrollment-box">
      <Grid alignItems="center" container>

        {nftsQuested.map(({depositsMetadata}, pairIndex) => (
          <Grid container item xs={12} sm={4} key={pairIndex} justifyContent="center">
            <StyledCard>
              <CardActions>
                <Button
                  style={{fontSize: '1.1rem'}}
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
              </CardActions>
              <Grid item key={0}>
                <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                  {depositsMetadata.map((depositMetadata, nftIndex) => (
                    <CardMedia
                      sx={{height: '80px', width: '80px'}}
                      component="img"
                      height="140"
                      image={
                        //@ts-ignore
                        depositMetadata.offchainMetadata.hasOwnProperty("image")
                          ? //@ts-ignore
                          depositMetadata.offchainMetadata.image
                          : "https://www.arweave.net/GLeORZQuLxFzDFK0aBQKwhQUUF0-4eawXnrjdtmv5fg?ext=png"
                      }
                    />
                  ))}
                </div>
              </Grid>
            </StyledCard>
          </Grid>
        ))}
      </Grid>
    </StyledCard>
  );
};
