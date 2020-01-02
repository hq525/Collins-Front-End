import React, { useState } from 'react';
import { makeStyles, createStyles } from '@material-ui/styles';
import { Grid, Theme, Button, FormControl, Select, InputLabel, Box, Typography } from '@material-ui/core';
import { Redirect } from 'react-router-dom'
import ReactSpeedometer from "react-d3-speedometer"
import Line from "./Components/Line";

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
  }),
);

export default function ProductivityBoard() {
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
                <Grid container>
                    <Grid item xs= {6} sm={6} md={6} lg={6}>
                        <div>
                            <h1 style={{marginTop: "0px" }}>OEE</h1>
                            <Grid container>
                                <Grid style={{display: "flex", justifyContent: "center", alignItems: "center"}} item xs={3} sm={3} md={3} lg={3}>
                                    <Button style={{width: "90%", height: "90%"}} variant="contained">
                                        Map
                                    </Button>
                                </Grid>
                                <Grid item xs={9} sm={9} md={9} lg={9}>
                                    <ReactSpeedometer
                                        customSegmentStops={[0, 12, 15, 30]}
                                        segmentColors={["limegreen", "gold", "firebrick"]}
                                        value={23.4}
                                        height={200}
                                        width={320}
                                        minValue={0}
                                        maxValue={30}
                                        currentValueText={"YTD: 23.4D"}
                                    />
                                </Grid>
                            </Grid>
                        </div>
                        <Grid container>
                            <Grid item xs={3} sm={3} md={3} lg={3}>
                                <div>
                                    <h4 style={{marginTop: "20px", marginBottom: "0px"}}>Availability</h4>
                                    <ReactSpeedometer
                                        customSegmentStops={[0, 12, 15, 30]}
                                        segmentColors={["limegreen", "gold", "firebrick"]}
                                        value={23.4}
                                        height={120}
                                        width={160}
                                        minValue={0}
                                        maxValue={30}
                                        currentValueText={"93%"}
                                    />
                                </div>
                                <div>
                                    <h4 style={{marginTop: "0px", marginBottom: "0px"}}>Performance</h4>
                                    <ReactSpeedometer
                                        customSegmentStops={[0, 12, 15, 30]}
                                        segmentColors={["limegreen", "gold", "firebrick"]}
                                        value={23.4}
                                        height={120}
                                        width={160}
                                        minValue={0}
                                        maxValue={30}
                                        currentValueText={"94%"}
                                    />
                                </div>
                                <div>
                                    <h4 style={{marginTop: "0px", marginBottom: "0px"}}>Quality</h4>
                                    <ReactSpeedometer
                                        customSegmentStops={[0, 12, 15, 30]}
                                        segmentColors={["limegreen", "gold", "firebrick"]}
                                        value={23.4}
                                        height={120}
                                        width={160}
                                        minValue={0}
                                        maxValue={30}
                                        currentValueText={"96%"}
                                    />
                                </div>
                            </Grid>
                            <Grid item xs= {9} sm={9} md={9} lg={9}>
                                <Line width={550} height={450} />
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs= {6} sm={6} md={6} lg={6}>
                        <div>
                            <h1 style={{marginTop: "0px" }}>OLE</h1>
                            <Grid container>
                                <Grid item xs={9} sm={9} md={9} lg={9}>
                                    <ReactSpeedometer
                                        customSegmentStops={[0, 12, 15, 30]}
                                        segmentColors={["limegreen", "gold", "firebrick"]}
                                        value={23.4}
                                        height={200}
                                        width={320}
                                        minValue={0}
                                        maxValue={30}
                                        currentValueText={"YTD: 23.4D"}
                                    />
                                </Grid>
                                <Grid style={{display: "flex", alignItems: "center"}} item xs={3} sm={3} md={3} lg={3}>
                                    <div>
                                        <h2>Manpower</h2>
                                        <h4>43</h4>
                                    </div>                                    
                                </Grid>
                            </Grid>
                        </div>
                        <Grid container>
                            <Grid item xs= {9} sm={9} md={9} lg={9}>
                                <Line width={550} height={450} />
                            </Grid>
                            <Grid item xs={3} sm={3} md={3} lg={3}>
                                <div>
                                    <h4 style={{marginTop: "20px", marginBottom: "0px"}}>Availability</h4>
                                    <ReactSpeedometer
                                        customSegmentStops={[0, 12, 15, 30]}
                                        segmentColors={["limegreen", "gold", "firebrick"]}
                                        value={23.4}
                                        height={120}
                                        width={160}
                                        minValue={0}
                                        maxValue={30}
                                        currentValueText={"93%"}
                                    />
                                </div>
                                <div>
                                    <h4 style={{marginTop: "0px", marginBottom: "0px"}}>Performance</h4>
                                    <ReactSpeedometer
                                        customSegmentStops={[0, 12, 15, 30]}
                                        segmentColors={["limegreen", "gold", "firebrick"]}
                                        value={23.4}
                                        height={120}
                                        width={160}
                                        minValue={0}
                                        maxValue={30}
                                        currentValueText={"94%"}
                                    />
                                </div>
                                <div>
                                    <h4 style={{marginTop: "0px", marginBottom: "0px"}}>Quality</h4>
                                    <ReactSpeedometer
                                        customSegmentStops={[0, 12, 15, 30]}
                                        segmentColors={["limegreen", "gold", "firebrick"]}
                                        value={23.4}
                                        height={120}
                                        width={160}
                                        minValue={0}
                                        maxValue={30}
                                        currentValueText={"96%"}
                                    />
                                </div>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Box>
        )
    }
}