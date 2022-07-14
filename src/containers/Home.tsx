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
                height: "95%",
            }}
        >
            <Grid container justifyContent="center" sx={{height: '95vh'}}>
                <Grid item xs={12} sm={8} justifyContent="center" sx={{height: '95vh'}}>
                    <Swiper
                        className="home-swiper"
                        modules={[Navigation, Pagination, EffectCoverflow]}
                        loop={true}
                        pagination={{clickable: true}}
                        hashNavigation={{
                            watchState: true,
                        }}
                        navigation={true}
                        centeredSlides
                        style={{paddingTop: '22vh', height: "100%"}}
                    >

                        <SwiperSlide>
                            <Linktree
                                i={1}
                                title={"xQuesting"}
                                subtitle={"A P2E Staking Game!"}
                                link={"/xquesting"}
                                cover={"/github.png"}
                            />
                        </SwiperSlide>
                        <SwiperSlide>
                            <Linktree
                                i={1}
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
