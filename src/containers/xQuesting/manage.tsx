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
import {ORACLE, CONNECTION} from './index';
import moment from "moment";

declare function get_quests_kpis(
    oracle: String,
    holder: String,
): Promise<any>;

const timeScalars = [1000, 60, 60, 24, 7, 52];

const getHumanReadableTime = (s, dp = 0) => {
    const timeUnits = ['ms', 'second', 'minute', 'hour', 'day', 'week', 'year'];
    let ms = s * 1000;
    let timeScalarIndex = 0, scaledTime = ms;

    while (scaledTime > timeScalars[timeScalarIndex]) {
        scaledTime /= timeScalars[timeScalarIndex++];
    }

    return `${scaledTime.toFixed(dp)} ${timeUnits[timeScalarIndex]}`;
};
const getHumanReadablePluralTime = (s, dp = 0) => {
    const timeUnits = ['ms', 'seconds', 'minutes', 'hours', 'days', 'weeks', 'years'];
    let ms = s * 1000;
    let timeScalarIndex = 0, scaledTime = ms;

    while (scaledTime > timeScalars[timeScalarIndex]) {
        scaledTime /= timeScalars[timeScalarIndex++];
    }

    return `${scaledTime.toFixed(dp)} ${timeUnits[timeScalarIndex]}`;
};

export const QuestedGalleryItemsHeader = ({quest, kpis}) => {
    const wallet = useWallet();
    const [quests] = useRecoilState(questsAtom);
    const [questsKPIs, setQuestsKPIs] = useRecoilState(questsKPIsAtom);
    const [questsProposals] = useRecoilState(questsProposalsAtom);
    const [resync, setResync] = useRecoilState(resyncAtom);
    const [kpisElems, setKpis] = useState([]);

    const kpiEnums = ["entryCost", "stakingReward", "totalStaked", "type", "payoutMeta"];

    useEffect(() => {
        let old = [];
        const kpisNormalized = kpis.filter((v, i, a) => a.indexOf(v) === i && v !== "");
        if (kpisNormalized.length === 0) return;
        if (kpisNormalized.some((item) => kpiEnums.indexOf(item) === -1)) {
            setKpis([]);
            return;
        }

        for (const kpi in kpisNormalized) {
            if (!quests.hasOwnProperty(quest)) break;
            old.push(
                <Grid item container direction="row" justifyContent="center" alignItems="center" xs={2}>
                    <Divider
                        orientation="vertical"
                        style={{height: '100%', width: '1px', backgroundColor: 'orange'}} />
                </Grid>
            );

            switch (kpisNormalized[kpi]) {
                case "entryCost": {
                    old.push(
                        <Grid item sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}} xs={6 / kpisNormalized.length}>
                            <Stack>
                                <Typography
                                    gutterBottom
                                    variant="h5"
                                    component="div"
                                    sx={{paddingTop: "2px"}}
                                >
                                    {quests[quest].Tender.Amount / Math.pow(10, quests[quest].Tender.Decimals)} {quests[quest].Tender.Name}
                                </Typography>
                                <Typography
                                    gutterBottom
                                    variant="h5"
                                    component="div"
                                    sx={{paddingTop: "2px"}}
                                >
                                    Entry Cost
                                </Typography>
                            </Stack>
                        </Grid>
                    );
                    break;
                }
                case "stakingReward": {
                    old.push(
                        <Grid item sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}} xs={6 / kpisNormalized.length}>
                            <Stack>
                                <Typography
                                    gutterBottom
                                    variant="h5"
                                    component="div"
                                    sx={{paddingTop: "2px"}}
                                >
                                    {questsKPIs.hasOwnProperty(quest) ? Number(questsKPIs[quest].stakingRewards).toFixed(quests[quest].StakingConfig.Decimals) : "0.0"}
                                </Typography>
                                <Typography
                                    gutterBottom
                                    variant="h5"
                                    component="div"
                                    sx={{paddingTop: "2px"}}
                                >
                                    {quests[quest].StakingConfig.Name}
                                </Typography>
                            </Stack>
                        </Grid>
                    );
                    break;
                }
                case "totalStaked": {
                    old.push(
                        <Grid item sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}} xs={6 / kpisNormalized.length}>
                            <Stack>
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
                            </Stack>
                        </Grid>
                    );
                    break;
                }
                case "type": {
                    old.push(
                        <Grid item sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}} xs={6 / kpisNormalized.length}>
                            <Stack>
                                <Typography
                                    gutterBottom
                                    variant="h5"
                                    component="div"
                                    sx={{paddingTop: "2px"}}
                                >
                                    {getHumanReadableTime(quests[quest].Duration)}
                                </Typography>
                                <Typography
                                    gutterBottom
                                    variant="h5"
                                    component="div"
                                    sx={{paddingTop: "2px"}}
                                >
                                    Lockup Period
                                </Typography>
                            </Stack>
                        </Grid>
                    );
                    break;
                }
                case "payoutMeta": {
                    old.push(
                        <Grid item sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}} xs={6 / kpisNormalized.length}>
                            <Stack>
                                <Typography
                                    gutterBottom
                                    variant="h5"
                                    component="div"
                                    sx={{paddingTop: "2px"}}
                                >
                                    {quests[quest].StakingConfig.YieldPer / Math.pow(10, quests[quest].StakingConfig.Decimals)} {quests[quest].StakingConfig.Name}
                                </Typography>
                                <Typography
                                    gutterBottom
                                    variant="h5"
                                    component="div"
                                    sx={{paddingTop: "2px"}}
                                >
                                    Every {getHumanReadablePluralTime(quests[quest].StakingConfig.YieldPerTime)}
                                </Typography>
                            </Stack>
                        </Grid>
                    );
                    break;
                }
            }

        }
        if (old.length !== kpisNormalized.length - 1) {
            old.push(
                <Grid item container direction="row" justifyContent="center" alignItems="center" xs={2}>
                    <Divider
                        orientation="vertical"
                        style={{height: '100%', width: '1px', backgroundColor: 'orange'}} />
                </Grid>
            );
        }
        setKpis(old);
    }, []);

    useEffect(() => {

        let old = [];
        const kpisNormalized = kpis.filter((v, i, a) => a.indexOf(v) === i && v !== "");
        if (kpisNormalized.length === 0) return;
        if (kpisNormalized.some((item) => kpiEnums.indexOf(item) === -1)) {
            setKpis([]);
            return;
        }

        for (const kpi in kpisNormalized) {
            if (!quests.hasOwnProperty(quest)) break;
            old.push(
                <Grid item container direction="row" justifyContent="center" alignItems="center" xs={2}>
                    <Divider
                        orientation="vertical"
                        style={{height: '100%', width: '1px', backgroundColor: 'orange'}} />
                </Grid>
            );

            switch (kpisNormalized[kpi]) {
                case kpiEnums[0]: {
                    old.push(
                        <Grid item sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}} xs={6 / kpisNormalized.length}>
                            <Stack>
                                <Typography
                                    gutterBottom
                                    variant="h5"
                                    component="div"
                                    sx={{paddingTop: "2px"}}
                                >
                                    {quests[quest].Tender.Amount / Math.pow(10, quests[quest].Tender.Decimals)} {quests[quest].Tender.Name}
                                </Typography>
                                <Typography
                                    gutterBottom
                                    variant="h5"
                                    component="div"
                                    sx={{paddingTop: "2px"}}
                                >
                                    Entry Cost
                                </Typography>
                            </Stack>
                        </Grid>
                    );
                    break;
                }
                case "stakingReward": {
                    old.push(
                        <Grid item sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}} xs={6 / kpisNormalized.length}>
                            <Stack>
                                <Typography
                                    gutterBottom
                                    variant="h5"
                                    component="div"
                                    sx={{paddingTop: "2px"}}
                                >
                                    {questsKPIs.hasOwnProperty(quest) ? Number(questsKPIs[quest].stakingRewards).toFixed(quests[quest].StakingConfig.Decimals) : "0.0"}
                                </Typography>
                                <Typography
                                    gutterBottom
                                    variant="h5"
                                    component="div"
                                    sx={{paddingTop: "2px"}}
                                >
                                    {quests[quest].StakingConfig.Name} Accrued
                                </Typography>
                            </Stack>
                        </Grid>
                    );
                    break;
                }
                case "totalStaked": {
                    old.push(
                        <Grid item sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}} xs={6 / kpisNormalized.length}>
                            <Stack>
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
                            </Stack>
                        </Grid>
                    );
                    break;
                }
                case "type": {
                    old.push(
                        <Grid item sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}} xs={6 / kpisNormalized.length}>
                            <Stack>
                                <Typography
                                    gutterBottom
                                    variant="h5"
                                    component="div"
                                    sx={{paddingTop: "2px"}}
                                >
                                    {getHumanReadableTime(quests[quest].Duration)}
                                </Typography>
                                <Typography
                                    gutterBottom
                                    variant="h5"
                                    component="div"
                                    sx={{paddingTop: "2px"}}
                                >
                                    Lockup Period
                                </Typography>
                            </Stack>
                        </Grid>
                    );
                    break;
                }
                case "payoutMeta": {
                    old.push(
                        <Grid item sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}} xs={6 / kpisNormalized.length}>
                            <Stack>
                                <Typography
                                    gutterBottom
                                    variant="h5"
                                    component="div"
                                    sx={{paddingTop: "2px"}}
                                >
                                    {quests[quest].StakingConfig.YieldPer / Math.pow(10, quests[quest].StakingConfig.Decimals)} {quests[quest].StakingConfig.Name}
                                </Typography>
                                <Typography
                                    gutterBottom
                                    variant="h5"
                                    component="div"
                                    sx={{paddingTop: "2px"}}
                                >
                                    Every {getHumanReadablePluralTime(quests[quest].StakingConfig.YieldPerTime)}
                                </Typography>
                            </Stack>
                        </Grid>
                    );
                    break;
                }
            }
        }

        old.push(
            <Grid item xs={2} container direction="row" justifyContent="center" alignItems="center">
                <Divider
                    orientation="vertical"
                    style={{height: '100%', width: '1px', backgroundColor: 'orange'}} />
            </Grid>
        );
        setKpis(old);
    }, [questsKPIs, setKpis]);


    const stakingRewards = useCallback(() => {
        console.log(questsProposals[quest])
        return 0;
    }, []);

    useEffect(() => {
        // console.log(kpisElems);
    }, [kpisElems]);

    return (
        <>
            {kpisElems.length > 0 && (
                <Grid container justifyContent="center" xs={12} sx={{height: '100px', color: 'white'}}>
                    <StyledCard sx={{width: '100%'}}>
                        <Grid container justifyContent="center" item sx={{width: '100%'}} direction="row" xs={12}>
                            {kpisElems}
                        </Grid>
                    </StyledCard>
                </Grid>
            )}
        </>
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
                    break;
                }
                case "manage": {
                    purgatory = questsProposals.hasOwnProperty(questSelection) ? questsProposals[questSelection].filter(({Started, Finished}) => Started && !Finished) : [];
                    break;
                }
                case "reward": {
                    purgatory = questsProposals.hasOwnProperty(questSelection) ? questsProposals[questSelection].filter(({Started, Finished}) => Started && !Finished) : [];
                    break;
                }
                default: {
                    console.log("congrats on another easter egg :)")
                }
            }


            console.log(".....", globalEnum, showStarted, questsProposals[questSelection]);

            const pairs = await Promise.all(purgatory.map(async (item) => {
                let disabled = true;
                let remainingTime = 0;

                let elapsedSinceEnd = Math.round((new Date()).getTime() / 1000) - item.EndTime;
                if (elapsedSinceEnd >= 0) {
                    disabled = false;
                } else {
                    remainingTime = Math.abs(elapsedSinceEnd);
                }
                if (globalEnum === "reward") {
                    disabled = false;
                }

                return {
                    index: item.Index,
                    fulfilled: item.Fulfilled,
                    started: item.Started,
                    disabled,
                    remainingTime,
                    depositsMints: [...item.DepositingLeft !== null ? item.DepositingLeft : [], ...item.DepositingRight !== null ? item.DepositingRight : []],
                    depositsMetadata: await Promise.all(
                        (
                            await Metaplex.make(
                                new Connection(
                                    CONNECTION,
                                )
                            )
                                .nfts()
                                .findAllByMintList(
                                    //@ts-ignore
                                    [
                                        ...item.DepositingLeft !== null
                                            ? item.DepositingLeft
                                                .filter((_, index) => item.RecordLeft[index])
                                                .map((mint) => new PublicKey(mint))
                                            : [],
                                        ...item.DepositingRight !== null
                                            ? item.DepositingRight
                                                .filter((_, index) => item.RecordRight[index])
                                                .map((mint) => new PublicKey(mint))
                                            : [],
                                    ],
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
                {globalEnum !== "recover" && (
                    <QuestedGalleryItemsHeader
                        quest={questSelection}
                        kpis={[
                            quests.hasOwnProperty(questSelection) && quests[questSelection].StakingConfig !== null ? "stakingReward" : "",
                        ]}
                    />
                )}
                {nftsQuested.map(({depositsMetadata, disabled, remainingTime}, pairIndex) => (
                    <StyledCard>
                        <Grid container item key={pairIndex} justifyContent="center" >
                            <Grid item xs={12} sx={{display: 'flex', justifyContent: 'center'}}>
                                <Grid item xs={6} sx={{display: 'flex', justifyContent: 'center'}}>
                                    <Box>
                                        <Button
                                            disabled={disabled}
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
                                <Grid item xs={6} sx={{display: 'flex', justifyContent: 'center'}}>
                                    <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                        <Stack>
                                            <Typography
                                                align="right"
                                                variant="h5"
                                            >
                                                Time Remaining
                                            </Typography>
                                            <Typography
                                                align="right"
                                                variant="h5"
                                            >
                                                {getHumanReadablePluralTime(remainingTime)}
                                            </Typography>
                                        </Stack>
                                    </Box>
                                </Grid>
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
