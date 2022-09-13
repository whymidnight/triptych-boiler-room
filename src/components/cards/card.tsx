import { styled } from "@mui/system";
import { Paper } from "@mui/material";
import Theme from "../../utils/theme/theme";

export const StyledCard = styled(Paper)({
  background: Theme.palette.secondary.light,
  color: Theme.typography.body1.color,
  padding: "10px",
  marginTop: "10px",
  marginBottom: "10px",
  borderRadius: "25px",
});

export const StyledCardSecondary = styled(Paper)({
  background: Theme.palette.primary.main,
  padding: "10px",
  marginTop: "10px",
  marginBottom: "10px",
  borderRadius: "25px",
});
