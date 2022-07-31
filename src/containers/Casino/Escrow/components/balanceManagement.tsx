import { StyledCard } from "src/components/cards";
import { useMemo, useState, useEffect, useCallback, forwardRef } from "react";
import {
  Stack,
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import {
  escrowBalanceAtom,
  walletBalanceAtom,
  depositTransactionAtom,
} from "../state/atoms";
import { useRecoilState } from "recoil";
import { useWallet } from "@solana/wallet-adapter-react";
import { Transaction, Message } from "@solana/web3.js";
import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { awaitTransactionSignatureConfirmation } from "src/utils/solana/transaction";
import Processing from "./processing";

declare function deposit_escrow(holder: String, amount: String): Promise<any>;
declare function drain_escrow(holder: String, amount: String): Promise<any>;

export const CONNECTION = "https://api.devnet.solana.com";

export const BalanceManagement = () => {
  const wallet = useWallet();
  const [flipTransactionSignature, setFlipTransactionSignature] =
    useRecoilState(depositTransactionAtom);
  const [escrowBalance, setEscrowBalance] = useRecoilState(escrowBalanceAtom);
  const [walletBalance, setWalletBalance] = useRecoilState(walletBalanceAtom);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [transactionInflight, setTransactionInflight] = useState(false);
  const [dialogSubject, setDialogSubject] = useState("");
  const [amount, setAmount] = useState("");

  const connection = useMemo(() => new Connection(CONNECTION), []);

  const onProceed = useCallback(() => {
    async function drainEscrow() {
      const amountFmt = Math.floor(Number(amount) * LAMPORTS_PER_SOL);

      let escrowIx = {};
      switch (dialogSubject) {
        case "Deposit": {
          escrowIx = JSON.parse(
            String.fromCharCode(
              // @ts-ignore
              ...(await deposit_escrow(
                wallet.publicKey.toString(),
                String(amountFmt)
              ))
            )
          );
          break;
        }
        case "Withdraw": {
          escrowIx = JSON.parse(
            String.fromCharCode(
              // @ts-ignore
              ...(await drain_escrow(
                wallet.publicKey.toString(),
                String(amountFmt)
              ))
            )
          );
          break;
        }
      }

      if (Object.keys(escrowIx).length > 0) {
        try {
          const selectQuestTx = Transaction.populate(
            //@ts-ignore
            new Message(escrowIx.message)
          );
          const recentBlockhash = (
            await connection.getRecentBlockhash("finalized")
          ).blockhash;
          selectQuestTx.recentBlockhash = recentBlockhash;

          const signature = await wallet.sendTransaction(
            selectQuestTx,
            connection
          );
          setTransactionInflight(true);
          setFlipTransactionSignature(signature.toString());
          switch (dialogSubject) {
            case "Deposit": {
              setWalletBalance((prev) => prev - Number(amount));
              break;
            }
            case "Withdraw": {
              setEscrowBalance((prev) => prev - Number(amount));
              break;
            }
          }
          console.log(signature);

          await awaitTransactionSignatureConfirmation(
            signature,
            connection,
            true
          );
          switch (dialogSubject) {
            case "Deposit": {
              setEscrowBalance((prev) => prev + Number(amount));
              break;
            }
            case "Withdraw": {
              setWalletBalance((prev) => prev + Number(amount));
              break;
            }
          }
        } catch (e) {
          console.log(e);
        }
        setTransactionInflight(false);
        setDialogOpen(false);
      }
    }

    drainEscrow();
  }, [wallet, amount, dialogSubject]);

  useEffect(() => {}, []);

  const onChange = useCallback(
    (event) => {
      if (event.target.value.match(/^\d{0,}(\.\d{0,4})?$/))
        setAmount(event.target.value);
      if (event.target.value.match(/^\d{1,}(\.\d{0,4})?$/))
        setAmount(event.target.value);
      // setAmount(String(Number(event.target.value)));
    },
    [setAmount]
  );

  let dialogBody = null;
  switch (transactionInflight) {
    case true: {
      dialogBody = <Processing />;
      break;
    }
    case false: {
      dialogBody = (
        <>
          <DialogContent>
            By Proceeding, you agree to play responsibly.
            <TextField
              autoFocus
              value={String(amount)}
              onChange={onChange}
              margin="dense"
              label="Amount"
              variant="standard"
              type="decimal"
              inputProps={{
                inputMode: "decimal",
                step: "0.1",
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">SOL</InputAdornment>
                ),
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={onProceed} autoFocus>
              Proceed
            </Button>
          </DialogActions>
        </>
      );
      break;
    }
  }
  return (
    <>
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        PaperComponent={StyledCard}
      >
        <DialogTitle id="responsive-dialog-title">{dialogSubject}</DialogTitle>
        {dialogBody}
      </Dialog>
      <StyledCard>
        <Button
          onClick={() => {
            setDialogOpen(true);
            setDialogSubject("Deposit");
            setTransactionInflight(false);
            setAmount("");
          }}
        >
          Deposit
        </Button>
        <Button
          onClick={() => {
            setDialogOpen(true);
            setDialogSubject("Withdraw");
            setTransactionInflight(false);
            setAmount("");
          }}
        >
          Withdraw
        </Button>
      </StyledCard>
    </>
  );
};

export default BalanceManagement;
