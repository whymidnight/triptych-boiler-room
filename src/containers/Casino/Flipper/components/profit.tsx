import { StyledCard } from "src/components/cards";
import { useMemo, useState, useEffect, useCallback, forwardRef } from "react";
import { Connection, LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
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
import { CONNECTION } from "../index";

export const Profit = () => {
  const SEARCH = "---DECISION: ";
  const connection = useMemo(() => new Connection(CONNECTION), []);

  const [flipTransactionSignature, setFlipTransactionSignature] =
    useRecoilState(flipTransactionSignatureAtom);

  const [drain, setDrain] = useState(false);
  const [dailyCreator, setDailyCreator] = useState(false);
  const [decision, setDecision] = useState<null | boolean>(null);

  useEffect(() => {
    async function getTransactionMeta() {
      const txMeta = await connection.getTransaction(flipTransactionSignature);

      const IX_LOG = "Program log: Instruction: ";
      const ogInstruction = txMeta.meta.logMessages.filter((log) =>
        log.includes(IX_LOG)
      )[0];

      console.log(txMeta.meta.logMessages);
      console.log(ogInstruction);

      switch (ogInstruction.split(IX_LOG)[1]) {
        case "InitializeEscrow":
        case "NewFlip": {
          console.log("...");
          const rngLog = txMeta.meta.logMessages.filter((log) =>
            log.includes("RNG: ")
          )[0];
          const decisionLog = txMeta.meta.logMessages.filter((log) =>
            log.includes(SEARCH)
          )[0];
          console.log(rngLog);
          setDecision(JSON.parse(decisionLog.split(SEARCH)[1]));

          const dailyCreatorInvokerKeyword = "initializing";
          const dailyCreatorInvoker = txMeta.meta.logMessages.filter((log) =>
            log.includes(dailyCreatorInvokerKeyword)
          );
          if (dailyCreatorInvoker.length !== 0) {
            setDailyCreator(true);
          }

          break;
        }
        case "DrainEscrow": {
          setDrain(true);
          break;
        }
      }
    }
    getTransactionMeta();
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
          <StyledCard>
            <Stack justifyContent="center" alignContent="center">
              {dailyCreator && (
                <>
                  <br />
                  <Typography gutterBottom variant="h5" component="div">
                    Congrats on the easter egg :).
                  </Typography>
                </>
              )}
              {(() => {
                if (drain) {
                  return (
                    <>
                      <br />
                      <Typography gutterBottom variant="h5" component="div">
                        Congrats on the easter eggular.
                      </Typography>
                    </>
                  );
                }
                switch (decision) {
                  case true: {
                    return (
                      <>
                        <br />
                        <Typography gutterBottom variant="h5" component="div">
                          Congratulations you won.
                        </Typography>
                      </>
                    );
                  }
                  case false: {
                    return (
                      <>
                        <br />
                        <Typography gutterBottom variant="h5" component="div">
                          Congratulations you lost.
                        </Typography>
                      </>
                    );
                  }
                  default: {
                    return null;
                  }
                }
              })()}
            </Stack>
          </StyledCard>
        </StyledCard>
      </Box>
    </Grid>
  );
};

export default Profit;
