import { FC, useState, useCallback } from "react";
import { Box } from "@mui/material";
import Flipper from "src/containers/Casino/Flipper";
import GameScreen from "src/containers/Casino/Blackjack/GameScreen";
import store from "src/containers/Casino/Blackjack/store/store";
import { Provider } from "react-redux";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { StyledCard } from "src/components/cards";
import { Grid } from "@mui/material";
import BalanceOverview from "src/containers/Casino/Escrow/components/balanceOverview";
import BalanceManagement from "src/containers/Casino/Escrow/components/balanceManagement";

export const Casino: FC = () => {
  const TABS = ["coinFlip", "blackjack"];
  const [tab, setTab] = useState(TABS[0]);
  // const [body, setBody] = useState<null | any>(null);
  let body = null;
  switch (tab) {
    case TABS[0]: {
      body = <Flipper />;
      break;
    }
    case TABS[1]: {
      body = <GameScreen username={""} />;
      break;
    }
  }

  const handleTabChange = useCallback((_, val) => {
    switch (val) {
      case TABS[0]: {
        setTab(TABS[0]);
        break;
      }
      case TABS[1]: {
        setTab(TABS[1]);
        break;
      }
    }
  }, []);
  return (
    <Box
      className="flippening-box"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <StyledCard>
        <Grid container>
          <Grid
            item
            sm={3}
            xs={12}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
            }}
          >
            <StyledCard>
              <Tabs
                scrollButtons={false}
                sx={{
                  color: "unset !important",
                  overflow: "auto !important",
                }}
                onChange={handleTabChange}
                variant="scrollable"
                value={tab}
                // onChange={handleAction}
                textColor="primary"
                indicatorColor="primary"
              >
                <Tab value="coinFlip" label="Coin Flip" />
                <Tab value="blackjack" label="Blackjack" />
              </Tabs>
            </StyledCard>
          </Grid>
          <Grid
            item
            sm={6}
            xs={12}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <BalanceOverview />
          </Grid>
          <Grid
            item
            sm={3}
            xs={12}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <BalanceManagement />
          </Grid>
        </Grid>
        <Provider store={store}>
          <Box>{body}</Box>
        </Provider>
      </StyledCard>
    </Box>
  );
};

export default Casino;

