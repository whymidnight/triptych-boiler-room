import Tabs from "@mui/material/Tabs";
import Image from "next/image";
import Tab from "@mui/material/Tab";
import { windowOpenPromise } from "@vangware/window-open-promise";
import { makeStyles } from "@mui/styles";
import {
  Box,
  Grid,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
} from "@mui/material";
import { StyledCard } from "src/components/cards";
import { useMemo, useState, useEffect, useCallback, forwardRef } from "react";
import { Connection, PublicKey } from "@solana/web3.js";
import { useWallet } from "@solana/wallet-adapter-react";
import FormControl from "@mui/material/FormControl";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import { Transaction, Message } from "@solana/web3.js";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import axios from "axios";
import { useRecoilState } from "recoil";
import { userDataAtom } from "./state/atoms";
import { Manage } from "./containers/Manage";
import { Participants } from "./containers/participants";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";

interface UserData {
  id: string;
  name: string;
  username: string;
}

const Alert = forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

// @ts-ignore
export const Giveaways = ({
  view,
  tweetIdSlug,
}: {
  view: string;
  tweetIdSlug?: string;
}) => {
  const wallet = useWallet();

  const [open, setOpen] = useState(false);
  const [auth, setAuth] = useState(false);
  const [userData, setUserData] = useRecoilState(userDataAtom);

  const [alertMessage, setAlertMessage] = useState("");
  const [listView, setListView] = useState(true);
  const [tab, setTab] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    console.log(newValue);
    setTab(newValue);
  };

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const onVerify = useCallback(() => {
    if (!wallet.publicKey) return;

    async function auth() {
      const auth = await axios("https://triptychlabs.io:43594/twitter", {
        method: "POST",
        data: {
          method: "authenticate",
          body: {
            publicKey: wallet.publicKey.toString(),
          },
        },
      });

      console.log(auth.data.message);
      setAuth(auth.data.message.valid);
      if (auth.data.message.userData !== null)
        setUserData(auth.data.message.userData.data);
    }
    async function verify() {
      const message = "hello world";
      const signed = await wallet.signMessage(Buffer.from(message));

      const verification = await axios(
        "https://triptychlabs.io:43594/twitter/verify",
        {
          headers: {
            PublicKey: wallet.publicKey.toString(),
            OriginalMessage: message,
          },
          method: "POST",
          data: {
            [message]: Buffer.from(signed).toString("hex"),
          },
        }
      );

      const win = window.open(
        verification.data.message.redirectTo,
        "Authenticate with Twitter",
        "width=400,height=800"
      );
      const timer = setInterval(async () => {
        try {
          if (win.closed) {
            clearInterval(timer);
            await auth();
          }
        } catch (_) {
          clearInterval(timer);
        }
      }, 500);
    }

    verify();
  }, [wallet]);

  useEffect(() => {
    if (!wallet.publicKey) return;

    async function auth() {
      const auth = await axios("https://triptychlabs.io:43594/twitter", {
        method: "POST",
        data: {
          method: "authenticate",
          body: {
            publicKey: wallet.publicKey.toString(),
          },
        },
      });

      console.log(auth.data.message);
      setAuth(auth.data.message.valid);
      if (auth.data.message.userData !== null)
        setUserData(auth.data.message.userData.data);
    }

    auth();
  }, [wallet]);

  return (
    <Grid
      container
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Snackbar
        open={open}
        autoHideDuration={2500}
        onClose={handleClose}
        sx={{ zIndex: 100000000 }}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          {alertMessage}
        </Alert>
      </Snackbar>
      <Box style={{ padding: "1rem" }}>
        <Box
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Typography
            color="#94F3E4"
            fontSize={24}
            variant="h5"
            component="div"
          >
            Triptych Giveaways
          </Typography>
        </Box>
        {!auth && (
          <StyledCard
            style={{ display: "flex", justifyContent: "center" }}
            className="giveaways-container"
          >
            <Box
              style={{
                display: "flex",
                flex: 1,
                flexDirection: "row",
                padding: "1rem",
                justifyContent: "center",
              }}
            >
              {!wallet.connected && (
                <Box
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    color="#94F3E4"
                    fontSize={18}
                    variant="h5"
                    component="div"
                  >
                    Connect Wallet!
                  </Typography>
                  <WalletMultiButton />
                </Box>
              )}
              {wallet.connected && (
                <Box
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Button onClick={onVerify}>
                    <Typography
                      color="#94F3E4"
                      fontSize={18}
                      variant="h5"
                      component="div"
                    >
                      Connect Twitter
                    </Typography>
                  </Button>
                  {view === "participants" && (
                    <Participants
                      tweetId={tweetIdSlug!}
                      setAlertMessage={setAlertMessage}
                      setOpen={setOpen}
                    />
                  )}
                </Box>
              )}
            </Box>
          </StyledCard>
        )}
        {auth && (
          <Box>
            <Box>
              <Box
                style={{
                  display: "flex",
                  flex: 1,
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <StyledCard className="giveaways-container">
                  <Box
                    style={{
                      paddingLeft: "1rem",
                      paddingRight: "1rem",
                      paddingBottom: "1rem",
                    }}
                  >
                    {view === "landing" && (
                      <Box
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          justifyContent: "space-around",
                          alignItems: "center",
                          paddingBottom: "2rem",
                        }}
                      >
                        <Box
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Box
                            component="img"
                            src={"/tripmac.gif"}
                            style={{
                              height: 64,
                              width: 64,
                              justifyContent: "center",
                            }}
                            alt="pfp"
                          />
                        </Box>
                        <Tabs value={tab} onChange={handleTabChange}>
                          <Tab label="Create" value={0} />
                          <Tab label="Active" value={1} />
                          <Tab label="History" value={2} />
                        </Tabs>
                      </Box>
                    )}
                    <Box
                      style={{
                        display: "flex",
                        width: "100%",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        color="white"
                        fontSize={18}
                        variant="h5"
                        component="div"
                      >
                        Welcome {userData && userData.name}!
                      </Typography>
                      <Box
                        style={{
                          borderRadius: "50%",
                          overflow: "hidden",
                          height: 48,
                          width: 48,
                        }}
                      >
                        <Box
                          component="img"
                          src={
                            userData
                              ? userData.profile_image_url
                              : process.env.NEXT_PUBLIC_LOGO_FILE!
                          }
                          style={{
                            height: 48,
                            width: 48,
                          }}
                          alt="pfp"
                        />
                      </Box>
                    </Box>
                    {view === "landing" && (
                      <Manage
                        tab={tab}
                        setAlertMessage={setAlertMessage}
                        setOpen={setOpen}
                      />
                    )}
                    {view === "participants" && (
                      <Participants
                        tweetId={tweetIdSlug!}
                        setAlertMessage={setAlertMessage}
                        setOpen={setOpen}
                      />
                    )}
                  </Box>
                </StyledCard>
              </Box>
            </Box>
          </Box>
        )}
      </Box>
    </Grid>
  );
};

export default Giveaways;
