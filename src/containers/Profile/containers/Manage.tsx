import axios from "axios";
import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
} from "@mui/material";
import { useEffect } from "react";
import { useRecoilState } from "recoil";
import { userDataAtom, spaceDataAtom } from "../state/atoms";
import { useWallet } from "@solana/wallet-adapter-react";
import { StyledCardSecondary } from "src/components/cards/card";

export const Manage = () => {
  const [userData] = useRecoilState(userDataAtom);

  return (
    <Box>
      {userData !== null && (
        <Box
          style={{
            display: "flex",
            width: "100%",
            justifyContent: "center",
          }}
        >
          <Button variant="outlined">
            <Typography color="#94F3E4" fontSize={18} variant="h5">
              Revoke Twitter
            </Typography>
          </Button>
        </Box>
      )}
    </Box>
  );
};
