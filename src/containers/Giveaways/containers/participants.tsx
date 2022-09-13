import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import axios from "axios";
import { TwitterTweetEmbed } from "react-twitter-embed";
import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  Divider,
} from "@mui/material";
import { ChangeEventHandler, useCallback, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { userDataAtom, spaceDataAtom } from "../state/atoms";
import { useWallet } from "@solana/wallet-adapter-react";
import { StyledCard, StyledCardSecondary } from "src/components/cards/card";
import { Input } from "@material-ui/core";
import { Connection, Message, Transaction } from "@solana/web3.js";
import { bs58 } from "@project-serum/anchor/dist/cjs/utils/bytes";
import { awaitTransactionSignatureConfirmation } from "src/utils/solana/transaction";

export const Participants = ({
  tweetId,
  setAlertMessage,
  setOpen,
}: {
  tweetId: string;
  setAlertMessage: any;
  setOpen: any;
}) => {
  const [userData] = useRecoilState(userDataAtom);
  const [giveawaysData, setGiveawaysData] = useState(null);

  useEffect(() => {
    async function manageFn() {
      console.log(tweetId);

      const manage = await axios("https://triptychlabs.io:43594/giveaways", {
        method: "POST",
        data: {
          method: "participants",
          body: {
            tweetId,
          },
        },
      });

      console.log(manage.data.message);
      setGiveawaysData(manage.data.message);
    }

    manageFn();
  }, []);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box style={{}}>
        <Box
          style={{
            paddingTop: "10px",
            display: "flex",
            width: "100%",
            justifyContent: "center",
            flexDirection: "column",
          }}
        >
          <TwitterTweetEmbed
            tweetId={tweetId}
            options={{
              theme: "dark",
              height: 200,
              width: 500,
              align: "center",
            }}
          />
          <Box>
            <StyledCardSecondary
              style={{
                padding: "1rem",
              }}
            >
              {giveawaysData !== null && giveawaysData.giveaway.Winner[0] && (
                <StyledCard
                  style={{
                    padding: "1rem",
                    display: "flex",
                  }}
                >
                  <Box
                    style={{
                      width: "50%",
                    }}
                  >
                    <Divider
                      flexItem
                      orientation="horizontal"
                      sx={{
                        "&::before, &::after": {
                          borderColor: "#37AA9C",
                        },
                      }}
                    >
                      <Button
                        style={{
                          borderRadius: "10px",
                          textTransform: "none",
                        }}
                        disabled={true}
                      >
                        <Typography color="white" variant="h6" fontSize={24}>
                          Winner:
                        </Typography>
                      </Button>
                    </Divider>
                  </Box>
                  <Box
                    style={{
                      width: "50%",
                    }}
                  >
                    <Divider
                      flexItem
                      orientation="horizontal"
                      sx={{
                        "&::before, &::after": {
                          borderColor: "#37AA9C",
                        },
                      }}
                    >
                      <Button
                        variant="outlined"
                        style={{
                          borderRadius: "10px",
                          textTransform: "none",
                        }}
                        onClick={() => {
                          window.open(
                            String(
                              "https://twitter.com/" +
                                giveawaysData.giveaway.Winner[0]
                            ),
                            "_blank"
                          );
                        }}
                      >
                        <Typography color="#94F3E4" variant="h6" fontSize={24}>
                          @{giveawaysData.giveaway.Winner[0]}
                        </Typography>
                      </Button>
                    </Divider>
                  </Box>
                </StyledCard>
              )}
              <Divider
                flexItem
                orientation="horizontal"
                sx={{
                  "&::before, &::after": {
                    borderColor: "#37AA9C",
                  },
                }}
              >
                <Typography
                  color="white"
                  variant="h6"
                  fontSize={24}
                  style={{
                    display: "flex",
                    alignItems: "flex-end",
                    justifyContent: "center",
                  }}
                >
                  Participants
                </Typography>
              </Divider>
              <Box
                style={{
                  overflow: "scroll",
                  height: "200px",
                }}
              >
                <Grid
                  container
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {giveawaysData !== null &&
                    giveawaysData.participants.map(([username, image]) => (
                      <Grid item>
                        <StyledCard>
                          <Button
                            variant="outlined"
                            style={{
                              display: "flex",
                              margin: "0.5rem",
                              alignItems: "flex-end",
                              justifyContent: "center",
                              borderRadius: "10px",
                              textTransform: "none",
                            }}
                            onClick={() => {
                              window.open(
                                String("https://twitter.com/" + username),
                                "_blank"
                              );
                            }}
                          >
                            <Typography
                              color="#94F3E4"
                              variant="h6"
                              fontSize={18}
                            >
                              @{username}
                            </Typography>
                          </Button>
                        </StyledCard>
                      </Grid>
                    ))}
                </Grid>
              </Box>
            </StyledCardSecondary>
          </Box>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};
