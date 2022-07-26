import { makeStyles } from "@mui/styles";
import {
  Stack,
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
} from "@mui/material";
import { StyledCard } from "src/components/cards";
import { useMemo, useState, useEffect, useCallback, forwardRef } from "react";
import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import { Transaction, Message } from "@solana/web3.js";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import { BETS, WAGERS } from "./state/constants";
import {
  betSelectionAtom,
  wagerSelectionAtom,
  flipTransactionSignatureAtom,
  earningsAtom,
  balanceAtom,
} from "./state/atoms";
import { useRecoilState } from "recoil";

import Wager from "./components/wager";
import Processing from "./components/processing";
import Profit from "./components/profit";
import Stats from "./components/stats";
import { awaitTransactionSignatureConfirmation } from "src/utils/solana/transaction";

const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

declare function invoke_flip(
  oracle: String,
  holder: String,
  swapIndex: String,
  amount: String
): Promise<any>;

declare function get_escrow(holder: String): Promise<any>;

export const CONNECTION = "https://api.devnet.solana.com";
export const ORACLE = new PublicKey(
  "HkJJu4ycQjnVwBKpJyjmhsCJbbiPdL952Q9y75NDhJem"
);

// @ts-ignore
export const Flipper = () => {
  const wallet = useWallet();
  const [swaps, setSwaps] = useState([]);
  const [selectedFrom, setSelectedFrom] = useState(-1);
  const [selectedTo, setSelectedTo] = useState(-1);
  const [amount, setAmount] = useState(0.0);
  const [toAmount, setToAmount] = useState(0.0);
  const [open, setOpen] = useState(false);
  const [openMessage, setOpenMessage] = useState("");

  const [balance, setBalance] = useRecoilState(balanceAtom);
  const [earnings, setEarnings] = useRecoilState(earningsAtom);
  const [flipTransactionSignature, setFlipTransactionSignature] =
    useRecoilState(flipTransactionSignatureAtom);
  const [betSelection, setBetSelection] = useRecoilState(betSelectionAtom);
  const [wagerSelection, setWagerSelection] =
    useRecoilState(wagerSelectionAtom);

  const [activeStep, setActiveStep] = useState(0);

  const STEPS = ["Place Bets", "Await Transaction", "Profit"];

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  useEffect(() => {
    async function getBalance() {
      if (!wallet.publicKey) {
        return;
      }
      const nativeBalance = await connection.getBalance(wallet.publicKey);
      setBalance(nativeBalance / LAMPORTS_PER_SOL);
    }
    async function getEscrow() {
      if (!wallet.publicKey) {
        return;
      }
      const escrowMetadata = JSON.parse(
        String.fromCharCode(
          // @ts-ignore
          ...(await get_escrow(wallet.publicKey.toString()))
        )
      );
      console.log(Object.keys(escrowMetadata));
      if (Object.keys(escrowMetadata).length > 0) {
        setEarnings(escrowMetadata.AvailableBalance / LAMPORTS_PER_SOL);
      }
    }
    getEscrow();
    getBalance();
  }, [wallet]);

  const connection = useMemo(() => new Connection(CONNECTION), []);

  const onDrain = useCallback(() => {
    async function getEscrow() {
      if (!wallet.publicKey) {
        return;
      }
      const escrowMetadata = JSON.parse(
        String.fromCharCode(
          // @ts-ignore
          ...(await get_escrow(wallet.publicKey.toString()))
        )
      );
      console.log(Object.keys(escrowMetadata));
      if (Object.keys(escrowMetadata).length > 0) {
        setEarnings(escrowMetadata.AvailableBalance / LAMPORTS_PER_SOL);
      }
    }
    async function drainEscrow() {
      const selectQuestIx = JSON.parse(
        String.fromCharCode(
          // @ts-ignore
          ...(await drain_escrow(wallet.publicKey.toString()))
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

          setOpenMessage("Please Approve Transaction.");
          setOpen(true);

          const signature = await wallet.sendTransaction(
            selectQuestTx,
            connection
          );
          setFlipTransactionSignature(signature.toString());
          setEarnings(0);
          setActiveStep(1);
          setOpen(true);
          setOpenMessage("Transaction Submitted.");
          console.log(signature);

          // await connection.confirmTransaction(signature, "finalized");
          await awaitTransactionSignatureConfirmation(
            signature,
            connection,
            true
          );
          setBalance((prev) => prev + earnings);

          setActiveStep(2);
          setOpen(true);
          setOpenMessage("Transaction Succeeded.");
        } catch (e) {
          setOpen(true);
          setOpenMessage("Transaction Failed. :(");
        }
      }
    }

    drainEscrow();
  }, [wallet, earnings]);

  const onCTA = useCallback(() => {
    async function getEscrow() {
      if (!wallet.publicKey) {
        return;
      }
      const escrowMetadata = JSON.parse(
        String.fromCharCode(
          // @ts-ignore
          ...(await get_escrow(wallet.publicKey.toString()))
        )
      );
      console.log(Object.keys(escrowMetadata));
      if (Object.keys(escrowMetadata).length > 0) {
        setEarnings(escrowMetadata.AvailableBalance / LAMPORTS_PER_SOL);
      }
    }
    async function invokeFlip() {
      console.log(String(betSelection), String(wagerSelection));
      const selectQuestIx = JSON.parse(
        String.fromCharCode(
          // @ts-ignore
          ...(await invoke_flip(
            ORACLE.toString(),
            wallet.publicKey.toString(),
            String(Math.floor(BETS[betSelection] * LAMPORTS_PER_SOL)),
            String(WAGERS[wagerSelection])
          ))
        )
      );

      console.log(selectQuestIx);
      if (Object.keys(selectQuestIx).length > 0) {
        try {
          const selectQuestTx = Transaction.populate(
            new Message(selectQuestIx.message)
          );
          const recentBlockhash = (
            await connection.getRecentBlockhash("finalized")
          ).blockhash;
          selectQuestTx.recentBlockhash = recentBlockhash;

          setOpenMessage("Please Approve Transaction.");
          setOpen(true);

          const signature = await wallet.sendTransaction(
            selectQuestTx,
            connection
          );
          setFlipTransactionSignature(signature.toString());
          setBalance((prev) => prev - BETS[betSelection]);
          setActiveStep(1);
          setOpen(true);
          setOpenMessage("Transaction Submitted.");
          console.log(signature);

          // await connection.confirmTransaction(signature, "finalized");
          await awaitTransactionSignatureConfirmation(
            signature,
            connection,
            true
          );
          await getEscrow();

          setActiveStep(2);
          setOpen(true);
          setOpenMessage("Transaction Succeeded.");
        } catch (e) {
          setOpen(true);
          setOpenMessage("Transaction Failed. :(");
        }
      }
    }

    async function executor() {
      switch (activeStep) {
        case 0: {
          await invokeFlip();
          break;
        }
      }
    }

    executor();
  }, [wallet, activeStep, setActiveStep, wagerSelection, betSelection]);

  let body;
  switch (activeStep) {
    case 0: {
      body = <Wager onCTA={onCTA} />;
      break;
    }
    case 1: {
      body = <Processing />;
      break;
    }
    case 2: {
      body = <Profit />;
      break;
    }
    case 3: {
      body = <Stats />;
      break;
    }
  }

  return (
    <>
      <StyledCard>
        <Stepper activeStep={activeStep} alternativeLabel>
          {STEPS.map((label) => (
            <Step key={label}>
              <StepLabel
                sx={{
                  "& .Mui-active": { color: "orange !important" },
                  "& .Mui-completed": { color: "orange !important" },
                }}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </StyledCard>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <StyledCard>
          <Stack>
            <Typography gutterBottom variant="h5" component="div">
              Claimable Earnings:
              <Typography gutterBottom variant="h5" component="div">
                {earnings.toFixed(6)} SOL
              </Typography>
            </Typography>
            <Typography gutterBottom variant="h5" component="div">
              Balance:
              <Typography gutterBottom variant="h5" component="div">
                {balance.toFixed(6)} SOL
              </Typography>
            </Typography>
          </Stack>
        </StyledCard>
      </Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "right",
        }}
      >
        <Grid container>
          <Grid item xs={4}>
            <StyledCard>
              <Button onClick={() => setActiveStep(0)}>
                <Typography
                  gutterBottom
                  fontSize={20}
                  variant="h5"
                  component="div"
                >
                  Start New Flip
                </Typography>
              </Button>
            </StyledCard>
          </Grid>
          <Grid item xs={4}>
            <StyledCard>
              <Button onClick={() => setActiveStep(3)}>
                <Typography
                  gutterBottom
                  fontSize={20}
                  variant="h5"
                  component="div"
                >
                  Stats
                </Typography>
              </Button>
            </StyledCard>
          </Grid>
          <Grid item xs={4}>
            <StyledCard>
              <Button onClick={onDrain}>
                <Typography
                  gutterBottom
                  fontSize={20}
                  variant="h5"
                  component="div"
                >
                  Withdraw Earnings
                </Typography>
              </Button>
            </StyledCard>
          </Grid>
        </Grid>
      </Box>
      <Snackbar
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        sx={{ zIndex: 100000000 }}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          {openMessage}
        </Alert>
      </Snackbar>
      {body}
    </>
  );
};

export default Flipper;
