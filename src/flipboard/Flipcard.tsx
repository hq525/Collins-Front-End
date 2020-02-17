import ReactCardFlip from 'react-card-flip';
import React, { useState } from 'react';
import { Grid, Button, Typography } from '@material-ui/core';
import { MdKeyboardArrowLeft } from "react-icons/md";
import Sliderr from "./Sliderr";
import ProductivitySlider from "./ProductivitySlider"
import { Redirect } from 'react-router-dom'

export default function Flipcard(props) {
    const [isFlipped, setIsFlipped] = useState(false);
    const handleClick = () => {
        if(!props.disabled) {
            setIsFlipped(!isFlipped);
        }
    }
    const [redirect, setRedirect] = useState(false);
    if(redirect) {
        return <Redirect to={`${props.redirect}`} />
    } else {
        return(
            <div style={{ borderRadius: "3px", padding: "15px", width: "100%" }}>
                <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal">
                    <div onClick={handleClick} style={{ cursor: "pointer", minHeight: "500px", display:"flex", justifyContent: "center", alignItems: "center", boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)", borderRadius: "25px", backgroundColor: props.backgroundColor}}>
                        <Typography style={{fontWeight: "bold", fontSize: 30, fontFamily: "Comic Sans MS"}}>{props.frontContent}</Typography>
                    </div>
            
                    <div style={{ padding: "20px", minHeight: "500px", boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)", borderRadius: "25px", display: "flex", flexDirection: "column"}}>
                        <Grid container>
                            <Grid style={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center"}} item xs={4} sm={4} md={4} lg={4}>
                                <Button onClick={handleClick} variant="contained">
                                    <MdKeyboardArrowLeft />
                                </Button>
                            </Grid>
                            <Grid style={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center"}} item xs={4} sm={4} md={4} lg={4}>
                                <Typography style={{fontWeight: "bold", fontSize: 40, color: props.backgroundColor, fontFamily: "Comic Sans MS"}}>{props.backContent}</Typography>
                            </Grid>
                            <Grid style={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center"}} item xs={4} sm={4} md={4} lg={4}>
                                <Button onClick={(e: any) => {e.preventDefault();setRedirect(true);}} variant="contained">
                                    More
                                </Button>
                            </Grid>
                        </Grid>
                        {isFlipped && (
                            props.slider === "PRODUCTIVITY" ? (
                                <ProductivitySlider setError={props.setError} />
                            ) : (
                                <Sliderr setError={props.setError} />
                            )
                        )}
                    </div>
                </ReactCardFlip>
            </div>
            
        )
    }
}