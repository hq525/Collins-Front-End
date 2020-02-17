import React, { useState, useEffect } from 'react';
import { Grid } from '@material-ui/core';
import Flipcard from './Flipcard';
import { ENDPOINT } from "../utils/config";
import API from "../utils/API";

const COLORS = {
    GREEN: "#00ff00",
    ORANGE: "#ff9900",
    RED: "#ff0000"
}

export default function Board(props) {
    const [productivityColor, setProductivityColor] = useState("White");
    useEffect(() => {
        let api = new API();
        api
        .post(`${ENDPOINT}/metrics/get/ytd/average/OEE`, {
            year: new Date().getFullYear()
        })
        .then((data) => {
            let OEE = data.OEE;
            if(OEE === null) {
                setProductivityColor("white");
            } else {
                api
                .post(`${ENDPOINT}/range/get`, {
                    name: "OEE"
                })
                .then((data) => {
                    if(OEE >= data.range.end / 100) {
                        setProductivityColor(COLORS.GREEN);
                    } else if (OEE <= data.range.start / 100) {
                        setProductivityColor(COLORS.RED)
                    } else {
                        setProductivityColor(COLORS.ORANGE)
                    }
                })
                .catch((error) => {
                    if(error && error.data && error.data.message) {
                        props.setError(error.data.message)
                    } else {
                        props.setError("An error occurred")
                    }
                })
            }
        })
        .catch((error) => {
            if(error && error.data && error.data.message) {
                props.setError(error.data.message)
            } else {
                props.setError("An error occurred")
            }
        })
    }, []);
    return(
        <div>
            <Grid style={{height: "100%"}} container>
                <Grid item xs={4} sm={4} md={4} lg={4}>
                    <Flipcard
                    frontContent={"OTD"}
                    backContent={"OTD"}
                    redirect={"/OTD"}
                    disabled={true}
                    backgroundColor={"#e6e6e6"}
                    setError={props.setError}
                    />
                </Grid>
                <Grid item xs={4} sm={4} md={4} lg={4}>
                    <Flipcard
                    frontContent={"WIP"}
                    backContent={"SWIP"}
                    redirect={"/WIP"}
                    disabled={true}
                    backgroundColor={"#e6e6e6"}
                    setError={props.setError}
                    />
                </Grid>
                <Grid item xs={4} sm={4} md={4} lg={4}>
                    <Flipcard
                    frontContent={"DER"}
                    backContent={"Total Direct Charge Labour Hours"}
                    redirect={"/DER"}
                    disabled={true}
                    backgroundColor={"#e6e6e6"}
                    setError={props.setError}
                    />
                </Grid>
            </Grid>
            <Grid style={{height: "100%"}} container>
                <Grid item xs={4} sm={4} md={4} lg={4}>
                    <Flipcard
                    frontContent={"Safety"}
                    backContent={"Number of days without accidents"}
                    disabled={true}
                    backgroundColor={"#e6e6e6"}
                    setError={props.setError}
                    />
                </Grid>
                <Grid item xs={4} sm={4} md={4} lg={4}>
                    <Flipcard
                    frontContent={"Quality"}
                    backContent={""}
                    disabled={true}
                    backgroundColor={"#e6e6e6"}
                    setError={props.setError}
                    />
                </Grid>
                <Grid item xs={4} sm={4} md={4} lg={4}>
                    <Flipcard
                    frontContent={"Productivity"}
                    backContent={"Productivity"}
                    redirect={"/Productivity"}
                    disabled={false}
                    slider={"PRODUCTIVITY"}
                    backgroundColor={productivityColor}
                    setError={props.setError}
                    />
                </Grid>
            </Grid>
        </div>
    )
}