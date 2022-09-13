import { useRouter } from "next/router";
import ParticipantsPage from "../../src/pages/participants";
import { CreateTheme } from "../../src/utils/theme/theme";
import { ThemeProvider } from "@mui/material/styles";

const Casino = () => {
  const theme = CreateTheme();
  const router = useRouter();
  const { tweetId } = router.query;
  console.log(tweetId);

  return (
    <ThemeProvider theme={theme}>
      {tweetId !== undefined && <ParticipantsPage tweetId={String(tweetId)} />}
    </ThemeProvider>
  );
};

export default Casino;

