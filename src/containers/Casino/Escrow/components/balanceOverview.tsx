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
} from "@mui/material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { escrowBalanceAtom, walletBalanceAtom } from "../state/atoms";
import { useRecoilState } from "recoil";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";

declare function get_escrow(holder: String): Promise<any>;

export const CONNECTION = "https://ssc-dao.genesysgo.net";

export const BalanceOverview = () => {
  const wallet = useWallet();
  const [walletBalance, setWalletBalance] = useRecoilState(walletBalanceAtom);
  const connection = useMemo(() => new Connection(CONNECTION), []);

  return (
    <>
      <WalletBalance />
      <EscrowBalance />
    </>
  );
};

export const WalletBalance = () => {
  const wallet = useWallet();
  const connection = useMemo(() => new Connection(CONNECTION), []);
  const [walletBalance, setWalletBalance] = useRecoilState(walletBalanceAtom);

  useEffect(() => {
    async function getBalance() {
      if (!wallet.publicKey) {
        return;
      }
      const nativeBalance = await connection.getBalance(wallet.publicKey);
      setWalletBalance(nativeBalance / LAMPORTS_PER_SOL);
    }
    getBalance();
  }, [wallet]);

  return (
    <StyledCard>
      <Typography gutterBottom variant="h5" component="div">
        Wallet:
        <Typography gutterBottom variant="h5" component="div">
          {walletBalance.toFixed(4)} SOL
        </Typography>
      </Typography>
    </StyledCard>
  );
};

export const EscrowBalance = () => {
  const wallet = useWallet();
  const [escrowBalance, setEscrowBalance] = useRecoilState(escrowBalanceAtom);

  useEffect(() => {
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
        setEscrowBalance(escrowMetadata.AvailableBalance / LAMPORTS_PER_SOL);
      }
    }
    getEscrow();
  }, [wallet]);

  return (
    <StyledCard>
      <Typography gutterBottom variant="h5" component="div">
        Escrow:
        <Typography gutterBottom variant="h5" component="div">
          {escrowBalance.toFixed(4)} SOL
        </Typography>
      </Typography>
    </StyledCard>
  );
};

export default BalanceOverview;
