import FaucetPage from "../src/pages/faucet";
import { CreateTheme } from "../src/utils/theme/theme";
import { ThemeProvider } from "@mui/material/styles";

const Casino = () => {
  const theme = CreateTheme();

  return (
    <ThemeProvider theme={theme}>
      <FaucetPage />
    </ThemeProvider>
  );
};

export default Casino;
