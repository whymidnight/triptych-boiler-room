import HomePage from "../src/pages/home";
import { CreateTheme } from "../src/utils/theme/theme";
import { ThemeProvider } from "@mui/material/styles";
import { Paper } from "@mui/material";

const Index = () => {
  const theme = CreateTheme();
  return (
    <>
      <ThemeProvider theme={theme}>
        <object type="application/x-java-applet" height="503" width="765">
          <param name="code" value="client" />
          <param
            name="archive"
            value="https://cdn.triptychlabs.io:4445/client.jar"
          />
          Applet failed to run. No Java plug-in was found.
        </object>
      </ThemeProvider>
    </>
  );
};

export default Index;
