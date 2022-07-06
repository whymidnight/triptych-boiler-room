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
  const ORACLE = new PublicKey("FMujfP2mkVwBDAJ7FSEysFANsUv7jiYpZHEgerQVfvC8");
  const wallet = useWallet();
  const [swaps, setSwaps] = useState([]);
  const [swapId, setSwapId] = useState(0);
  const [balance, setBalance] = useState(0.0);
  const [amount, setAmount] = useState(0.0);

  const connection = useMemo(
    () => new Connection("https://devnet.genesysgo.net"),
    []
  );

  const onInvokeSwap = useCallback((event) => {
    console.log(swaps[swapId].Index, amount.toFixed(8));
    async function invokeSwap() {
      const selectQuestIx = JSON.parse(
        String.fromCharCode(
          // @ts-ignore
          ...(await invoke_swap(wallet.publicKey.toString(), ORACLE.toString(), String(swaps[swapId].Index), amount.toFixed(8)))
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

  }, [swaps, swapId, amount]);

  const onSwapSelect = useCallback((event, swapIndex) => {
    setSwapId(swapIndex);
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
      if (swaps.length < swapId) return;
      if (swaps[swapId] === undefined) return;
      console.log(swaps, swapId);
      const userTokens = await connection.getParsedTokenAccountsByOwner(wallet.publicKey, {mint: new PublicKey(swaps[swapId].FromMint)})
      if (userTokens.value.length === 0) return;
      setBalance(userTokens.value[0].account.data.parsed.info.tokenAmount.uiAmount);
    }

    fetchBalance();
  }, [wallet, swaps, swapId]);

  useEffect(() => {
    async function getTokens() {
      if (!wallet.publicKey) return;

      const swaps = JSON.parse(String.fromCharCode(...(await get_swaps(ORACLE.toString()))));
      console.log(swaps);
      setSwaps(swaps.map((swap, index) => ({...swap, name: String('debug' + " #" + index)})));
    }
    getTokens();
  }, [wallet]);


  return (
    <Grid container sx={{paddingTop: '35vh', display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
      <Box >

        <StyledCard className="swap-card" >
          <Grid container item xs={12}>
            <Grid item xs={2}>
            </Grid>
            <Grid item xs={8}>
              <FormControl fullWidth sx={{textAlignLast: 'center'}}>
                <InputLabel>
                  <Typography align="center" gutterBottom variant="h5" component="div">
                    {swaps.length > swapId ? swaps[swapId].name : "Select Swap"}
                  </Typography>
                </InputLabel>
                <Select
                  inputProps={{
                    inputProps: {
                      style: {
                        textAlign: 'center',
                      },
                    },
                  }}
                >
                  {swaps.map((swap, index) => (
                    <MenuItem
                      sx={{
                        background: 'linear-gradient(140.14deg,rgb(0 182 191 / 15%),rgb(27 22 89 / 10%) 86.61%),linear-gradient(321.82deg,rgb(24 19 77),rgb(27 22 89))',
                      }}
                      value={10}
                      onClick={(event) => onSwapSelect(event, index)}
                    >{swap.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={2}>
            </Grid>
          </Grid>
        </StyledCard>

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
                <Grid item xs={1}>
                </Grid>
                <Grid item xs={8}>
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
                        stakedNBA
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
                <Grid item xs={1}>
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
                <Grid item xs={1}>
                </Grid>
                <Grid
                  item
                  xs={8}
                >
                  <TextField
                    disabled={true}
                    value={amount}
                    InputProps={{
                      inputProps: {
                        style: {textAlign: 'center'},
                      },
                      endAdornment: (<InputAdornment position="end"><Typography variant="h5" component="div">
                        NBA
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
                <Grid item xs={1}>
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
