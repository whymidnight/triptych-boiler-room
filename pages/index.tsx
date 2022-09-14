import { CreateTheme } from "../src/utils/theme/theme";
import { ThemeProvider } from "@mui/material/styles";
import { Navbar } from "../src/components/navbar/navbar";

const Casino = () => {
  const theme = CreateTheme();

  return (
    <ThemeProvider theme={theme}>
      <Navbar />
      <div className="xquestingbg"></div>
    </ThemeProvider>
  );
};

export default Casino;

