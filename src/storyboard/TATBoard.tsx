import React from 'react';
import { Grid, Paper } from '@material-ui/core';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import BarChart from './Components/BarChart';
import Legend from './Components/Legend';
import Line from './Components/Line';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
      '& > *': {
        margin: theme.spacing(1),
        width: "100%",
        height: theme.spacing(15),
      },
    },
  }),
);

const TATData = [
    {
        color: "#ff0000",
        name: "R003",
        data: [32]
    },
    {
        color: "#ffff00",
        name: "R004",
        data: [41]
    },
    {
        color: "#33cc33",
        name: "C003",
        data: [12]
    },
    {
        color: "#0000ff",
        name: "C004",
        data: [100]
    }
]

export default function TATBoard() {
    const classes = useStyles({});
    var colors = [];
    var seriesBar = [];
    var legendData = [];
    Object.keys(TATData).forEach((key) => {
        let col = TATData[key]["color"];
        let val = {
            name: TATData[key]["name"],
            data: TATData[key]["data"]
        } 
        let val2 = {
            name: TATData[key]["name"],
            value: TATData[key]["data"][0]
        }
        colors.push(col);
        seriesBar.push(val);
        legendData.push(val2);
    })
    return (
        <Grid container>
            <Grid item xs={9} sm={9} md={9} lg={9}>
                <BarChart colors={colors} seriesBar={seriesBar} />
                <Grid container>
                    <Grid item xs={3} sm={3} md={3} lg={3}>
                        <div className={classes.root}>
                            <Paper elevation={3}><h2>Target</h2><h1>12 D</h1></Paper>
                        </div>
                        <div className={classes.root}>
                            <Paper elevation={3}><h2>December (Average)</h2><h1>23.4 D</h1></Paper> 
                        </div>
                        <div className={classes.root}>
                            <Paper elevation={3}><h2>YTD (Average)</h2><h1>25 D</h1></Paper>
                        </div>
                        <div className={classes.root}>
                            <Paper elevation={3}><h2>November (Average)</h2><h1>24 D</h1></Paper>
                        </div>
                    </Grid>
                    <Grid item xs={9} sm={9} md={9} lg={9}>
                        <Line width={800} height={550} />
                    </Grid>
                </Grid>
            </Grid>
            <Grid item xs={3} sm={3} md={3} lg={3}>
                <Legend
                maxHeight="100%"
                fontSize="30px"
                data={legendData} />
            </Grid>
        </Grid>
    )
}