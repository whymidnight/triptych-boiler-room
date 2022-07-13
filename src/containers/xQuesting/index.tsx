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

import Snackbar from '@mui/material/Snackbar';
import MuiAlert, {AlertProps} from '@mui/material/Alert';


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

export const ORACLE = new PublicKey("42bi4dZPAfWdp6bEGpQXUfwAfJrWGhxCsf8NfLivkHqc");

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});



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
                                        <Grid alignItems="center" justifyContent="center">
                                            <Grid item xs={12} sx={{padding: '5% 0%'}}>
                                                <QuestedGalleryItemsHeader
                                                    quest={quest}
                                                    kpis={[
                                                        "totalStaked",
                                                        quests[quest].StakingConfig !== null ? "stakingReward" : "",
                                                    ]}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sx={{padding: '5% 0%'}}>
                                                <QuestedGalleryItemsHeader
                                                    quest={quest}
                                                    kpis={[
                                                        quests[quest].Tender !== null ? "entryCost" : "",
                                                        "type",
                                                    ]}
                                                />
                                            </Grid>
                                        </Grid>
                                        <CardContent>
                                            <StyledCard sx={{padding: "5%"}}>
                                                <Typography gutterBottom variant="h5" component="div">
                                                    {
                                                        //@ts-ignore
                                                        String(
                                                            " Name:"
                                                        )
                                                    }
                                                </Typography>
                                                <Typography gutterBottom variant="h5" component="div">
                                                    {
                                                        quests[quest].Name
                                                    }
                                                </Typography>
                                            </StyledCard>
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
                                                                quests.hasOwnProperty(quest) ? quests[quest].PairsConfig.Left : 0
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
                                                                quests.hasOwnProperty(quest) ? quests[quest].PairsConfig.Right : 0
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
                                            {quests.hasOwnProperty(quest) && quests[quest].StakingConfig !== null
                                                && (
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
                                                )}
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
    const [open, setOpen] = React.useState(false);
    const [openMessage, setOpenMessage] = React.useState("");

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };


    useEffect(() => {
        async function fetchQuests() {
            if (!wallet.publicKey) {
                return;
            }

            console.log("0000");
            const questsJson = await get_quests(ORACLE.toString());
            const quests = JSON.parse(String.fromCharCode(...questsJson));
            setQuests(quests);

            console.log("1111");
            const questsProposalsJson = await get_quests_proposals(
                ORACLE.toString(),
                wallet.publicKey.toString()
            );
            const questsProposals = JSON.parse(
                String.fromCharCode(...questsProposalsJson)
            );

            setQuestsProposals(questsProposals);

            console.log("2222");
            const questsKPIsJson = await get_quests_kpis(
                ORACLE.toString(),
                wallet.publicKey.toString(),
            );
            const questsKPIs = JSON.parse(
                String.fromCharCode(...questsKPIsJson)
            );

            console.log("3333");
            setQuestsKPIs(questsKPIs);
        }
        fetchQuests();
    }, []);

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

            console.log("....")

            if (questsProgression === 1) {
                console.log(",,,,", stakingProgression, quests[questSelection].PairsConfig.Left)
                if (stakingProgression - 1 < 0) {
                    setQuestsProgression(questsProgression - 1);
                    return;
                }
                if (stakingProgression === 1 && quests[questSelection].PairsConfig.Left === 0) {
                    setQuestsProgression(0);
                    return;
                }
                setStakingProgression(stakingProgression - 1 % 2);
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
        [quests, questSelection, questsProgression, setQuestsProgression, stakingProgression]
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
                try {
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
                            try {
                                const flushTx = Transaction.populate(new Message(flushTxB.message));
                                flushTx.recentBlockhash = (
                                    await connection.getRecentBlockhash("finalized")
                                ).blockhash;
                                setOpenMessage("Please Approve Quest Withdrawal Transaction.");
                                setOpen(true);
                                const signature = await wallet.sendTransaction(flushTx, connection);
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

                    await (new Promise(resolve => setTimeout(resolve, 2 * 1000)));

                    setOpenMessage("Something terrible has gone wrong. :(");
                    setOpen(true);
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
                try {
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
                            try {
                                const flushTx = Transaction.populate(new Message(flushTxB.message));
                                flushTx.recentBlockhash = (
                                    await connection.getRecentBlockhash("finalized")
                                ).blockhash;
                                setOpenMessage("Please Approve Claim Reward Transaction.");
                                setOpen(true);
                                const signature = await wallet.sendTransaction(flushTx, connection);
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

                    await (new Promise(resolve => setTimeout(resolve, 2 * 1000)));

                    setOpenMessage("Something terrible has gone wrong. :(");
                    setOpen(true);
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
                try {
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
                        try {
                            const flushTx = Transaction.populate(
                                new Message(flushRecordsTx.message)
                            );
                            flushTx.recentBlockhash = (
                                await connection.getRecentBlockhash("finalized")
                            ).blockhash;
                            setOpenMessage("Please Approve Quest End Transaction.");
                            setOpen(true);
                            const signature = await wallet.sendTransaction(flushTx, connection);
                            setOpen(true);
                            setOpenMessage("Quest End Transaction Submitted!");
                            console.log(signature);
                            await connection.confirmTransaction(signature, "confirmed");
                            setOpen(true);
                            setOpenMessage("Quest End Transaction Succeeded!");
                        } catch (e) {
                            setOpenMessage("Quest End Transaction Failed. :(");
                            setOpen(true);
                        }
                    }
                } catch (e) {
                    setOpenMessage(e.message);
                    setOpen(true);

                    await (new Promise(resolve => setTimeout(resolve, 2 * 1000)));

                    setOpenMessage("Something terrible has gone wrong. :(");
                    setOpen(true);
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
        [questsProgression, setQuestsProgression, recoveryState, setOpen, setOpenMessage]
    );
    const onNext = useCallback(
        (_) => {
            async function newQuestProposal() {
                if (wallet === null) {
                    return;
                }
                if (quests[questSelection].PairsConfig.Left === 1 && quests[questSelection].PairsConfig.Right === 0) {
                    console.log("singleton")
                    try {
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

                                try {
                                    const enrollQuesteesTx = Transaction.populate(
                                        new Message(onboardTx.message)
                                    );
                                    enrollQuesteesTx.recentBlockhash = (
                                        await connection.getRecentBlockhash("finalized")
                                    ).blockhash;
                                    setOpenMessage("Please Approve Quest Start Transaction.");
                                    setOpen(true);
                                    const signature = await wallet.sendTransaction(
                                        enrollQuesteesTx,
                                        connection
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

                        await (new Promise(resolve => setTimeout(resolve, 2 * 1000)));

                        setOpenMessage("Something terrible has gone wrong. :(");
                        setOpen(true);
                    }
                    setQuestsProgression(0);

                } else {
                    console.log(nftsSelection);
                    try {
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

                            try {
                                const enrollQuesteesTx = Transaction.populate(
                                    new Message(enrollQuesteesIx.transaction.message)
                                );
                                enrollQuesteesTx.recentBlockhash = (
                                    await connection.getRecentBlockhash("finalized")
                                ).blockhash;
                                setOpenMessage("Please Approve Quest Start Transaction.");
                                setOpen(true);
                                const signature = await wallet.sendTransaction(
                                    enrollQuesteesTx,
                                    connection
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

                        await (new Promise(resolve => setTimeout(resolve, 2 * 1000)));

                        setOpenMessage("Something terrible has gone wrong. :(");
                        setOpen(true);
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
            setOpen,
            setOpenMessage,
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
                const selectQuestIx = JSON.parse(
                    String.fromCharCode(
                        // @ts-ignore
                        ...(await select_quest(wallet.publicKey.toString(), quest))
                    )
                );

                if (Object.keys(selectQuestIx).length > 0) {
                    try {
                        const selectQuestTx = Transaction.populate(
                            new Message(selectQuestIx.message)
                        );
                        const recentBlockhash = (
                            await connection.getRecentBlockhash("finalized")
                        ).blockhash;
                        selectQuestTx.recentBlockhash = recentBlockhash;
                        setOpenMessage("Please Approve Quest Selection Transaction.")
                        setOpen(true);
                        const signature = await wallet.sendTransaction(
                            selectQuestTx,
                            connection
                        );
                        setOpenMessage("Quest Selection Submitted.")
                        setOpen(true);
                        console.log(signature);
                        await connection.confirmTransaction(signature, "confirmed");
                        setOpenMessage("Quest Selection Succeeded.")
                        setOpen(true);
                    } catch (e) {
                        setOpen(true);
                        setOpenMessage("Quest Selection Failed. :(")
                        return;
                    }
                }
                setShowCompleted(false);
                setResync(resync + 1);
                setQuestsSelection(quest);
                setQuestsProgression(1);
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
            quests,
            setQuestsSelection,
            setQuestsProgression,
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
                            wallet.publicKey.toString(),
                            quest,
                            JSON.stringify(activeQuestProposals)
                        ))
                    )
                );

                if (Object.keys(startQuestsIx).length > 0) {
                    try {
                        const startQuestsTx = Transaction.populate(
                            new Message(startQuestsIx.message)
                        );
                        startQuestsTx.recentBlockhash = (
                            await connection.getRecentBlockhash("finalized")
                        ).blockhash;
                        setOpen(true);
                        setOpenMessage("Please Approve Start Quest Transaction.");
                        const signature = await wallet.sendTransaction(
                            startQuestsTx,
                            connection
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
                                {(questsProgression === 2 || (globalEnum === "recover" && activeQuestProposals.length > 0)) && (
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
                    <Snackbar
                        open={open}
                        autoHideDuration={6000}
                        onClose={handleClose}
                        sx={{zIndex: 100000000}}
                        anchorOrigin={{
                            vertical: "top",
                            horizontal: "center"
                        }}
                    >
                        <Alert onClose={handleClose} severity="success" sx={{width: '100%'}}>
                            {openMessage}
                        </Alert>
                    </Snackbar>
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
