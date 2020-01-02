import React, { useState } from 'react';
import { makeStyles, createStyles } from '@material-ui/styles';
import { Grid, Theme, Button, FormControl, Select, InputLabel, Box, Paper } from '@material-ui/core';
import { Redirect } from 'react-router-dom'
import Line from './Components/Line';
import ReactSpeedometer from "react-d3-speedometer"

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
    //   margin: theme.spacing(1),
    marginTop: "10px",
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
    root: {
        display: 'flex',
        '& > *': {
          margin: theme.spacing(1),
          width: "100%",
          height: theme.spacing(10),
        },
        transform: "translate(-7px, 0px)"
      },
  }),
);

export default function DERBoard() {
    const classes = useStyles({});
    const [section, setSection] = useState('Overall');
    const handleSectionChange = (event) => {
        setSection(event.target.value);
    }
    const inputLabel = React.useRef<HTMLLabelElement>(null);
    const [labelWidth, setLabelWidth] = React.useState(0);
    React.useEffect(() => {
        setLabelWidth(inputLabel.current!.offsetWidth);
    }, []);
    const [redirect, setRedirect] = useState(false);
    if(redirect) {
        return <Redirect to='/' />
    } else {
        return(
            <Box style={{height: "720px", padding:"10px 40px 40px 40px", margin:"10px 25px 0px 25px" }}>
                <Grid container >
                    <Grid style={{display: "flex", alignItems: "center"}} item xs={4} sm={4} md={4} lg={4}>
                        <Button onClick={(e: any) => {e.preventDefault();setRedirect(true);}} variant="contained">
                            Back to summary
                        </Button>
                    </Grid>
                    <Grid item xs={4} sm={4} md={4} lg={4}>

                    </Grid>
                    <Grid style={{display: "flex", justifyContent: "flex-end"}} item xs={4} sm={4} md={4} lg={4}>
                        <FormControl variant="outlined" className={classes.formControl}>
                            <InputLabel ref={inputLabel} htmlFor="outlined-section-native-simple">
                            Section
                            </InputLabel>
                            <Select
                            native
                            value={section}
                            onChange={(event) => handleSectionChange(event)}
                            labelWidth={labelWidth}
                            inputProps={{
                                name: 'section',
                                id: 'outlined-section-native-simple',
                            }}
                            >
                            <option value={"Overall"}>Overall</option>
                            <option value={"ATE1"}>ATE1</option>
                            <option value={"ATE2"}>ATE2</option>
                            <option value={"Sensor1"}>Sensor1</option>
                            <option value={"Sensor2"}>Sensor2</option>
                            <option value={"BAE"}>BAE</option>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
                <Grid container >
                    <Grid item xs={6} sm={6} md={6} lg={6} >
                        <div style={{width: "100%", display: "flex", justifyContent: "flex-start"}}>
                            <span style={{backgroundColor: "#ff1a75", padding: "5px 10px 5px 10px" }}></span>
                            <span style={{paddingLeft: "10px", width: "100%", display: "flex", justifyContent: "flex-start", fontSize: "30px" }}>Direct Expense Rate</span>
                        </div>
                        <div style={{width: "100%"}}>
                            <Grid container>
                                <Grid item xs={3} sm={3} md={3} lg={3}>
                                    <div className={classes.root}>
                                        <Paper elevation={3}><h2 style={{marginTop: "5px", marginBottom: "0px"}}>Target:</h2> <p style={{fontSize: "20px", marginTop: "10px"}}>≤ $78/hr</p></Paper>
                                    </div>
                                    <div className={classes.root}>
                                        <Paper elevation={3}><h2 style={{marginTop: "5px", marginBottom: "0px"}}>YTD:</h2> <p style={{fontSize: "20px", marginTop: "10px"}}>US$69.2/hr</p></Paper> 
                                    </div>
                                    <div className={classes.root}>
                                        <Paper elevation={3}><h2 style={{marginTop: "5px", marginBottom: "0px"}}>December:</h2> <p style={{fontSize: "20px", marginTop: "10px"}}>US$67.4/hr</p></Paper>
                                    </div>
                                </Grid>
                                <Grid item xs={9} sm={9} md={9} lg={9}>
                                    <Line width={525} height={300} />
                                </Grid>
                            </Grid>
                        </div>
                        <div style={{width: "100%", display: "flex", justifyContent: "flex-start"}}>
                            <span style={{backgroundColor: "#ff1a75", padding: "5px 10px 5px 10px" }}></span>
                            <span style={{paddingLeft: "10px", width: "100%", display: "flex", justifyContent: "flex-start", fontSize: "30px" }}>Available Hours</span>
                        </div>
                        <div style={{width: "100%"}}>
                            <Grid container>
                                <Grid item xs={3} sm={3} md={3} lg={3}>
                                    <div className={classes.root}>
                                        <Paper elevation={3}><h2 style={{marginTop: "5px", marginBottom: "0px"}}>Target:</h2> <p style={{fontSize: "20px", marginTop: "10px"}}>8400 hrs</p></Paper>
                                    </div>
                                    <div >
                                        <ReactSpeedometer
                                            customSegmentStops={[0, 12, 15, 30]}
                                            segmentColors={["limegreen", "gold", "firebrick"]}
                                            value={23.4}
                                            height={120}
                                            width={160}
                                            minValue={0}
                                            maxValue={30}
                                            currentValueText={"YTD: 23.4D"}
                                        />
                                    </div>
                                    <div>
                                        <ReactSpeedometer
                                            customSegmentStops={[0, 12, 15, 30]}
                                            segmentColors={["limegreen", "gold", "firebrick"]}
                                            value={23.4}
                                            height={120}
                                            width={160}
                                            minValue={0}
                                            maxValue={30}
                                            currentValueText={"December: 23.4D"}
                                        />
                                    </div>
                                </Grid>
                                <Grid item xs={9} sm={9} md={9} lg={9}>
                                    <Line width={525} height={300} />
                                </Grid>
                            </Grid>
                        </div>
                    </Grid>
                    <Grid item xs={6} sm={6} md={6} lg={6}>
                        <div style={{width: "100%", display: "flex", justifyContent: "flex-start"}}>
                            <span style={{backgroundColor: "#ff1a75", padding: "5px 10px 5px 10px" }}></span>
                            <span style={{paddingLeft: "10px", width: "100%", display: "flex", justifyContent: "flex-start", fontSize: "30px" }}>Direct Expense Rate</span>
                        </div>
                        <div style={{width: "100%"}}>
                            <Grid container>
                                <Grid item xs={9} sm={9} md={9} lg={9}>
                                    <Line width={525} height={300} />
                                </Grid>
                                <Grid item xs={3} sm={3} md={3} lg={3}>
                                    <div className={classes.root}>
                                        <Paper elevation={3}><h2 style={{marginTop: "5px", marginBottom: "0px"}}>Target:</h2> <p style={{fontSize: "20px", marginTop: "10px"}}>≤ $78/hr</p></Paper>
                                    </div>
                                    <div className={classes.root}>
                                        <Paper elevation={3}><h2 style={{marginTop: "5px", marginBottom: "0px"}}>YTD:</h2> <p style={{fontSize: "20px", marginTop: "10px"}}>US$69.2/hr</p></Paper> 
                                    </div>
                                    <div className={classes.root}>
                                        <Paper elevation={3}><h2 style={{marginTop: "5px", marginBottom: "0px"}}>December:</h2> <p style={{fontSize: "20px", marginTop: "10px"}}>US$67.4/hr</p></Paper>
                                    </div>
                                </Grid>
                            </Grid>
                        </div>
                        <div style={{width: "100%", display: "flex", justifyContent: "flex-start"}}>
                            <span style={{backgroundColor: "#ff1a75", padding: "5px 10px 5px 10px" }}></span>
                            <span style={{paddingLeft: "10px", width: "100%", display: "flex", justifyContent: "flex-start", fontSize: "30px" }}>Available Hours</span>
                        </div>
                        <div style={{width: "100%"}}>
                            <Grid container>
                                <Grid item xs={9} sm={9} md={9} lg={9}>
                                    <Line width={525} height={300} />
                                </Grid>
                                <Grid item xs={3} sm={3} md={3} lg={3}>
                                    <div className={classes.root}>
                                        <Paper elevation={3}><h2 style={{marginTop: "5px", marginBottom: "0px"}}>Target:</h2> <p style={{fontSize: "20px", marginTop: "10px"}}>8400 hrs</p></Paper>
                                    </div>
                                    <div >
                                        <ReactSpeedometer
                                            customSegmentStops={[0, 12, 15, 30]}
                                            segmentColors={["limegreen", "gold", "firebrick"]}
                                            value={23.4}
                                            height={120}
                                            width={160}
                                            minValue={0}
                                            maxValue={30}
                                            currentValueText={"YTD: 23.4D"}
                                        />
                                    </div>
                                    <div>
                                        <ReactSpeedometer
                                            customSegmentStops={[0, 12, 15, 30]}
                                            segmentColors={["limegreen", "gold", "firebrick"]}
                                            value={23.4}
                                            height={120}
                                            width={160}
                                            minValue={0}
                                            maxValue={30}
                                            currentValueText={"December: 23.4D"}
                                        />
                                    </div>
                                </Grid>
                            </Grid>
                        </div>
                    </Grid>
                </Grid>
            </Box>
        )
    }
}