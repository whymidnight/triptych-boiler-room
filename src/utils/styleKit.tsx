import { createGlobalStyle } from "styled-components";
import Theme from "./theme/theme";

export const GlobalStyle = createGlobalStyle`
@font-face {
  font-family: 'MADE Evolve Sans';
  src: url(${Theme.typography.url}) format('woff2');
}

    width: 50vw;.MuiTypography-caption {
  font-family: 'MADE Evolve Sans' !important;
  color: ${Theme.typography.body1.color} !important;
}
.MuiTypography-body2 {
  font-family: 'MADE Evolve Sans' !important;
}
button[class*="CTAButton"] {
  font-family: 'MADE Evolve Sans' !important;
  background: ${Theme.palette.secondary.main} !important;
}
.MuiTypography-colorTextSecondary {
  font-family: 'MADE Evolve Sans' !important;
}
.MuiTypography-colorTextPrimary {
  font-family: 'MADE Evolve Sans' !important;
  color: ${Theme.typography.body1.color} !important;
}

.wallet-adapter-button {
  font-family: "MADE Evolve Sans" !important;
  background-color: ${Theme.palette.secondary.main} !important;
}
.wallet-adapter-button-trigger {
  background-color: ${Theme.palette.secondary.main} !important;
}
.wallet-adapter-modal-wrapper {
  font-family: "MADE Evolve Sans" !important;
  background-color: ${Theme.palette.primary.main} !important;
}

#cmui-modal {
  font-family: "MADE Evolve Sans" !important;
  background-color: ${Theme.palette.secondary.light};
  box-shadow: 0px 0px 40px 10px ${Theme.palette.secondary.main} !important;
}

.raffles-featured-box {
  box-shadow: 0px 0px 40px 10px ${Theme.palette.secondary.main} !important;
}

.raffles-featured-card {
  box-shadow: 0px 0px 40px 10px ${Theme.typography.body1.color} !important;
}

.raffle-information-box {
  box-shadow: 0px 0px 40px 10px ${Theme.typography.body1.color} !important;
}

.raffle-information-card {
  height: 100%;
  box-shadow: 0px 0px 40px 10px ${Theme.palette.secondary.main} !important;
}

.raffle-information-modal {
  height: 100%;
  box-shadow: 0px 0px 40px -10px ${Theme.palette.secondary.main} !important;
}
.xquesting-enrollment-card {
  padding: 20px;
  box-shadow: 0px 0px 40px 10px ${Theme.palette.primary.main} !important;
}
.xquesting-enrollment-box {
  padding: 20px;
  box-shadow: 0px 0px 40px 10px ${Theme.palette.primary.main} !important;
}

.xquesting-enrollment-container {
  box-shadow: 0px 0px 40px 10px ${Theme.palette.primary.main} !important;
  @media (max-width: 500px) {
    width: 90vw;
  }
  @media (min-width: 500px) {
    width: 50vw;
  }
}

.bg-solid {
  background-color: ${Theme.palette.secondary.light} !important;
  min-height: 100vh;
}

.bg {
  background-color: ${Theme.palette.primary.main};
  min-height: 100vh;
}
.xquestingbg {
  background-color: ${Theme.palette.primary.main};
  min-height: 100vh;
}
.profilebg {
  background-color: ${Theme.palette.secondary.light};
  min-height: 100vh;
}
.App-header {
  background-color: ${Theme.palette.primary.main};

  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: calc(10px + 2vmin);
  color: white;
  padding: 40px 50px 50px 40px;
}
#topbar {
  background: linear-gradient(
    180deg,
    ${Theme.palette.primary.main} 40%,
    rgba(0, 255, 163, 0.15) 100%
  );
  color: ${Theme.typography.body1.color};
}
#matrixrain-column {
  font-family: "MADE Evolve Sans" !important;
  color: ${Theme.palette.secondary.main};
}
#matrixrain-bg {
  background: ${Theme.palette.primary.main};
}

h2, p {
  color: ${Theme.typography.body1.color} !important;
}

html,
body {
  font-family: "MADE Evolve Sans" !important;
  padding: 0;
  margin: 0;
}

img {
border-radius: unset !important;
}

.grid-item {
  width: 100%;
  height: 100%;
  z-index: 1000000;
  box-sizing: border-box;
}

.dropzone {
  flex: 1;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 1rem;
}

.undefined {
}

.home-swiper {
  @media (max-width: 500px) {
    width: 80%;
  }
  @media (min-width: 500px) {
    width: 50%;
  }
}

.swap-container {
  @media (max-width: 500px) {
    width: 95vw;
  }
  @media (min-width: 500px) {
    width: 45vw;
  }
  background-color: ${Theme.palette.secondary.light} !important;
}

.swap-card {
  background-image: linear-gradient(140.14deg,rgb(0 182 191 / 15%),rgb(27 22 89 / 10%) 86.61%),linear-gradient(321.82deg,rgb(24 19 77),rgb(27 22 89));
}

.MuiMenu-list {
  background-color: linear-gradient(140.14deg,rgb(0 182 191 / 15%),rgb(27 22 89 / 10%) 86.61%),linear-gradient(321.82deg,rgb(24 19 77),rgb(27 22 89)) !important;
  background: linear-gradient(140.14deg,rgb(0 182 191 / 15%),rgb(27 22 89 / 10%) 86.61%),linear-gradient(321.82deg,rgb(24 19 77),rgb(27 22 89)) !important;
}
.MuiInputBase-input {
color: ${Theme.typography.body1.color};
}

.mint-container {
  @media (max-width: 500px) {
    width: 100vw;
  }
  @media (min-width: 500px) {
    width: 50vw;
  }
}

.flippening-box {
  @media (max-width: 500px) {
    padding-top: 10vh;
    padding-bottom: 7.5vh;
  }
  @media (min-width: 500px) {
    padding-top: 10vh;
  }
}

.flippening-content {
  @media (max-width: 500px) {
    width: 90vw;
  }
  @media (min-width: 500px) {
    width: 30vw;
  }
}

.giveaways-container {
  width: 700px;
}

.Mui-disabled {
  border: 1px solid #333F44 !important;
}

`;

