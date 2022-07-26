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

import { ORACLE } from "../index";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

declare function get_statistics(oracle: String): Promise<any>;

interface statisticsI {
  Initialized: null | boolean;
  Oracle: String;
  DailyEpoch: Number;
  Heads: number[];
  Tails: number[];
}

export const Stats = () => {
  const [stats, setStats] = useState<null | statisticsI>(null);

  useEffect(() => {
    async function getEscrow() {
      const statistics = JSON.parse(
        String.fromCharCode(
          // @ts-ignore
          ...(await get_statistics(ORACLE.toString()))
        )
      );
      console.log(Object.keys(statistics));
      if (Object.keys(statistics).length > 0) {
        setStats(statistics);
      }
    }
    getEscrow();
  }, []);

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
          <StyledCard className="swap-card">
            {stats === null && (
              <Stack justifyContent="center" alignContent="center">
                <br />
                <div style={{ display: "flex", justifyContent: "center" }}>
                  <CircularProgress />
                </div>
                <br />
                <br />
                <Typography gutterBottom variant="h5" component="div">
                  Fetching Stats.
                </Typography>
              </Stack>
            )}
            <Stack justifyContent="center" alignContent="center">
              <Typography gutterBottom variant="h5" component="div">
                Stats
              </Typography>
            </Stack>
            {stats !== null && (
              <Grid container item>
                <Grid item xs={6}>
                  <StyledCard className="swap-card">
                    <Typography gutterBottom variant="h5" component="div">
                      Number of Flips
                    </Typography>
                    <Typography gutterBottom variant="h5" component="div">
                      {stats.Heads[0] + stats.Tails[0]}
                    </Typography>
                  </StyledCard>
                </Grid>
                <Grid item xs={6}>
                  <StyledCard className="swap-card">
                    <Typography gutterBottom variant="h5" component="div">
                      Total Volume
                    </Typography>
                    <Typography gutterBottom variant="h5" component="div">
                      {(
                        (stats.Heads[1] + stats.Tails[1]) /
                        LAMPORTS_PER_SOL
                      ).toFixed(2)}{" "}
                      SOL
                    </Typography>
                  </StyledCard>
                </Grid>
                <Grid item xs={6}>
                  <StyledCard className="swap-card">
                    <Typography gutterBottom variant="h5" component="div">
                      Number of Heads
                    </Typography>
                    <Typography gutterBottom variant="h5" component="div">
                      {stats.Heads[0]}
                    </Typography>
                  </StyledCard>
                </Grid>
                <Grid item xs={6}>
                  <StyledCard className="swap-card">
                    <Typography gutterBottom variant="h5" component="div">
                      Number of Tails
                    </Typography>
                    <Typography gutterBottom variant="h5" component="div">
                      {stats.Tails[0]}
                    </Typography>
                  </StyledCard>
                </Grid>
                <Grid item xs={6}>
                  <StyledCard className="swap-card">
                    <Typography gutterBottom variant="h5" component="div">
                      Winning Heads
                    </Typography>
                    <Typography gutterBottom variant="h5" component="div">
                      {stats.Heads[2]}
                    </Typography>
                  </StyledCard>
                </Grid>
                <Grid item xs={6}>
                  <StyledCard className="swap-card">
                    <Typography gutterBottom variant="h5" component="div">
                      Winning Tails
                    </Typography>
                    <Typography gutterBottom variant="h5" component="div">
                      {stats.Tails[2]}
                    </Typography>
                  </StyledCard>
                </Grid>
                <Grid item xs={6}>
                  <StyledCard className="swap-card">
                    <Typography gutterBottom variant="h5" component="div">
                      Volume for Heads
                    </Typography>
                    <Typography gutterBottom variant="h5" component="div">
                      {(stats.Heads[1] / LAMPORTS_PER_SOL).toFixed(2)} SOL
                    </Typography>
                  </StyledCard>
                </Grid>
                <Grid item xs={6}>
                  <StyledCard className="swap-card">
                    <Typography gutterBottom variant="h5" component="div">
                      Volume for Tails
                    </Typography>
                    <Typography gutterBottom variant="h5" component="div">
                      {(stats.Tails[1] / LAMPORTS_PER_SOL).toFixed(2)} SOL
                    </Typography>
                  </StyledCard>
                </Grid>
              </Grid>
            )}
          </StyledCard>
        </StyledCard>
      </Box>
    </Grid>
  );
};

export default Stats;
