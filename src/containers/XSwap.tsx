import {makeStyles} from '@mui/styles';
import {Box, Grid, Typography, TextField, Button, Select, MenuItem} from "@mui/material";
import {StyledCard} from "src/components/cards";
import {useMemo, useState, useEffect, useCallback} from 'react';
import {Connection, PublicKey} from "@solana/web3.js";
import {useWallet} from "@solana/wallet-adapter-react";
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import {Transaction, Message} from "@solana/web3.js";


declare function get_swaps(oracle: String): Promise<any>;
declare function invoke_swap(
  holder: String,
  oracle: String,
  swapIndex: String,
  amount: String,
): Promise<any>;
// @ts-ignore
export const XSwap = () => {
  const MINT = new PublicKey("GgYhiW7AqBGETa5d5Lb27gZbfNvcPF5b3HA3sTsBicbp");
  const ORACLE = new PublicKey("DnanY6jJYkHtFeTUVpioZbf6NXE8NhfpDje7ayxXp8x3");
  const wallet = useWallet();
  const [swaps, setSwaps] = useState([]);
  const [selectedFrom, setSelectedFrom] = useState(-1);
  const [selectedTo, setSelectedTo] = useState(-1);
  const [balance, setBalance] = useState(0.0);
  const [amount, setAmount] = useState(0.0);

  const connection = useMemo(
    () => new Connection("https://devnet.genesysgo.net"),
    []
  );

  const onInvokeSwap = useCallback((event) => {
    console.log(swaps[selectedFrom].Index, amount.toFixed(8));
    async function invokeSwap() {
      const selectQuestIx = JSON.parse(
        String.fromCharCode(
          // @ts-ignore
          ...(await invoke_swap(wallet.publicKey.toString(), ORACLE.toString(), String(swaps[selectedFrom].Index), amount.toFixed(8)))
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
    }
    invokeSwap();

  }, [swaps, selectedFrom, amount]);

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

  useEffect(() => {

  }, []);

  const onAmountChange = useCallback((event, fieldEnum) => {
    setAmount(Number(event.target.value));
  }, []);


  useEffect(() => {
    setAmount(Number(balance));
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
      <Box >
        <StyledCard className="swap-container" >
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
                  <Typography gutterBottom sx={{fontSize: '1.5rem'}} variant="h5" component="div">
                    Swap!
                  </Typography>
                </Button>
              </StyledCard>
            </Grid>
          </Grid>
          <Grid item xs={12} >
            <StyledCard className="swap-card">
              <Grid container item sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem'}}>
                <Grid item xs={2}>
                  <Typography variant="h5" component="div">
                    From
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <FormControl fullWidth>
                    <InputLabel>
                      Token
                    </InputLabel>
                    <Select
                      label="Token"
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
                <Grid item xs={6}>
                  <TextField
                    onChange={(event) => onAmountChange(event, "")}
                    type="number"
                    value={amount}
                    InputProps={{
                      inputProps: {
                        min: 0,
                        max: balance,
                        step: '0.1',
                        style: {textAlign: 'center'},
                      },
                      endAdornment: (<InputAdornment position="end"><Typography variant="h5" component="div">
                        {selectedFrom !== -1 ? swaps[selectedFrom].mintsMeta.from.tokenMetadata.symbol : ""}
                      </Typography>
                      </InputAdornment>),
                    }}
                    sx={{
                      backgroundColor: '#fff',
                      borderRadius: "25px",
                      '& fieldset': {
                        borderRadius: "25px",
                      },
                    }}
                  />
                </Grid>
              </Grid>
            </StyledCard>
            <StyledCard className="swap-card">
              <Grid container item sx={{display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem'}}>
                <Grid item xs={2}>
                  <Typography variant="h5" component="div">
                    To
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <FormControl fullWidth sx={{textAlignLast: 'center'}}>
                    <InputLabel>
                      <Typography align="center" gutterBottom variant="h5" component="div">
                        Token
                      </Typography>
                    </InputLabel>
                    <Select
                      label="Token"
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
                <Grid item xs={6}>
                  <TextField
                    onChange={(event) => onAmountChange(event, "")}
                    type="number"
                    value={amount}
                    InputProps={{
                      inputProps: {
                        min: 0,
                        max: balance,
                        step: '0.1',
                        style: {textAlign: 'center'},
                      },
                      endAdornment: (<InputAdornment position="end"><Typography variant="h5" component="div">
                        {selectedTo !== -1 ? swaps[selectedTo].mintsMeta.to.tokenMetadata.symbol : ""}
                      </Typography>
                      </InputAdornment>),
                    }}
                    sx={{
                      backgroundColor: '#fff',
                      borderRadius: "25px",
                      '& fieldset': {
                        borderRadius: "25px",
                      },
                    }}
                  />
                </Grid>
              </Grid>
            </StyledCard>
          </Grid>
        </StyledCard>
      </Box>
    </Grid>
  );
};

export default XSwap;
