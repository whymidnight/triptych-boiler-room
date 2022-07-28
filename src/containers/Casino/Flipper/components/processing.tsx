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
import { flipTransactionSignatureAtom } from "../state/atoms";
import { useRecoilState } from "recoil";

export const Processing = () => {
  const [flipTransactionSignature, setFlipTransactionSignature] =
    useRecoilState(flipTransactionSignatureAtom);
  return (
    <Grid
      container
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box>
        <StyledCard className="swap-container">
          <StyledCard>
            <Stack justifyContent="center" alignContent="center">
              <br />
              <div style={{ display: "flex", justifyContent: "center" }}>
                <CircularProgress />
              </div>
              <br />
              <br />
              <Typography gutterBottom variant="h5" component="div">
                Please wait for Solana to finalize the transaction.
              </Typography>
              <Typography gutterBottom variant="h5" component="div">
                Signature:{" "}
                {String(
                  flipTransactionSignature.slice(0, 4) +
                    "..." +
                    flipTransactionSignature.slice(
                      flipTransactionSignature.length - 4,
                      flipTransactionSignature.length
                    )
                )}
              </Typography>
            </Stack>
          </StyledCard>
        </StyledCard>
      </Box>
    </Grid>
  );
};

export default Processing;
