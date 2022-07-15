import XQuestingPage from "../src/pages/xquesting";
import {CreateTheme} from "../src/utils/theme/theme";
import {ThemeProvider} from "@mui/material/styles";
import {
    useQuestingWasm,
} from "../src/utils/wasm_loader_hooks";

const XQuesting = () => {
    const theme = CreateTheme();
    const questing = useQuestingWasm();

    return (
        <ThemeProvider theme={theme}>
            {questing === "ready" && <XQuestingPage />}
        </ThemeProvider>
    );
};

export default XQuesting;
