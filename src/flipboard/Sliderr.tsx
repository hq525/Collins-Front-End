import React from "react";
import Slider from "react-slick";

export default function Sliderr(props) {
    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
      height: 2000,
      initialSlide: 1,
      nextArrow: <div style={{background: "transparent"}} />,
      prevArrow: <div style={{background: "transparent"}} />
    };
    return (
      <div style={{display: "flex", justifyContent: "center", flexGrow: 1, marginTop: "20px"}}>
        <div style={{width: "80%", height: "100%"}}>
        <Slider {...settings}>
          <div >
            <div style={{minHeight: "345px"}}>
            </div>
          </div>
          <div >
            <div style={{minHeight: "345px"}}>
            </div>
          </div>
          <div >
            <div style={{minHeight: "345px"}}>
            </div>
          </div>
        </Slider>
      </div>
      </div>
      
    );
}