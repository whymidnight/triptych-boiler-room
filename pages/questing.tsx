import XQuestingPage from "../src/pages/xquesting";
import { CreateTheme } from "../src/utils/theme/theme";
import { ThemeProvider } from "@mui/material/styles";
import { Box } from "@mui/system";

const XQuesting = () => {
  const theme = CreateTheme();

  return (
    <ThemeProvider theme={theme}>
      <Box
        style={{
          display: "flex",
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        Unauthorized!
      </Box>
    </ThemeProvider>
  );
};

export default XQuesting;
