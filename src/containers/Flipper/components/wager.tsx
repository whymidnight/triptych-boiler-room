import { StyledCard } from "src/components/cards";
import { useMemo, useState, useEffect, useCallback, forwardRef } from "react";
import {
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
import { useRecoilState } from "recoil";
import { betSelectionAtom, wagerSelectionAtom } from "../state/atoms";
import { BETS } from "../state/constants";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export const Wager = ({ onCTA }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [betSelection, setBetSelection] = useRecoilState(betSelectionAtom);
  const [wagerSelection, setWagerSelection] =
    useRecoilState(wagerSelectionAtom);

  const handleBetSelection = (_, val) => {
    console.log(val);
    setBetSelection(val);
  };

  const handleWager = (_, val) => {
    console.log(val);
    setWagerSelection(val);
  };

  const handleDialogClose = (_) => {
    setDialogOpen(false);
  };

  const handleCTA = () => {
    setDialogOpen(true);
  };

  const handleCTAAgreement = () => {
    setDialogOpen(false);
    onCTA();
  };

  return (
    <>
      <Box
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <StyledCard sx={{ width: "fitContent" }}>
          <Button onClick={() => onCTA()}>
            <Typography fontSize={24} variant="h5" component="div">
              Double or Nothing
            </Typography>
          </Button>
        </StyledCard>
      </Box>
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
              <Typography variant="h5" component="div">
                Place Bet:
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Tabs
                  centered
                  variant="scrollable"
                  value={betSelection}
                  onChange={handleBetSelection}
                  textColor="primary"
                  indicatorColor="secondary"
                >
                  {Object.keys(BETS).map((index) => (
                    <Tab value={index} label={BETS[index] + " " + "SOL"} />
                  ))}
                </Tabs>
              </Box>
            </StyledCard>
            <StyledCard className="swap-card">
              <Typography variant="h5" component="div">
                Wager Against:
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Tabs
                  centered
                  value={wagerSelection}
                  onChange={handleWager}
                  textColor="primary"
                  indicatorColor="secondary"
                >
                  <Tab value="heads" label="Heads" />
                  <Tab value="tails" label="Tails" />
                </Tabs>
              </Box>
            </StyledCard>
          </StyledCard>
        </Box>
      </Grid>
    </>
  );
};

export default Wager;
