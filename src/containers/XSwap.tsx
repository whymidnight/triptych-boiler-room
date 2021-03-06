import {makeStyles} from '@mui/styles';
import {Box, Grid, Typography, TextField, Button, Select, MenuItem} from "@mui/material";
import {StyledCard} from "src/components/cards";
import {useMemo, useState, useEffect, useCallback, forwardRef} from 'react';
import {Connection, PublicKey} from "@solana/web3.js";
import {useWallet} from "@solana/wallet-adapter-react";
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import {Transaction, Message} from "@solana/web3.js";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, {AlertProps} from '@mui/material/Alert';

const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
    props,
    ref,
) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


declare function get_swaps(oracle: String): Promise<any>;
declare function invoke_swap(
    holder: String,
    oracle: String,
    swapIndex: String,
    amount: String,
): Promise<any>;
// @ts-ignore
export const XSwap = () => {
    const ORACLE = new PublicKey("GbfoTncFrg8PxS2KY9mmCHz73Bv9cXUxsr7Q66y5SUDo");
    const wallet = useWallet();
    const [swaps, setSwaps] = useState([]);
    const [selectedFrom, setSelectedFrom] = useState(-1);
    const [selectedTo, setSelectedTo] = useState(-1);
    const [balance, setBalance] = useState(0.0);
    const [amount, setAmount] = useState(0.0);
    const [toAmount, setToAmount] = useState(0.0);
    const [open, setOpen] = useState(false);
    const [openMessage, setOpenMessage] = useState("");

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };

    const connection = useMemo(
        () => new Connection("https://api.mainnet-beta.solana.com"),
        []
    );

    const onInvokeSwap = useCallback((event) => {
        console.log(swaps[selectedFrom].Index, amount.toFixed(8));
        async function invokeSwap() {
            console.log(swaps[selectedFrom].swapMeta.Index);
            const selectQuestIx = JSON.parse(
                String.fromCharCode(
                    // @ts-ignore
                    ...(await invoke_swap(wallet.publicKey.toString(), ORACLE.toString(), String(swaps[selectedFrom].swapMeta.Index), amount.toFixed(8)))
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

                    setOpenMessage("Please Approve Swap Transaction.");
                    setOpen(true);

                    const signature = await wallet.sendTransaction(
                        selectQuestTx,
                        connection
                    );
                    setOpen(true);
                    setOpenMessage("Swap Transaction Submitted.");
                    console.log(signature);
                    await connection.confirmTransaction(signature, "confirmed");
                    setOpen(true);
                    setOpenMessage("Swap Transaction Succeeded.");
                    setBalance(balance - amount);
                } catch (e) {
                    setOpen(true);
                    setOpenMessage("Swap Transaction Failed. :(");
                }
            }
        }
        invokeSwap();

    }, [swaps, selectedFrom, amount, balance, setOpen, setOpenMessage]);

    const onAmountUpdate = useCallback((event, direction, op) => {
        event.preventDefault();
        if (selectedFrom === -1) return;

        switch (direction) {
            case "from": {
                switch (op) {
                    case "decr": {
                        const toAmountInp = Math.floor(Number(amount - swaps[selectedFrom].swapMeta.Per) / swaps[selectedFrom].swapMeta.Per);
                        const amountInp = toAmountInp * swaps[selectedFrom].swapMeta.Per;
                        if (amountInp < 0 || amountInp > balance) return;
                        setToAmount(toAmountInp);
                        setAmount(amountInp);
                        break;
                    }
                    case "incr": {
                        const toAmountInp = Math.floor(Number(swaps[selectedFrom].swapMeta.Per + amount) / swaps[selectedFrom].swapMeta.Per);
                        const amountInp = toAmountInp * swaps[selectedFrom].swapMeta.Per;
                        if (amountInp < 0 || amountInp > balance) return;
                        setToAmount(toAmountInp);
                        setAmount(amountInp);
                        break;
                    }
                }
                break;
            }
            case "to": {
                switch (op) {
                    case "decr": {
                        const toAmountInp = Math.floor(Number(amount - swaps[selectedFrom].swapMeta.Per) / swaps[selectedFrom].swapMeta.Per);
                        const amountInp = toAmountInp * swaps[selectedFrom].swapMeta.Per;
                        if (amountInp < 0 || amountInp > balance) return;
                        setToAmount(toAmountInp);
                        setAmount(amountInp);
                        break;
                    }
                    case "incr": {
                        const toAmountInp = Math.floor(Number(swaps[selectedFrom].swapMeta.Per + amount) / swaps[selectedFrom].swapMeta.Per);
                        const amountInp = toAmountInp * swaps[selectedFrom].swapMeta.Per;
                        if (amountInp < 0 || amountInp > balance) return;
                        setToAmount(toAmountInp);
                        setAmount(amountInp);
                        break;
                    }
                }
                break;
            }
        }

    }, [amount, swaps, selectedFrom, balance]);

    const onSwapSelect = useCallback((event, side, index) => {
        console.log(side, index, swaps[index]);
        switch (side) {
            case "from": {
                setSelectedFrom(index);
                break;
            }
            case "to": {
                setSelectedTo(index);
                break;
            }
        }
    }, [setSelectedTo, setSelectedFrom]);

    const onAmountChange = useCallback((event, fieldEnum) => {

        const toAmountInp = Math.floor(Number(event.target.value) / swaps[selectedFrom].swapMeta.Per);
        const amountInp = toAmountInp * swaps[selectedFrom].swapMeta.Per;

        setAmount(amountInp);
        setToAmount(toAmountInp);
    }, [swaps, selectedFrom])


    useEffect(() => {
        setAmount(0);
        setToAmount(0);
    }, [balance]);

    useEffect(() => {
        async function fetchBalance() {
            if (!wallet.publicKey) return;
            if (swaps.length < selectedFrom) return;
            if (swaps[selectedFrom] === undefined) return;
            const userTokens = await connection.getParsedTokenAccountsByOwner(wallet.publicKey, {mint: new PublicKey(swaps[selectedFrom].swapMeta.FromMint)})
            if (userTokens.value.length !== 0) {
                setBalance(userTokens.value[0].account.data.parsed.info.tokenAmount.uiAmount);
                return;
            }
            setBalance(0);
        }

        fetchBalance();
    }, [wallet, swaps, selectedFrom]);

    useEffect(() => {
        async function getTokens() {
            if (!wallet.publicKey) return;

            const swaps = JSON.parse(String.fromCharCode(...(await get_swaps(ORACLE.toString()))));
            console.log(swaps);
            setSwaps(
                swaps
                    .map((swap, index) => ({...swap, name: String('debug' + " #" + index)}))
            );
        }
        getTokens();
    }, [wallet]);


    return (
        <Grid
            container
            sx={{
                paddingTop: '35vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
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
            <Box >
                <StyledCard className="swap-container" >
                    <StyledCard className="swap-card">
                        <Typography variant="h5" component="div">
                            From-To
                        </Typography>
                        <Typography variant="h5" component="div">
                            {selectedFrom !== -1 ? swaps[selectedFrom].mintsMeta.from.tokenMetadata.symbol : "Token"}
                            -
                            {selectedTo !== -1 ? swaps[selectedFrom].mintsMeta.to.tokenMetadata.symbol : "Token"}
                        </Typography>
                    </StyledCard>
                    <Grid container item xs={12}>
                        <Grid item xs={6}>
                            <StyledCard className="swap-card">
                                <Typography gutterBottom variant="h5" component="div">
                                    Balance: {balance} {balance > 0 && "tokens"}
                                </Typography>
                            </StyledCard>
                        </Grid>
                        <Grid item xs={6}>
                            <StyledCard className="swap-card">
                                <Button onClick={onInvokeSwap}>
                                    <Typography sx={{fontSize: '1.5rem'}} variant="h5" component="div">
                                        Swap!
                                    </Typography>
                                </Button>
                            </StyledCard>
                        </Grid>
                    </Grid>
                    <Grid item xs={12} >
                        <StyledCard className="swap-card">
                            <Grid container item sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem'}}>
                                <Grid item xs={4}>
                                    <FormControl fullWidth sx={{textAlignLast: 'center'}}>
                                        <InputLabel>
                                            {selectedFrom !== -1 ? swaps[selectedFrom].mintsMeta.from.tokenMetadata.symbol : "Token"}
                                        </InputLabel>
                                        <Select
                                            label={selectedFrom !== -1 ? swaps[selectedFrom].mintsMeta.from.tokenMetadata.symbol : "Token"}
                                            value={String(selectedFrom)}
                                        >
                                            <MenuItem
                                                sx={{
                                                    background: 'linear-gradient(140.14deg,rgb(0 182 191 / 15%),rgb(27 22 89 / 10%) 86.61%),linear-gradient(321.82deg,rgb(24 19 77),rgb(27 22 89))',
                                                }}
                                                value={-1}
                                                onClick={(event) => onSwapSelect(event, "from", -1)}
                                            >Select...</MenuItem>
                                            {swaps
                                                .map((swap, index) => (
                                                    <MenuItem
                                                        sx={{
                                                            background: 'linear-gradient(140.14deg,rgb(0 182 191 / 15%),rgb(27 22 89 / 10%) 86.61%),linear-gradient(321.82deg,rgb(24 19 77),rgb(27 22 89))',
                                                        }}
                                                        value={index}
                                                        onClick={(event) => onSwapSelect(event, "from", index)}
                                                    >{swap.mintsMeta.from.tokenMetadata.name}</MenuItem>
                                                ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={8}>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            backgroundColor: '#fff',
                                            borderRadius: "25px",
                                            '& button': {
                                                borderRadius: "25px",
                                                borderColor: '#fff',
                                                textAlign: 'center',
                                            },
                                            '& fieldset': {
                                                borderColor: '#fff',
                                                textAlign: 'center',
                                            },
                                        }}
                                    >
                                        <Button className="swap-card" onClick={(event) => onAmountUpdate(event, "from", "decr")}>
                                            -
                                        </Button>
                                        <TextField
                                            onChange={(event) => onAmountChange(event, "")}
                                            type="number"
                                            value={Number(amount).toString()}
                                            InputProps={{
                                                inputProps: {
                                                    min: 0,
                                                    max: balance,
                                                    step: swaps.hasOwnProperty(selectedFrom) ? String(swaps[selectedFrom].swapMeta.Per) : '1',
                                                    style: {textAlign: 'center'},
                                                },
                                            }}
                                        />
                                        <Button className="swap-card" onClick={(event) => onAmountUpdate(event, "from", "incr")}>
                                            +
                                        </Button>
                                    </Box>
                                </Grid>
                            </Grid>
                        </StyledCard>
                        <StyledCard className="swap-card">
                            <Grid container item sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem'}}>
                                <Grid item xs={4}>
                                    <FormControl fullWidth sx={{textAlignLast: 'center'}}>
                                        <InputLabel>
                                            <Typography align="center" gutterBottom variant="h5" component="div">
                                                {selectedFrom !== -1 ? swaps[selectedFrom].mintsMeta.to.tokenMetadata.symbol : "Token"}
                                            </Typography>
                                        </InputLabel>
                                        <Select
                                            label={selectedFrom !== -1 ? swaps[selectedFrom].mintsMeta.to.tokenMetadata.symbol : "Token"}
                                            value={selectedTo}
                                        >
                                            <MenuItem
                                                sx={{
                                                    background: 'linear-gradient(140.14deg,rgb(0 182 191 / 15%),rgb(27 22 89 / 10%) 86.61%),linear-gradient(321.82deg,rgb(24 19 77),rgb(27 22 89))',
                                                }}
                                                value={-1}
                                                onClick={(event) => onSwapSelect(event, "to", -1)}
                                            >Select...</MenuItem>
                                            {selectedFrom === -1 &&
                                                (
                                                    swaps.reduce((acc, item) => {
                                                        if (!acc.some((someItem) => someItem.swapMeta.ToMint === item.swapMeta.ToMint)) {
                                                            return [...acc, item];
                                                        }

                                                        return [...acc];
                                                    }, [])
                                                )

                                                    .map((swap, index) => (
                                                        <MenuItem
                                                            sx={{
                                                                background: 'linear-gradient(140.14deg,rgb(0 182 191 / 15%),rgb(27 22 89 / 10%) 86.61%),linear-gradient(321.82deg,rgb(24 19 77),rgb(27 22 89))',
                                                            }}
                                                            value={index}
                                                            onClick={(event) => onSwapSelect(event, "to", index)}
                                                        >{swap.mintsMeta.to.tokenMetadata.name}</MenuItem>
                                                    ))}
                                            {swaps
                                                .filter((swap, index) => (
                                                    selectedFrom !== -1
                                                        ? swaps[index].swapMeta.FromMint === swaps[selectedFrom].swapMeta.FromMint
                                                        : false

                                                ))
                                                .map((swap, index) => (
                                                    <MenuItem
                                                        sx={{
                                                            background: 'linear-gradient(140.14deg,rgb(0 182 191 / 15%),rgb(27 22 89 / 10%) 86.61%),linear-gradient(321.82deg,rgb(24 19 77),rgb(27 22 89))',
                                                        }}
                                                        value={index}
                                                        onClick={(event) => onSwapSelect(event, "to", index)}
                                                    >{swap.mintsMeta.to.tokenMetadata.name}</MenuItem>
                                                ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={8}>
                                    <Box
                                        sx={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            backgroundColor: '#fff',
                                            borderRadius: "25px",
                                            '& button': {
                                                borderRadius: "25px",
                                                borderColor: '#fff',
                                                textAlign: 'center',
                                            },
                                            '& fieldset': {
                                                borderColor: '#fff',
                                                textAlign: 'center',
                                            },
                                        }}
                                    >
                                        <Button className="swap-card" onClick={(event) => onAmountUpdate(event, "to", "decr")}>
                                            -
                                        </Button>
                                        <TextField
                                            onChange={(event) => onAmountChange(event, "")}
                                            type="number"
                                            value={Number(toAmount).toString()}
                                            InputProps={{
                                                inputProps: {
                                                    min: 0,
                                                    max: balance,
                                                    step: swaps.hasOwnProperty(selectedFrom) ? String(swaps[selectedFrom].swapMeta.Per) : '1',
                                                    style: {textAlign: 'center'},
                                                },
                                            }}
                                        />
                                        <Button className="swap-card" onClick={(event) => onAmountUpdate(event, "to", "incr")}>
                                            +
                                        </Button>
                                    </Box>
                                </Grid>
                            </Grid>
                        </StyledCard>
                    </Grid>
                </StyledCard>
            </Box>
        </Grid >
    );
};

export default XSwap;
