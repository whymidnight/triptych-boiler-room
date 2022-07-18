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
} from "./state/atoms";
import {StyledCard} from "../../components/cards";

import {NFTGalleryItems, QuestStart} from "./enrollment";
import {QuestedGalleryItems} from "./manage";
import {QuestAction} from "./rewards";

declare function get_quests(oracle: String): Promise<any>;
declare function get_quested(oracle: String, holder: String): Promise<any>;
declare function enroll_questor(wallet_publicKey: String): Promise<any>;
declare function enroll_questees(
    wallet_publicKey: String,
    questees: String
): Promise<any>;
declare function start_quests(
    wallet_publicKey: String,
    questees: String,
    oracle: String,
    questIndex: String
): Promise<any>;
declare function end_quests(
    wallet_publicKey: String,
    questees: String,
    oracle: String,
    questIndex: String
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

const ORACLE = new PublicKey("8gvUXYSdqZ5dyGcN1fas5Q7qLRJgJNE693Bt7xgYZXBh");

//@ts-ignore
export const QuestsGalleryItems = ({onSelection, onManage, onReward}) => {
    const [quests] = useRecoilState(questsAtom);
    const [quested] = useRecoilState(questedAtom);
    const [nftsQuestedExhaust] = useRecoilState(nftsQuestedExhaustAtom);
    const questsKeys = Object.keys(quests);

    return (
        <Grid alignItems="center" container>
            {questsKeys.length > 0 &&
                questsKeys.map((quest) => {
                    return (
                        <Grid xs={4} key={quest}>
                            <Box textAlign="center">
                                <StyledCard>
                                    <CardMedia
                                        style={{height: "280px"}}
                                        component="img"
                                        height="280"
                                        image="https://www.arweave.net/GLeORZQuLxFzDFK0aBQKwhQUUF0-4eawXnrjdtmv5fg?ext=png"
                                        alt="green iguana"
                                    />
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
                                    </CardContent>
                                    <CardActions style={{justifyContent: "center"}}>
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
                                        {quested.hasOwnProperty(quest) &&
                                            //@ts-ignore
                                            quested[quest].filter(
                                                //@ts-ignore
                                                ({QuestAccount}) => !QuestAccount.Completed
                                            ).length > 0 && (
                                                <Button
                                                    onClick={(event) => onManage(event, quest)}
                                                    size="small"
                                                >
                                                    Manage
                                                </Button>
                                            )}
                                        {quested.hasOwnProperty(quest) &&
                                            //@ts-ignore
                                            quested[quest]
                                                //@ts-ignore
                                                .filter(({QuestAccount}) => QuestAccount.Completed)
                                                .filter(
                                                    //@ts-ignore
                                                    ({QuestAccount}) =>
                                                        !nftsQuestedExhaust
                                                            //@ts-ignore
                                                            .map((mint) => mint.toString())
                                                            .includes(QuestAccount.DepositTokenMint)
                                                ).length > 0 && (
                                                <Button
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
                    );
                })}
        </Grid>
    );
};

export const QuestsGallery = () => {
    const connection = useMemo(
        () => new Connection("https://api.devnet.solana.com"),
        []
    );

    const wallet = useWallet();
    const [resync, setResync] = useRecoilState(resyncAtom);
    const [nfts, setNfts] = useRecoilState(nftsAtom);
    const [quests, setQuests] = useRecoilState(questsAtom);
    const [, setQuested] = useRecoilState(questedAtom);
    const [questSelection, setQuestsSelection] =
        useRecoilState(questsSelectionAtom);
    const [nftsSelection, setNftsSelection] = useRecoilState(nftsSelectionAtom);
    const [nftsQuested] = useRecoilState(nftsQuestedAtom);
    const [nftsQuestedExhaust, setNftsQuestedExhaust] = useRecoilState(
        nftsQuestedExhaustAtom
    );
    const [showCompleted, setShowCompleted] = useRecoilState(showCompletedAtom);
    const [questsProgression, setQuestsProgression] = useRecoilState(
        questsProgressionAtom
    );

    const [activate, setActivate] = useState(true);

    useEffect(() => {
        const timeout = setTimeout(() => setActivate(!activate), 2000);
        return () => clearTimeout(timeout);
    }, [activate]);

    useEffect(() => {
        const interval = setInterval(() => {
            setResync(resync + 1);
        }, 300000);

        return () => clearInterval(interval);
    }, [resync, setResync]);

    useEffect(() => {
        async function fetchQuests() {
            if (!wallet.publicKey) {
                return;
            }

            const questsJson = await get_quests(ORACLE.toString());
            const quests = JSON.parse(String.fromCharCode(...questsJson));
            setQuests(quests);
        }
        fetchQuests();
    }, [wallet, resync, setQuests]);

    useEffect(() => {
        async function getQuested() {
            if (!wallet.publicKey) {
                return;
            }
            let quested = JSON.parse(
                String.fromCharCode(
                    ...(await get_quested(ORACLE.toString(), wallet.publicKey.toString()))
                )
            );

            let exhaustedMints = [];
            for (const questKey of Object.keys(quested)) {
                const rewardTickets = JSON.parse(
                    String.fromCharCode(
                        ...(await get_rewards(
                            wallet.publicKey.toString(),
                            JSON.stringify(
                                quested[questKey]
                                    // @ts-ignore
                                    .filter(({QuestAccount}) => QuestAccount.Completed)
                                    // @ts-ignore
                                    .map(({QuestAccount}) => QuestAccount.DepositTokenMint)
                            ),
                            ORACLE.toString(),
                            String(quested[questKey][0].QuestAccount.Index)
                        ))
                    )
                );
                for (const mint of Object.keys(rewardTickets)) {
                    if (
                        rewardTickets[mint] !== null &&
                        rewardTickets[mint].RewardTicket !== null &&
                        rewardTickets[mint].RewardTicket.Amount === 0
                    )
                        exhaustedMints.push(mint);
                }
            }
            // @ts-ignore
            setNftsQuestedExhaust(exhaustedMints);

            setQuested(quested);
        }
        getQuested();
    }, [wallet, resync, setNftsQuestedExhaust, setQuested]);

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
                    .filter(
                        // @ts-ignore
                        async (nft) =>
                            // @ts-ignore
                            !nftsQuestedExhaust.includes((await nft).mint.toString())
                    )
            );

            //@ts-ignore
            setNfts(myNfts);
            //@ts-ignore
            setNftsSelection(myNfts.map(() => false));
        }
        fetchNfts();
    }, [wallet, resync, nftsQuestedExhaust, setNfts, setNftsSelection]);

    const onBack = useCallback(
        (_) => {
            if (questsProgression > 0) setQuestsProgression(questsProgression - 1);
            if (questsProgression < 0) setQuestsProgression(questsProgression + 1);
        },
        [questsProgression, setQuestsProgression]
    );
    const onNext = useCallback(
        (_) => {
            async function enrollQuestees() {
                if (wallet === null) {
                    return;
                }
                const enrollQuesteesIx = JSON.parse(
                    String.fromCharCode(
                        ...(await enroll_questees(
                            // @ts-ignore
                            wallet.publicKey.toString(),
                            JSON.stringify(
                                nfts
                                    .filter((_, nftIndex) => nftsSelection[nftIndex])
                                    // @ts-ignore
                                    .map(({mint}) => mint.toString())
                            )
                        ))
                    )
                );

                if (Object.keys(enrollQuesteesIx).length > 0) {
                    const enrollQuesteesTx = Transaction.populate(
                        new Message(enrollQuesteesIx.message)
                    );
                    enrollQuesteesTx.recentBlockhash = (
                        await connection.getRecentBlockhash("finalized")
                    ).blockhash;
                    const signature = await wallet.sendTransaction(
                        enrollQuesteesTx,
                        connection,
                        {skipPreflight: true},
                    );
                    console.log(signature);
                    await connection.confirmTransaction(signature, "confirmed");
                }
                setQuestsProgression(2);
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
                    const signature = await wallet.sendTransaction(
                        doRngsTx,
                        connection,
                        {skipPreflight: true},
                    );
                    console.log(signature);
                    await connection.confirmTransaction(signature, "confirmed");
                }
                setQuestsProgression(-2);
                return;
            }

            async function executor() {
                if (showCompleted) {
                    doRngs();
                } else {
                    setQuestsProgression(-2);
                }
            }

            if (questsProgression > 0) enrollQuestees();
            if (questsProgression < 0) executor();
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
        ]
    );
    const onManage = useCallback(
        (_, quest) => {
            setResync(resync + 1);
            setShowCompleted(false);
            setQuestsSelection(quest);
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
    const onReward = useCallback(
        (_, quest) => {
            setQuestsSelection(quest);
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
            async function enrollQuestor() {
                const enrollQuestorIx = JSON.parse(
                    String.fromCharCode(
                        // @ts-ignore
                        ...(await enroll_questor(wallet.publicKey.toString()))
                    )
                );

                if (Object.keys(enrollQuestorIx).length > 0) {
                    const enrollQuestorTx = Transaction.populate(
                        new Message(enrollQuestorIx.message)
                    );
                    enrollQuestorTx.recentBlockhash = (
                        await connection.getRecentBlockhash("finalized")
                    ).blockhash;
                    const signature = await wallet.sendTransaction(
                        enrollQuestorTx,
                        connection,
                        {skipPreflight: true},
                    );
                    console.log(signature);
                    await connection.confirmTransaction(signature, "confirmed");
                }
                setShowCompleted(false);
                setResync(resync + 1);
                setQuestsSelection(quest);
                setQuestsProgression(1);
                // @ts-ignore
                setNftsSelection(nfts.map(() => false));
            }

            enrollQuestor();
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
        ]
    );

    const onQuestStart = useCallback(
        (_, quest) => {
            async function startQuests() {
                const startQuestsIx = JSON.parse(
                    String.fromCharCode(
                        ...(await start_quests(
                            // @ts-ignore
                            wallet.publicKey.toString(),
                            JSON.stringify(
                                nfts
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

                if (Object.keys(startQuestsIx).length > 0) {
                    const startQuestsTx = Transaction.populate(
                        new Message(startQuestsIx.message)
                    );
                    startQuestsTx.recentBlockhash = (
                        await connection.getRecentBlockhash("finalized")
                    ).blockhash;
                    const signature = await wallet.sendTransaction(
                        startQuestsTx,
                        connection,
                        {skipPreflight: true},
                    );
                    console.log(signature);
                    await connection.confirmTransaction(signature, "confirmed");
                    setQuestsProgression(0);
                }
            }

            startQuests();
        },
        [connection, quests, nfts, nftsSelection, wallet, setQuestsProgression]
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
                            connection,
                            {skipPreflight: true},
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
                        connection,
                        {skipPreflight: true},
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

    return (
        <>
            {Object.values(quests).length > 0 && (
                <div
                    style={{
                        paddingTop: "50vh",
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
                            <Button onClick={onBack}>Go Back</Button>
                            {Math.abs(questsProgression) !== 2 &&
                                nftsSelection.filter((selected) => selected === true).length >
                                0 && <Button onClick={onNext}>Continue</Button>}
                        </StyledCard>
                    )}
                    {body}
                </div>
            )}
        </>
    );
};

export const Questing = () => {
    return (
        <>
            <QuestsGallery />
        </>
    );
};
