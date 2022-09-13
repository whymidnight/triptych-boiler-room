import ProfilePage from "../src/pages/profile";
import { CreateTheme } from "../src/utils/theme/theme";
import { ThemeProvider } from "@mui/material/styles";
import {
  useFlipperWasm,
  useEscrowWasm,
  useBlackjackWasm,
} from "../src/utils/wasm_loader_hooks";

const Casino = () => {
  const theme = CreateTheme();
  const flipper = useFlipperWasm();
  const blackjack = useBlackjackWasm();
  const escrow = useEscrowWasm();

  return (
    <ThemeProvider theme={theme}>
      {flipper === "ready" && flipper == blackjack && flipper === escrow && (
        <ProfilePage />
      )}
    </ThemeProvider>
  );
};

export default Casino;

