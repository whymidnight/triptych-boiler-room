import { useRouter } from "next/router";
import { useMemo } from "react";
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
import Link from "next/link";

export const TimedButton = ({
  endTime,
  variant,
  onClick,
  children,
}: {
  endTime: number;
  variant?: "text" | "outlined" | "contained";
  onClick: any;
  children: any;
}) => {
  const [enabled, setEnabled] = useState(false);
  const now = useMemo(() => dayjs().unix(), []);

  useEffect(() => {
    console.log("......", endTime - now);
    if (endTime - now < 0) {
      setEnabled(true);
      return;
    }

    setTimeout(() => {
      console.log("slepii");
      setEnabled(true);
    }, (endTime - now) * 1000);
  }, []);

  return (
    <Button variant={variant} onClick={onClick} disabled={!enabled}>
      {children}
    </Button>
  );
};

export const Manage = ({
  tab,
  setAlertMessage,
  setOpen,
}: {
  tab: number;
  setAlertMessage: any;
  setOpen: any;
}) => {
  const router = useRouter();

  const [userData] = useRecoilState(userDataAtom);
  const [giveawaysData, setGiveawaysData] = useState([]);

  const [tweetUrl, setTweetUrl] = useState("");
  const [tweetId, setTweetId] = useState("");
  const [validTweet, setValidTweet] = useState(false);
  const [value, setValue] = useState<Dayjs | null>(dayjs());

  const handleChange = (newValue: Dayjs | null) => {
    setValue(newValue);
  };

  const tweetValidate = useCallback((event) => {
    //@ts-ignore
    const url = event.target.value;
    setTweetUrl(url);

    const urlSplit = url.split("/");
    console.log("....", url, urlSplit.length);
    if (urlSplit.length === 6) {
      setValidTweet(true);
      setTweetId(urlSplit[5].split("?")[0]);
    }
  }, []);

  const wallet = useWallet();

  const onChooseWinner = useCallback(
    (TweetId) => {
      if (!wallet.publicKey) return;
      async function manageFn() {
        const message = "overview";

        const signed = await wallet.signMessage(Buffer.from(message));

        const manage = await axios("https://triptychlabs.io:43594/giveaways", {
          headers: {
            OriginalMessage: message,
          },
          method: "POST",
          data: {
            method: "overview",
            body: {
              publicKey: wallet.publicKey.toString(),
              [message]: Buffer.from(signed).toString("hex"),
            },
          },
        });

        console.log(manage.data.message);
        setGiveawaysData(manage.data.message.giveaways);
      }

      async function rollInvoke() {
        const message = "rollInvoke";
        const signed = await wallet.signMessage(Buffer.from(message));

        const invoke = await axios("https://triptychlabs.io:43594/giveaways", {
          headers: {
            OriginalMessage: message,
          },
          method: "POST",
          data: {
            method: "rollInvoke",
            body: {
              publicKey: wallet.publicKey.toString(),
              [message]: Buffer.from(signed).toString("hex"),
              tweetId: TweetId,
            },
          },
        });

        const transactionObj = invoke.data.message.transaction;
        let transaction = Transaction.populate(
          new Message(transactionObj.message),
          transactionObj.signatures
        );
        transaction = await wallet.signTransaction(transaction);

        const txPayload = JSON.stringify(
          {
            message: transaction.compileMessage(),
            signatures: transaction.signatures.map((signature) =>
              bs58.encode(signature.signature).toString()
            ),
          },
          null,
          2
        );

        const start = await axios("https://triptychlabs.io:43594/giveaways", {
          headers: {
            OriginalMessage: message,
          },
          method: "POST",
          data: {
            method: "rollStart",
            body: {
              publicKey: wallet.publicKey.toString(),
              [message]: Buffer.from(signed).toString("hex"),
              tweetId: TweetId,
              tx: txPayload,
            },
          },
        });

        // await signature

        setOpen(true);
        setAlertMessage("Transaction may take up to 2 minutes to finalize!");

        const connection = new Connection("https://devnet.genesysgo.net");
        await awaitTransactionSignatureConfirmation(
          start.data.message.signature,
          connection,
          true
        );

        // confirm signature with backend
        const confirm = await axios("https://triptychlabs.io:43594/giveaways", {
          headers: {
            OriginalMessage: message,
          },
          method: "POST",
          data: {
            method: "rollConfirm",
            body: {
              publicKey: wallet.publicKey.toString(),
              [message]: Buffer.from(signed).toString("hex"),
              tweetId: TweetId,
            },
          },
        });
        setOpen(true);
        setAlertMessage("Winner Chosen!");

        await manageFn();
      }
      rollInvoke();
    },
    [value]
  );

  const onCreate = useCallback(() => {
    if (tweetId === "") return;
    if (!wallet.publicKey) return;
    async function manageFn() {
      const message = "overview";

      const signed = await wallet.signMessage(Buffer.from(message));

      const manage = await axios("https://triptychlabs.io:43594/giveaways", {
        headers: {
          OriginalMessage: message,
        },
        method: "POST",
        data: {
          method: "overview",
          body: {
            publicKey: wallet.publicKey.toString(),
            [message]: Buffer.from(signed).toString("hex"),
          },
        },
      });

      console.log(manage.data.message);
      setGiveawaysData(manage.data.message.giveaways);
    }

    async function create() {
      const epoch = value!.unix();
      const message = "create";
      const signed = await wallet.signMessage(Buffer.from(message));

      setOpen(true);
      setAlertMessage("Creating Giveaway !");
      const manage = await axios("https://triptychlabs.io:43594/giveaways", {
        headers: {
          OriginalMessage: message,
        },
        method: "POST",
        data: {
          method: "create",
          body: {
            publicKey: wallet.publicKey.toString(),
            [message]: Buffer.from(signed).toString("hex"),
            tweetId,
            epoch,
          },
        },
      });
      console.log(manage.data);
      setOpen(true);
      setAlertMessage("Giveaway Created!");

      // setTweetId("");
      setTweetUrl("");
      setValidTweet(false);

      // await manageFn();
      router.push(String("/giveaways/" + tweetId));
    }
    create();
  }, [tweetId, value]);

  useEffect(() => {
    if (!wallet.publicKey) return;

    async function manageFn() {
      const message = "overview";
      const signed = await wallet.signMessage(Buffer.from(message));

      const manage = await axios("https://triptychlabs.io:43594/giveaways", {
        headers: {
          OriginalMessage: message,
        },
        method: "POST",
        data: {
          method: "overview",
          body: {
            publicKey: wallet.publicKey.toString(),
            [message]: Buffer.from(signed).toString("hex"),
          },
        },
      });

      console.log(manage.data.message);
      setGiveawaysData(manage.data.message.giveaways);
    }

    manageFn();
  }, []);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      {tab === 0 && userData !== null && (
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
            <Box
              component="form"
              style={{
                padding: "1rem",
                display: "flex",
                justifyContent: "center",
                width: "100%",
              }}
            >
              <TextField
                sx={{
                  input: {
                    color: "#94F3E4",
                  },
                }}
                style={{
                  width: "60%",
                  textAlign: "center",
                }}
                label="Enter Link to Tweet"
                variant="outlined"
                value={tweetUrl}
                onChange={tweetValidate}
              />
              <DateTimePicker
                label="End Time"
                value={value}
                onChange={handleChange}
                renderInput={(params) => (
                  <TextField
                    style={{
                      width: "40%",
                    }}
                    sx={{
                      input: {
                        color: "#94F3E4",
                      },
                    }}
                    {...params}
                  />
                )}
              />
            </Box>
            {tweetId !== "" && validTweet && (
              <TwitterTweetEmbed
                tweetId={tweetId}
                options={{
                  theme: "dark",
                  height: 200,
                  width: 500,
                  align: "center",
                }}
              />
            )}
            <Box
              style={{
                display: "flex",
                justifyContent: "center",
                paddingTop: "1rem",
                paddingBottom: "1rem",
              }}
            >
              <Button
                disabled={!validTweet}
                onClick={onCreate}
                variant="outlined"
              >
                <Typography color="#94F3E4" fontSize={18} variant="h6">
                  Start Giveaway
                </Typography>
              </Button>
            </Box>
          </Box>
        </Box>
      )}
      {tab === 1 && giveawaysData.length > 0 && (
        <Box
          sx={{
            padding: "1rem",
            borderRadius: "25px",
            backgroundColor: "#1A1A1B",
          }}
        >
          <Typography
            color="#94F3E4"
            fontSize={18}
            variant="h5"
            component="div"
            style={{
              margin: "0.5rem",
            }}
          >
            Active Giveaways
          </Typography>

          {giveawaysData
            .filter(
              ({ EndTime, Hash }) => EndTime > dayjs().unix() || Hash === ""
            )
            .reverse()
            .map(({ TweetId, StartTime, EndTime, Participants, Winner }) => {
              return (
                <Box
                  style={{
                    padding: "0.5rem",
                    margin: "1rem",
                    borderRadius: "10px",
                    backgroundColor: "#333F44",
                  }}
                >
                  {Winner[0] !== "" && (
                    <StyledCard>
                      <Box
                        style={{
                          display: "flex",
                          justifyContent: "space-evenly",
                          alignItems: "flex-start",
                          margin: "0.5rem",
                        }}
                      >
                        <Box
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "top",
                            width: "50%",
                            margin: "1rem",
                          }}
                        >
                          <Typography
                            color="#94F3E4"
                            fontSize={18}
                            variant="h6"
                            textAlign="center"
                          >
                            Username:{" "}
                            <Divider
                              orientation="horizontal"
                              flexItem
                              sx={{ bgcolor: "#37AA9C" }}
                            />
                            <Typography
                              style={{ paddingTop: "1rem" }}
                              color="#94F3E4"
                              fontSize={18}
                              variant="h6"
                            >
                              @{Winner[0]}
                            </Typography>
                          </Typography>
                        </Box>
                        <Divider
                          flexItem
                          orientation="vertical"
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
                            Winner
                          </Typography>
                        </Divider>
                        <Box
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "top",
                            width: "50%",
                            margin: "1rem",
                          }}
                        >
                          <Typography
                            color="#94F3E4"
                            fontSize={18}
                            variant="h6"
                            textAlign="center"
                          >
                            Wallet Address:
                            <Divider
                              orientation="horizontal"
                              flexItem
                              sx={{ bgcolor: "#37AA9C" }}
                            />
                            <Box style={{ paddingTop: "1rem" }}>
                              <Button
                                variant="outlined"
                                onClick={() => {
                                  setOpen(true);
                                  setAlertMessage(
                                    String(
                                      "Copied" +
                                        " " +
                                        "@" +
                                        Winner[0] +
                                        " " +
                                        "Wallet Address!"
                                    )
                                  );
                                  navigator.clipboard.writeText(Winner[1]);
                                }}
                              >
                                <Typography
                                  color="#94F3E4"
                                  fontSize={14}
                                  variant="h5"
                                  textAlign="center"
                                >
                                  Click to Copy
                                </Typography>
                              </Button>
                            </Box>
                          </Typography>
                        </Box>
                      </Box>
                    </StyledCard>
                  )}
                  <TwitterTweetEmbed
                    tweetId={TweetId}
                    options={{
                      theme: "dark",
                      height: 200,
                      width: 500,
                      align: "center",
                    }}
                  />
                  <StyledCard>
                    <Box
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        margin: "0.5rem",
                      }}
                    >
                      <Box
                        style={{
                          display: "flex",
                          alignItems: "top",
                          margin: "1rem",
                        }}
                      >
                        <Typography
                          color="#94F3E4"
                          fontSize={18}
                          variant="h6"
                          textAlign="center"
                        >
                          Started At:{" "}
                          <Divider
                            orientation="horizontal"
                            flexItem
                            sx={{ bgcolor: "#37AA9C" }}
                          />
                          <Typography
                            style={{ paddingTop: "1rem" }}
                            color="#94F3E4"
                            fontSize={18}
                            variant="h6"
                          >
                            {dayjs.unix(StartTime).format("llll")}
                          </Typography>
                        </Typography>
                      </Box>
                      <Divider
                        sx={{ bgcolor: "#37AA9C" }}
                        orientation="vertical"
                        flexItem
                      />
                      <Box style={{ margin: "1rem" }}>
                        <Typography
                          color="#94F3E4"
                          fontSize={18}
                          variant="h6"
                          textAlign="center"
                        >
                          Participants:
                          <Divider
                            orientation="horizontal"
                            flexItem
                            sx={{ bgcolor: "#37AA9C" }}
                          />
                          <Typography
                            style={{ paddingTop: "1rem" }}
                            color="#94F3E4"
                            fontSize={18}
                            variant="h6"
                          >
                            {Participants}
                          </Typography>
                        </Typography>
                        {Winner[0] !== "" && (
                          <Box style={{ paddingTop: "2rem" }}>
                            <Button
                              variant="outlined"
                              onClick={() => {
                                router.push(String("/giveaways/" + TweetId));
                              }}
                            >
                              <Link href={String("/giveaways/" + TweetId)}>
                                <Typography
                                  color="#94F3E4"
                                  fontSize={18}
                                  variant="h6"
                                >
                                  View Participants
                                </Typography>
                              </Link>
                            </Button>
                          </Box>
                        )}
                        {Winner[0] === "" && (
                          <Box style={{ paddingTop: "2rem" }}>
                            <TimedButton
                              endTime={EndTime}
                              onClick={() => onChooseWinner(TweetId)}
                              variant="outlined"
                            >
                              <Typography
                                color="#94F3E4"
                                fontSize={18}
                                variant="h6"
                              >
                                Choose Winner
                              </Typography>
                            </TimedButton>
                          </Box>
                        )}
                      </Box>
                      <Divider
                        sx={{ bgcolor: "#37AA9C" }}
                        orientation="vertical"
                        flexItem
                      />
                      <Box style={{ margin: "1rem" }}>
                        <Typography
                          color="#94F3E4"
                          fontSize={18}
                          variant="h6"
                          textAlign="center"
                        >
                          Ends At:{" "}
                          <Divider
                            orientation="horizontal"
                            flexItem
                            sx={{ bgcolor: "#37AA9C" }}
                          />
                          <Typography
                            style={{ paddingTop: "1rem" }}
                            color="#94F3E4"
                            fontSize={18}
                            variant="h6"
                          >
                            {dayjs.unix(EndTime).format("llll")}
                          </Typography>
                        </Typography>
                      </Box>
                    </Box>
                  </StyledCard>
                </Box>
              );
            })}
        </Box>
      )}
      {tab === 2 && giveawaysData.length > 0 && (
        <Box
          sx={{
            padding: "1rem",
            borderRadius: "25px",
            backgroundColor: "#1A1A1B",
          }}
        >
          <Typography
            color="#94F3E4"
            fontSize={18}
            variant="h5"
            component="div"
            style={{
              margin: "0.5rem",
            }}
          >
            Historical Giveaways
          </Typography>

          {giveawaysData
            .filter(
              ({ EndTime, Hash }) => EndTime < dayjs().unix() && Hash !== ""
            )
            .reverse()
            .map(({ TweetId, StartTime, EndTime, Participants, Winner }) => {
              return (
                <Box
                  style={{
                    padding: "0.5rem",
                    margin: "1rem",
                    borderRadius: "10px",
                    backgroundColor: "#333F44",
                  }}
                >
                  {Winner[0] !== "" && (
                    <StyledCard>
                      <Box
                        style={{
                          display: "flex",
                          justifyContent: "space-evenly",
                          alignItems: "flex-start",
                          margin: "0.5rem",
                        }}
                      >
                        <Box
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "top",
                            width: "50%",
                            margin: "1rem",
                          }}
                        >
                          <Typography
                            color="#94F3E4"
                            fontSize={18}
                            variant="h6"
                            textAlign="center"
                          >
                            Username:{" "}
                            <Divider
                              orientation="horizontal"
                              flexItem
                              sx={{ bgcolor: "#37AA9C" }}
                            />
                            <Typography
                              style={{ paddingTop: "1rem" }}
                              color="#94F3E4"
                              fontSize={18}
                              variant="h6"
                            >
                              @{Winner[0]}
                            </Typography>
                          </Typography>
                        </Box>
                        <Divider
                          flexItem
                          orientation="vertical"
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
                            Winner
                          </Typography>
                        </Divider>
                        <Box
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "top",
                            width: "50%",
                            margin: "1rem",
                          }}
                        >
                          <Typography
                            color="#94F3E4"
                            fontSize={18}
                            variant="h6"
                            textAlign="center"
                          >
                            Wallet Address:
                            <Divider
                              orientation="horizontal"
                              flexItem
                              sx={{ bgcolor: "#37AA9C" }}
                            />
                            <Box style={{ paddingTop: "1rem" }}>
                              <Button
                                variant="outlined"
                                onClick={() => {
                                  setOpen(true);
                                  setAlertMessage(
                                    String(
                                      "Copied" +
                                        " " +
                                        "@" +
                                        Winner[0] +
                                        "'s" +
                                        " " +
                                        "Wallet Address!"
                                    )
                                  );
                                  navigator.clipboard.writeText(Winner[1]);
                                }}
                              >
                                <Typography
                                  color="#94F3E4"
                                  fontSize={14}
                                  variant="h5"
                                  textAlign="center"
                                >
                                  Click to Copy
                                </Typography>
                              </Button>
                            </Box>
                          </Typography>
                        </Box>
                      </Box>
                    </StyledCard>
                  )}
                  <TwitterTweetEmbed
                    tweetId={TweetId}
                    options={{
                      theme: "dark",
                      height: 200,
                      width: 500,
                      align: "center",
                    }}
                  />
                  <StyledCard>
                    <Box
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        margin: "0.5rem",
                      }}
                    >
                      <Box
                        style={{
                          display: "flex",
                          alignItems: "top",
                          margin: "1rem",
                        }}
                      >
                        <Typography
                          color="#94F3E4"
                          fontSize={18}
                          variant="h6"
                          textAlign="center"
                        >
                          Started At:{" "}
                          <Divider
                            orientation="horizontal"
                            flexItem
                            sx={{ bgcolor: "#37AA9C" }}
                          />
                          <Typography
                            style={{ paddingTop: "1rem" }}
                            color="#94F3E4"
                            fontSize={18}
                            variant="h6"
                          >
                            {dayjs.unix(StartTime).format("llll")}
                          </Typography>
                        </Typography>
                      </Box>
                      <Divider
                        sx={{ bgcolor: "#37AA9C" }}
                        orientation="vertical"
                        flexItem
                      />
                      <Box style={{ margin: "1rem" }}>
                        <Typography
                          color="#94F3E4"
                          fontSize={18}
                          variant="h6"
                          textAlign="center"
                        >
                          Participants:
                          <Divider
                            orientation="horizontal"
                            flexItem
                            sx={{ bgcolor: "#37AA9C" }}
                          />
                          <Typography
                            style={{ paddingTop: "1rem" }}
                            color="#94F3E4"
                            fontSize={18}
                            variant="h6"
                          >
                            {Participants}
                          </Typography>
                        </Typography>
                        {Winner[0] !== "" && (
                          <Box style={{ paddingTop: "2rem" }}>
                            <Button
                              variant="outlined"
                              onClick={() => {
                                router.push(String("/giveaways/" + TweetId));
                              }}
                            >
                              <Typography
                                color="#94F3E4"
                                fontSize={18}
                                variant="h6"
                              >
                                View Participants
                              </Typography>
                            </Button>
                          </Box>
                        )}
                        {Winner[0] === "" && (
                          <Box style={{ paddingTop: "2rem" }}>
                            <TimedButton
                              endTime={EndTime}
                              onClick={() => onChooseWinner(TweetId)}
                              variant="outlined"
                            >
                              <Typography
                                color="#94F3E4"
                                fontSize={18}
                                variant="h6"
                              >
                                Choose Winner
                              </Typography>
                            </TimedButton>
                          </Box>
                        )}
                      </Box>
                      <Divider
                        sx={{ bgcolor: "#37AA9C" }}
                        orientation="vertical"
                        flexItem
                      />
                      <Box style={{ margin: "1rem" }}>
                        <Typography
                          color="#94F3E4"
                          fontSize={18}
                          variant="h6"
                          textAlign="center"
                        >
                          Ended At:{" "}
                          <Divider
                            orientation="horizontal"
                            flexItem
                            sx={{ bgcolor: "#37AA9C" }}
                          />
                          <Typography
                            style={{ paddingTop: "1rem" }}
                            color="#94F3E4"
                            fontSize={18}
                            variant="h6"
                          >
                            {dayjs.unix(EndTime).format("llll")}
                          </Typography>
                        </Typography>
                      </Box>
                    </Box>
                  </StyledCard>
                </Box>
              );
            })}
        </Box>
      )}
    </LocalizationProvider>
  );
};
