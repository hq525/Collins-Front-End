import ReactCardFlip from 'react-card-flip';
import React, { useState } from 'react';
import { Grid, Button, Typography } from '@material-ui/core';
import { MdKeyboardArrowLeft } from "react-icons/md";
import Sliderr from "./Sliderr";
import { Redirect } from 'react-router-dom'

export default function Flipcard(props) {
    const [isFlipped, setIsFlipped] = useState(false);
    const handleClick = () => {
        setIsFlipped(!isFlipped);
    }
    const [redirect, setRedirect] = useState(false);
    if(redirect) {
        return <Redirect to={`${props.redirect}`} />
    } else {
        return(
            <div style={{ borderRadius: "3px", padding: "15px", width: "100%" }}>
                <ReactCardFlip isFlipped={isFlipped} flipDirection="horizontal">
                    <div onClick={handleClick} style={{border: "1px solid black", minHeight: "375px", display:"flex", justifyContent: "center", alignItems: "center", boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)", borderRadius: "25px"}}>
                        <Typography style={{fontWeight: "bold"}}>{props.frontContent}</Typography>
                    </div>
            
                    <div style={{border: "1px solid black", padding: "20px", minHeight: "375px", boxShadow: "0 4px 8px 0 rgba(0, 0, 0, 0.2)", borderRadius: "25px"}}>
                        <Grid container>
                            <Grid item xs={4} sm={4} md={4} lg={4}>
                                <Button onClick={handleClick} variant="contained">
                                    <MdKeyboardArrowLeft />
                                </Button>
                            </Grid>
                            <Grid style={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center"}} item xs={4} sm={4} md={4} lg={4}>
                                <Typography style={{fontWeight: "bold"}}>{props.backContent}</Typography>
                            </Grid>
                            <Grid item xs={4} sm={4} md={4} lg={4}>
                                <Button onClick={(e: any) => {e.preventDefault();setRedirect(true);}} variant="contained">
                                    More
                                </Button>
                            </Grid>
                        </Grid>
                        {isFlipped && <Sliderr />}
                    </div>
                </ReactCardFlip>
            </div>
            
        )
    }
}