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
import {
  WalletBalance,
  EscrowBalance,
} from "../../Escrow/components/balanceOverview";

export const Wager = ({ onCTA }) => {
  const OPERATORS = ["wallet", "escrow"];

  const [operator, setOperator] = useState(OPERATORS[0]);
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

  const handleOperator = (_, val) => {
    setOperator(val);
  };

  return (
    <>
      <Box
        sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}
      >
        <StyledCard>
          <Stack>
            <Box style={{ paddingTop: "5%" }}>
              <Button onClick={() => onCTA(operator)}>
                <Typography
                  color="#94F3E4"
                  fontSize={24}
                  variant="h5"
                  component="div"
                >
                  Double
                </Typography>
              </Button>
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Tabs
                variant="fullWidth"
                value={operator}
                onChange={handleOperator}
                textColor="primary"
                indicatorColor="secondary"
              >
                <Tab value={OPERATORS[0]} label={<WalletBalance />} />
                <Tab value={OPERATORS[1]} label={<EscrowBalance />} />
              </Tabs>
            </Box>
          </Stack>
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
                {Object.keys(BETS).map((index) => (
                  <Tabs
                    value={betSelection}
                    onChange={handleBetSelection}
                    textColor="primary"
                    indicatorColor="secondary"
                  >
                    <Tab value={index} label={BETS[index] + " " + "SOL"} />
                  </Tabs>
                ))}
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
                  variant="scrollable"
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
