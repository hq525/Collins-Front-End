import React from 'react';
import { makeStyles, createStyles } from '@material-ui/styles';
import { Grid, Button, InputLabel, FormControl, Select, Theme, CircularProgress } from '@material-ui/core';
import _ from "lodash";
import Piee from "./Components/Piee";
import Legend from "./Components/Legend";
import Line from "./Components/Line";
import ReactSpeedometer from "react-d3-speedometer"
import Guage from "./Components/Guage";
import Clock from "./Components/Clock";
import { Link } from "react-router-dom";
import { ENDPOINT } from "../utils/config";
import API from "../utils/API";


const pieData = [
    { name: 'DSP - 7000', value: 338 }, { name: 'EAP - 703', value: 95 },
    { name: 'EIU - 7000', value: 37 }, {name: 'EFIC - 701', value: 220},
    {name: 'FCC - 702', value: 200}
  ];

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    paper: {
        position: 'absolute',
        width: "80%",
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
      },
  }),
);

export default function Board(props) {
    const classes = useStyles({});
    const inputLabel = React.useRef<HTMLLabelElement>(null);
    const periodInputLabel = React.useRef<HTMLLabelElement>(null);
    const [labelWidth, setLabelWidth] = React.useState(0);
    const [periodLabelWidth, setPeriodLabelWidth] = React.useState(0);
    const [loading, setLoading] = React.useState(false);
    const [status, setStatus] = React.useState('');
    const [machine, setMachine] = React.useState({
        id: props.machineID,
        name: "" 
    });
    React.useEffect(() => {
        setLabelWidth(inputLabel.current!.offsetWidth);
        setPeriodLabelWidth(periodInputLabel.current!.offsetWidth);
        setLoading(true);
        let api = new API();
        api
        .get(`${ENDPOINT}/machine/board?id=${props.machineID}`)
        .then((data) => {
            setStatus(data.status);
            setMachine({...machine, name: data.machine.name});
            setLoading(false)
        })
        .catch((error) => {
            setLoading(false);
            props.setError(error.data.message);
        })
    }, []);
    const [period, setPeriod] = React.useState<string>("YTD");
    const handlePeriodChange = (event) => {
        setPeriod(event.target.value)      
    }
    const currentYear = new Date().getFullYear()
    const [year, setYear] = React.useState<Number>(currentYear);
    const handleYearChange = (event) => {
        setYear(event.target.value)
    }
    var pieLabels = pieData.map((obj) => {return obj.name});
    var pieDescriptions = pieData.map((obj) => {return `Value: ${obj.value}`});
    const markBreakDown = () => {
        setLoading(true);
        let api = new API();
        let startDate = new Date()
        startDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), 23, 59, 59, 999);
        api
        .post(`${ENDPOINT}/breakdown/new`, {
            "machineID": machine.id,
            startDate
        })
        .then((data) => {
            api
            .get(`${ENDPOINT}/machine/board?id=${props.machineID}`)
            .then((data) => {
                setStatus(data.status);
                setMachine({...machine, name: data.machine.name});
                props.refreshMap();
                setLoading(false)
            })
            .catch((error) => {
                setLoading(false);
                props.setError(error.data.message);
            })
        })
        .catch((error) => {
            setLoading(false);
            props.setError(error.data.message);
        })
    }
    const undoBreakdown = () => {
        setLoading(true);
        let api = new API();
        api
        .put(`${ENDPOINT}/breakdown/undo`, {
            machineID: machine.id
        })
        .then((data) => {
            api
            .get(`${ENDPOINT}/machine/board?id=${props.machineID}`)
            .then((data) => {
                setStatus(data.status);
                setMachine({...machine, name: data.machine.name});
                props.refreshMap()
                setLoading(false)
            })
            .catch((error) => {
                setLoading(false);
                props.setError(error.data.message);
            })
        })
        .catch((error) => {
            setLoading(false);
            props.setError(error.data.message);
        })
    }
    const finishMaintenance = () => {
        setLoading(true);
        let api = new API();
        api
        .put(`${ENDPOINT}/maintenance/finish`, {
            machineID: machine.id
        })
        .then((data) => {
            api
            .get(`${ENDPOINT}/machine/board?id=${machine.id}`)
            .then((data) => {
                setStatus(data.status);
                setMachine({...machine, name: data.machine.name});
                props.refreshMap()
                setLoading(false)
            })
            .catch((error) => {
                setLoading(false);
                props.setError(error.data.message);
            })
        })
        .catch((error) => {
            setLoading(false);
            props.setError(error.data.message);
        })
    }
    return (
        <div style={{top: "50%", left: "50%", transform: "translate(-50%, -50%)", backgroundColor: "#f2f2f2", borderWidth: "0px"}} className={classes.paper}>
            {
                loading ? (
                    <div style={{display: "flex", justifyContent: "center", height: "100%"}}>
                        <div style={{height: "100%", width: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}>
                            <CircularProgress size={50} />
                        </div>
                    </div>
                ) : (
                    <div>
                        <Grid container>
                            <Grid style={{backgroundColor: "white", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", margin: "3px 0px"}} item xs={4} sm={4} md={4} lg={4}>
                                <Grid container>
                                    <Grid style={{display: "flex", flexDirection: "row", alignItems: "flex-end", justifyContent: "center"}} item xs={12} sm={12} md={12} lg={12}>
                                            <h1 style={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", marginBottom: "0px", marginTop: "5px"}}>Selection</h1>
                                    </Grid>
                                    <Grid style={{display: "flex", justifyContent: "center", marginBottom: "5px"}} item xs={6} sm={6} md={6} lg={6}>
                                        <FormControl variant="outlined" className={classes.formControl}>
                                            <InputLabel ref={periodInputLabel} htmlFor="outlined-period-native-simple">
                                                Period
                                            </InputLabel>
                                            <Select
                                            native
                                            value={period}
                                            onChange={(event) => handlePeriodChange(event)}
                                            labelWidth={periodLabelWidth}
                                            inputProps={{
                                                name: 'period',
                                                id: 'outlined-period-native-simple',
                                            }}
                                            >
                                                <option value={"YTD"}>YTD</option>
                                                <option value={"January"}>January</option>
                                                <option value={"February"}>February</option>
                                                <option value={"March"}>March</option>
                                                <option value={"April"}>April</option>
                                                <option value={"May"}>May</option>
                                                <option value={"June"}>June</option>
                                                <option value={"July"}>July</option>
                                                <option value={"August"}>August</option>
                                                <option value={"September"}>September</option>
                                                <option value={"October"}>October</option>
                                                <option value={"November"}>November</option>
                                                <option value={"December"}>December</option>
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                    <Grid style={{display: "flex", justifyContent: "center"}} item xs={6} sm={6} md={6} lg={6}>
                                        <FormControl variant="outlined" className={classes.formControl}>
                                            <InputLabel ref={inputLabel} htmlFor="outlined-year-native-simple">
                                                Year
                                            </InputLabel>
                                            <Select
                                            native
                                            value={year}
                                            onChange={(event) => handleYearChange(event)}
                                            labelWidth={labelWidth}
                                            inputProps={{
                                                name: 'year',
                                                id: 'outlined-year-native-simple',
                                            }}
                                            >   
                                                {
                                                    _.range(1990, currentYear+1).map(value => <option key={value} value={value}>{value}</option>)
                                                }
                                            </Select>
                                        </FormControl>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid style={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center"}} item xs={4} sm={4} md={4} lg={4}>
                                <div style={{backgroundColor: "white", width: "95%", height: "95%", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center"}}>
                                            <p style={{fontSize: 40, fontWeight: "bold", margin: "0px"}}>{machine.name}</p>
                                </div>
                            </Grid>
                            <Grid style={{display: "flex", flexDirection: "row", alignItems: "space-between", justifyContent: "center"}} item xs={4} sm={4} md={4} lg={4}>
                                <Grid container>
                                    <Grid style={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center"}} item xs={12} sm={12} md={12} lg={12}>
                                        <div style={{textDecoration: "none", backgroundColor: "white", width: "95%", height: "90%", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center"}}>
                                            <Link style={{width: "100%", justifyContent: "center", display: "flex"}} to={`/schedule/${props.machineID}`}><Button variant="contained" color="primary">View Schedule</Button></Link>
                                        </div>
                                    </Grid>
                                    <Grid style={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center"}} item xs={12} sm={12} md={12} lg={12}>
                                        <div style={{backgroundColor: "white", width: "95%", height: "90%", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center"}}>
                                            { status === "MAINTENANCE" ? (
                                                <Button onClick={finishMaintenance} variant="contained" color="primary">Finish maintenance</Button>
                                            ) : (
                                                <div>
                                                    {
                                                        status === "MAINTENANCE2" ? (
                                                            <Button disabled onClick={finishMaintenance} variant="contained" color="primary">Finish maintenance</Button>
                                                        ) : (
                                                            <div>
                                                                { status === "EXCEED" ? (
                                                                    <Button variant="contained" onClick={finishMaintenance} color="secondary">Finish maintenance</Button>
                                                                ) : (
                                                                    <div>
                                                                        {
                                                                            status === "EXCEED2" ? (
                                                                                <Button disabled variant="contained" onClick={finishMaintenance} color="secondary">Finish maintenance</Button>
                                                                            ) : (
                                                                                <div>
                                                                                    { status === "BREAKDOWN" ? (
                                                                                        <Button onClick={undoBreakdown} variant="contained" color="secondary">Undo breakdown</Button>
                                                                                    ) : (
                                                                                        <div>
                                                                                            {
                                                                                                status === "BREAKDOWN2" ? (
                                                                                                    <Button disabled onClick={undoBreakdown} variant="contained" color="secondary">Undo breakdown</Button>
                                                                                                ) : (
                                                                                                    <Button onClick={markBreakDown} variant="contained" color="secondary">Mark as breakdown</Button>
                                                                                                )
                                                                                            }
                                                                                        </div>
                                                                                    )}
                                                                                </div>
                                                                            )
                                                                        }
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )
                                                    }
                                                </div>
                                            )}
                                        </div>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item xs={6} sm={6} md={6} lg={6}>
                                <Grid container>
                                    <Grid style={{paddingRight: "10px"}} item xs={6} sm={6} md={6} lg={6}>
                                        <div style={{backgroundColor: "white", paddingTop: "4px", paddingBottom: "5px", marginTop: "5px"}}>
                                            <h3 style={{display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "0px"}}>Overall Equipment Efficiency</h3>
                                            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%'}}>
                                                <Guage 
                                                stageWidth={220}
                                                stageHeight={375}
                                                customSegmentStops={[0, 0.8, 0.95, 1]}
                                                segmentColors={["firebrick", "gold", "limegreen"]}
                                                value={0.90}
                                                height={300}
                                                width={120}
                                                currentValue = {"90%"}
                                                />
                                            </div>
                                        </div>
                                    </Grid>
                                    <Grid item xs={6} sm={6} md={6} lg={6}>
                                        <div style={{display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "white", width: "95%", marginTop: "5px", paddingTop: "10px"}} >
                                            <ReactSpeedometer
                                                customSegmentStops={[0, 0.5, 0.8, 1]}
                                                segmentColors={["firebrick", "gold", "limegreen"]}
                                                value={0.75}
                                                height={120}
                                                width={160}
                                                minValue={0}
                                                maxValue={1}
                                                currentValueText={"Availability: 75%"}
                                            />
                                        </div>
                                        <div style={{display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "white", width: "95%", marginTop: "9px", paddingTop: "10px"}}>
                                            <ReactSpeedometer
                                                customSegmentStops={[0, 0.5, 0.8, 1]}
                                                segmentColors={["firebrick", "gold", "limegreen"]}
                                                value={0.6647}
                                                height={120}
                                                width={160}
                                                minValue={0}
                                                maxValue={1}
                                                currentValueText={"Performance: 66.47%"}
                                            />
                                        </div>
                                        <div style={{display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "white", width: "95%", marginTop: "9px", paddingTop: "10px"}}>
                                            <ReactSpeedometer
                                                customSegmentStops={[0, 0.5, 0.8, 1]}
                                                segmentColors={["firebrick", "gold", "limegreen"]}
                                                value={0.8264}
                                                height={120}
                                                width={160}
                                                minValue={0}
                                                maxValue={1}
                                                currentValueText={"Quality: 82.64%"}
                                            />
                                        </div>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={6} sm={6} md={6} lg={6}>
                                <div style={{backgroundColor: "white", marginTop: "5px", height: "423px"}}>
                                    <h3 style={{display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "0px", marginTop: "0px", paddingTop: "20px", paddingBottom: "15px"}}>Top 12 components (By labour hours)</h3>
                                    <Clock 
                                    stageWidth = {700}
                                    stageHeight= {350}
                                    radius = {100}
                                    rectWidth = {150}
                                    rectHeight = {40}
                                    status={status}
                                    />
                                </div>
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item xs={6} sm={6} md={6} lg={6}>
                                <div style={{backgroundColor: "white", marginTop: "10px"}}>
                                    <h3 style={{display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "0px", marginTop: "0px", paddingTop: "15px", paddingBottom: "15px"}}>Labour hours composition by component</h3>
                                    <Grid container>
                                        <Grid item xs={5} sm={5} lg={5} md={5}>
                                            <Piee 
                                            width={270}
                                            height={270}
                                            dataKey={"value"}
                                            data={pieData}
                                            outerRadius={130}
                                            labels={pieLabels}
                                            descriptions={pieDescriptions}
                                            />
                                        </Grid>
                                        <Grid item xs={7} sm={7} lg={7} md={7}>
                                            <Legend maxHeight={250} data={pieData} />
                                        </Grid>
                                    </Grid>
                                </div>
                            </Grid>
                            <Grid item xs={6} sm={6} md={6} lg={6}>
                                <div style={{backgroundColor: "white", marginTop: "10px", marginLeft: "20px"}}>
                                    <h3 style={{display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "0px", marginTop: "0px", paddingTop: "15px", paddingBottom: "15px"}}>Average labour hour over time</h3>
                                    <Line width={700} height={270} />
                                </div>
                            </Grid>
                        </Grid>
                    </div>
                )
            }
        </div>
    )
}