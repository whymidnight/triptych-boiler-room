import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { StyledCard } from "../../components/cards";
import { Box, Grid } from "@mui/material";
import { useRecoilState } from "recoil";
import {
  showCompletedAtom,
  nftsQuestedAtom,
  nftsSelectionAtom,
  questsSelectionAtom,
} from "./state/atoms";

//@ts-ignore
export const QuestAction = ({ onSelection }) => {
  const [nftsQuested] = useRecoilState(nftsQuestedAtom);
  const [nftsSelection] = useRecoilState(nftsSelectionAtom);
  const [questSelection] = useRecoilState(questsSelectionAtom);
  const [showCompleted] = useRecoilState(showCompletedAtom);

  let buttonText = "";
  switch (showCompleted) {
    case true: {
      buttonText = "Claim Reward(s)";
      break;
    }
    case false: {
      buttonText = "End Quest";
      break;
    }
  }

  return (
    <>
      <StyledCard>
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {
              //@ts-ignore
              questSelection.Name
            }
          </Typography>
          <Typography variant="body2" color="text.secondary">
            For the many rewards you could receive - you will be prompted many
            transactions over time to generate randomness and mint reward(s).
            You may stop at any time to resume claiming your remaining rewards.
          </Typography>
          <CardActions
            style={{
              display: "block",
              textAlign: "center",
              alignItems: "center",
              margin: "auto",
            }}
          >
            <Button
              style={{
                color: "#94F3E4",
              }}
              onClick={(event) => onSelection(event, questSelection)}
              size="small"
            >
              {buttonText}
            </Button>
          </CardActions>
        </CardContent>
      </StyledCard>
      <Grid alignItems="center" container>
        {nftsQuested
          .filter((_, nftIndex) => nftsSelection[nftIndex])
          .map((nft, nftIndex) => (
            <Grid xs={4} key={nftIndex}>
              <Box textAlign="center">
                <StyledCard>
                  <CardMedia
                    component="img"
                    height="140"
                    image={
                      nft.offchainMetadata.hasOwnProperty("image")
                        ? nft.offchainMetadata.image
                        : "https://www.arweave.net/GLeORZQuLxFzDFK0aBQKwhQUUF0-4eawXnrjdtmv5fg?ext=png"
                    }
                    alt="green iguana"
                  />
                  <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                      {nft.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Lizards are a widespread group of squamate reptiles, with
                      over 6,000 species, ranging across all continents except
                      Antarctica
                    </Typography>
                  </CardContent>
                </StyledCard>
              </Box>
            </Grid>
          ))}
      </Grid>
    </>
  );
};
