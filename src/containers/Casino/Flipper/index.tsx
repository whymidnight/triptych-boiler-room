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
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
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
import { escrowBalanceAtom, walletBalanceAtom } from "../Escrow/state/atoms";
import BalanceOverview from "../Escrow/components/balanceOverview";
import BalanceManagement from "../Escrow/components/balanceManagement";

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
  amount: String,
  operator: String
): Promise<any>;

declare function get_escrow(holder: String): Promise<any>;

export const CONNECTION = "https://ssc-dao.genesysgo.net";
export const ORACLE = new PublicKey(
  "GbfoTncFrg8PxS2KY9mmCHz73Bv9cXUxsr7Q66y5SUDo"
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

  const [balance, setBalance] = useRecoilState(walletBalanceAtom);
  const [earnings, setEarnings] = useRecoilState(escrowBalanceAtom);
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
          alert(e);
          console.log(e);
        }
      }
    }

    drainEscrow();
  }, [wallet, earnings]);

  const onCTA = useCallback(
    (operator) => {
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
        console.log(operator);
        const selectQuestIx = JSON.parse(
          String.fromCharCode(
            // @ts-ignore
            ...(await invoke_flip(
              ORACLE.toString(),
              wallet.publicKey.toString(),
              String(Math.floor(BETS[betSelection] * LAMPORTS_PER_SOL)),
              String(WAGERS[wagerSelection]),
              operator
            ))
          )
        );

        if (Object.keys(selectQuestIx).length > 0) {
          try {
            var selectQuestTx = Transaction.populate(
              new Message(selectQuestIx.message)
            );
            const recentBlockhash = (
              await connection.getRecentBlockhash("finalized")
            ).blockhash;
            selectQuestTx.recentBlockhash = recentBlockhash;

            setOpenMessage("Please Approve Transaction.");
            setOpen(true);

            selectQuestTx.signatures = (
              await wallet.signTransaction(selectQuestTx)
            ).signatures;

            const signature = await connection.sendRawTransaction(
              selectQuestTx.serialize()
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
            alert(e);
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
    },
    [wallet, activeStep, setActiveStep, wagerSelection, betSelection]
  );

  let body;
  switch (activeStep) {
    case 0: {
      body = (
        <Box>
          <Grid container>
            <Grid
              item
              sm={3}
              xs={12}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            ></Grid>
          </Grid>
          <Wager onCTA={onCTA} />
        </Box>
      );
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

  const handleAction = useCallback((_, val) => {
    switch (val) {
      case "new": {
        setActiveStep(0);
        break;
      }
      case "withdraw": {
        onDrain();
        break;
      }
      case "dailyStats": {
        setActiveStep(3);
        break;
      }
    }
  }, []);

  return (
    <>
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
      <Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Tabs
            sx={{
              "& .MuiTab-textColorPrimary": {
                color: "unset !important",
              },
              overflow: "auto !important",
            }}
            variant="scrollable"
            value={""}
            onChange={handleAction}
            textColor="primary"
            indicatorColor="primary"
          >
            <Tab value="dailyStats" label="Daily Stats" />
            <Tab value="new" label="Start New Flip" />
          </Tabs>
        </Box>
        {body}
        {activeStep !== 3 && (
          <Grid container>
            <Grid
              item
              sm={6}
              xs={12}
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <BalanceManagement />
            </Grid>
          </Grid>
        )}
      </Box>
    </>
  );
};

export default Flipper;
