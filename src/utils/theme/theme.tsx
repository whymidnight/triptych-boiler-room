import { createTheme } from "@mui/material/styles";
import {
  red,
  orange,
  yellow,
  green,
  lightBlue,
  grey,
} from "@mui/material/colors";

export const Theme = {
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiInput-underline:after": {
            boxShadow: "#37AA9C",
          },
        },
      },
    },
    MuiButton: {
      variants: [
        {
          props: { variant: "outlined" },
          style: {
            border: "solid",
            borderWidth: "1px",
            borderColor: process.env.NEXT_PUBLIC_TEXT_COLOR!,
          },
        },
      ],
    },
  },
  typography: {
    url: process.env.NEXT_PUBLIC_TEXT_FONT_FILE!,
    fontFamily: ["MADE Evolve Sans"],
    fontSize: "12rem",
    h1: {
      fontFamily: "Lato",
      color: process.env.NEXT_PUBLIC_TEXT_COLOR!,
      fontSize: "12rem",
      fontWeight: 400,
      lineHeight: 1.167,
      lettingSpacing: "-0.01562em",
    },
    body1: {
      color: process.env.NEXT_PUBLIC_TEXT_COLOR!,
      fontSize: "smaller",
      fontWeight: 400,
    },
  },
  Button: {
    color: "#FFFFFFF",
  },

  palette: {
    mode: "light",
    primary: {
      main: process.env.NEXT_PUBLIC_PRIMARY_PRIMARY_COLOR!,
    },
    secondary: {
      light: process.env.NEXT_PUBLIC_PRIMARY_SECONDARY_COLOR!,
      main: process.env.NEXT_PUBLIC_SECONDARY_PRIMARY_COLOR!,
      dark: red[900],
      contrastText: process.env.NEXT_PUBLIC_SECONDARY_SECONDARY_COLOR!,
    },
    error: {
      light: red[400],
      main: red[500],
      dark: red[300],
      contrastText: grey[800],
    },
    success: {
      main: process.env.NEXT_PUBLIC_PRIMARY_SECONDARY_COLOR!,
    },
    warning: {
      main: yellow[500],
      contrastText: grey[800],
    },
    info: {
      main: lightBlue[500],
    },
    text: {
      primary: grey[900],
      secondary: grey[700],
      disabled: grey[500],
    },
    action: {
      active: red[200],
      disabled: grey[700],
      disabledBackground: grey[200],
      hover: red[100],
      hoverOpacity: 0.7,
      focus: red[600],
      focusOpacity: 1,
      selected: red[300],
      selectedOpacity: 1,
    },
    background: {
      default: orange[300],
      paper: grey[200],
    },
    common: {
      black: grey[900],
      white: grey[200],
    },
    tonalOffset: 0.2,
  },
};

export const CreateTheme = () => {
  // @ts-ignore
  return createTheme(Theme);
};

export default Theme;
