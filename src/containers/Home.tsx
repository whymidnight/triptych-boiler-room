import {Box} from '@mui/material';
import {Linktree} from "../components/cards";
import MatrixRain from "../../vendor_modules/matrixrain/src/MatrixRain";
import {Grid} from "@mui/material";
import {Swiper, SwiperSlide} from "swiper/react";
import SwiperCore, {Navigation, Pagination, EffectCoverflow} from "swiper";


export const Home = () => {
  return (
    <div
      style={{
        display: "flex",
        height: "70%",
      }}
    >
      <Grid container justifyContent="center" sx={{height: '80vh'}}>
        <Grid item xs={12} sm={8} justifyContent="center" sx={{height: '80vh'}}>
          <Swiper
            modules={[Pagination, EffectCoverflow]}
            loop={true}
            pagination={{clickable: true}}
            effect="coverflow"
            coverflowEffect={{
              rotate: 50,
              stretch: 0,
              depth: 250,
              modifier: 2,
              slideShadows: false
            }}
            breakpoints={{
              320: {
                slidesPerView: 1,
                spaceBetween: 50,
              },
              640: {
                slidesPerView: 2,
                spaceBetween: 50,
              },
            }}
            centeredSlides
            style={{paddingTop: '20vh', width: '50%', height: "100%"}}
          >

            <SwiperSlide>
              <Linktree
                i={0}
                title={"xQuesting"}
                subtitle={"A P2E Staking Game!"}
                link={"/xquesting"}
                cover={"/github.png"}
              />
            </SwiperSlide>
            <SwiperSlide>
              <Linktree
                i={1}
                title={"Mint"}
                subtitle={"NOT INTERNAL OR CONFIDENTIAL!"}
                link={"/mint"}
                cover={"/github.png"}
              />
            </SwiperSlide>
            <SwiperSlide>
              <Linktree
                i={2}
                title={"xSwap"}
                subtitle={"Swap Utility Tokens for Tokens!"}
                link={"/xswap"}
                cover={"/github.png"}
              />
            </SwiperSlide>
          </Swiper>
        </Grid>
      </Grid>
      <div style={{zIndex: -1}}>
        <MatrixRain />
      </div>
    </div >
  );
};
