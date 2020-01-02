import React from 'react';
import { Grid } from '@material-ui/core';
import Flipcard from './Flipcard';

export default function Board() {
    return(
        <div>
            <Grid style={{height: "100%"}} container>
                <Grid item xs={4} sm={4} md={4} lg={4}>
                    <Flipcard
                    frontContent={"OTD"}
                    backContent={"OTD"}
                    redirect={"/OTD"}
                    />
                </Grid>
                <Grid item xs={4} sm={4} md={4} lg={4}>
                    <Flipcard
                    frontContent={"WIP"}
                    backContent={"SWIP"}
                    redirect={"/WIP"}
                    />
                </Grid>
                <Grid item xs={4} sm={4} md={4} lg={4}>
                    <Flipcard
                    frontContent={"DER"}
                    backContent={"Total Direct Charge Labour Hours"}
                    redirect={"/DER"}
                    />
                </Grid>
            </Grid>
            <Grid style={{height: "100%"}} container>
                <Grid item xs={4} sm={4} md={4} lg={4}>
                    <Flipcard
                    frontContent={"Safety"}
                    backContent={"Number of days without accidents"}
                    />
                </Grid>
                <Grid item xs={4} sm={4} md={4} lg={4}>
                    <Flipcard
                    frontContent={"Quality"}
                    backContent={""}
                    />
                </Grid>
                <Grid item xs={4} sm={4} md={4} lg={4}>
                    <Flipcard
                    frontContent={"Productivity"}
                    backContent={"OLE"}
                    redirect={"/Productivity"}
                    />
                </Grid>
            </Grid>
        </div>
    )
}