import ProfilePage from "../src/pages/profile";
import { CreateTheme } from "../src/utils/theme/theme";
import { ThemeProvider } from "@mui/material/styles";

const Casino = () => {
  const theme = CreateTheme();

  return (
    <ThemeProvider theme={theme}>
      <ProfilePage />
    </ThemeProvider>
  );
};

export default Casino;
