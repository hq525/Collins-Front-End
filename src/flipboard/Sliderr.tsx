import React from "react";
import Slider from "react-slick";
import { Grid, Typography } from '@material-ui/core';

const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    nextArrow: <div style={{background: "transparent"}} />,
    prevArrow: <div style={{background: "transparent"}} />
  };

export default function Sliderr() {
    return (
      <div style={{display: "flex", justifyContent: "center"}}>
        <div style={{width: "80%"}}>
        <Slider {...settings}>
          <div >
            <div style={{minHeight: "250px"}}>
              <h3>January</h3>
              <hr />
              <Grid container justify="space-between">
                <Grid item>
                  <Typography>Turn-around time</Typography>
                </Grid>
                <Grid item>
                  <Typography>23.4D</Typography>
                </Grid>
              </Grid>
            </div>
          </div>
          <div >
          <div style={{minHeight: "250px"}}>
          <h3>December</h3>
              <hr />
            </div>
          </div>
          <div >
          <div style={{minHeight: "250px"}}>
          <h3>YTD</h3>
              <hr />
            </div>
          </div>
        </Slider>
      </div>
      </div>
      
    );
}