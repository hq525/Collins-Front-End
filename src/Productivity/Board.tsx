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

const COLORS = ['#73c2fb', '#87ceeb', '#ffd700', '#f46a4e', '#47a155', '#e2725b', '#3a3e47', '#ffc1c1', '#fbdb48', '#fff62f', '#d22626', '#f0a20c', '#44c7e3', '#d73dd8', '#ff00b4', '#f20048', '#83002e', '#550878', '#33001c'];

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
        _id: props.machineID,
        name: "" 
    });
    const [availabilty, setAvailability] = React.useState(null);
	const [performance, setPerformance] = React.useState(null);
	const [quality, setQuality] = React.useState(null);
    const [OEE, setOEE] = React.useState(null);
    const [OEEPoints, setOEEPoints] = React.useState({
        startLimit: 0,
        endLimit: 1,
        start: 0.2,
        end: 0.5
    });
    const [availabilityPoints, setAvailabilityPoints] = React.useState({
        startLimit: 0,
        endLimit: 1,
        start: 0.2,
        end: 0.5
    });
    const [performancePoints, setPerformancePoints] = React.useState({
        startLimit: 0,
        endLimit: 1,
        start: 0.2,
        end: 0.5
    });
    const [qualityPoints, setQualityPoints] = React.useState({
        startLimit: 0,
        endLimit: 1,
        start: 0.2,
        end: 0.5
    });
    React.useEffect(() => {
        setLabelWidth(inputLabel.current!.offsetWidth);
        setPeriodLabelWidth(periodInputLabel.current!.offsetWidth);
        setLoading(true);
        let api = new API();
        api
        .get(`${ENDPOINT}/machine/board?_id=${props.machineID}`)
        .then((data) => {
            setStatus(data.status);
            setMachine({...machine, name: data.machine.name});
            api
			.post(`${ENDPOINT}/metrics/get`, {
				machineID: props.machineID,
				month: period,
				year
			})
			.then(({metrics}) => {
				if(metrics) {
                    setAvailability(metrics.productionTime / metrics.availableTime);
                    setPerformance(metrics.actualProduction / metrics.productionCapacity);
                    setQuality(metrics.goodPieces / metrics.actualProduction);
                    setOEE((metrics.productionTime / metrics.availableTime) * (metrics.actualProduction / metrics.productionCapacity) * (metrics.goodPieces / metrics.actualProduction))
				} else {
                    setAvailability(null);
                    setPerformance(null);
                    setQuality(null);
                    setOEE(null);
				}
                api
                .post(`${ENDPOINT}/job/ranking/period`, {
                    machineID: props.machineID,
                    month: period,
                    year
                })
                .then((data) => {
                    setPieData(data.components)
                    setPieLabels(pieData.map((obj) => {return obj.name}));
                    setPieDescriptions(pieData.map((obj) => {return `Value: ${obj.value}`}));
                    api
                    .post(`${ENDPOINT}/job/total`, {
                        machineID: props.machineID,
                        year
                    })
                    .then((data) => {
                        setLineData(data.hours)
                        let promises = []
                        promises.push(new Promise((resolve, reject) => {
                            api
                            .post(`${ENDPOINT}/range/get`, {
                                name: "OEE"
                            })
                            .then((data) => {
                                setOEEPoints({
                                    ...OEEPoints,
                                    start: data.range.start / 100,
                                    end: data.range.end / 100
                                })
                                resolve();
                            })
                            .catch((error) => {
                                reject(error);
                            })
                        }))
                        promises.push(new Promise((resolve, reject) => {
                            api
                            .post(`${ENDPOINT}/range/get`, {
                                name: "AVAILABILITY"
                            })
                            .then((data) => {
                                setAvailabilityPoints({
                                ...availabilityPoints,
                                start: data.range.start / 100,
                                end: data.range.end / 100
                                })
                                resolve();
                            })
                            .catch((error) => {
                                reject(error);
                            })
                        }))
                        promises.push(new Promise((resolve, reject) => {
                            api
                            .post(`${ENDPOINT}/range/get`, {
                                name: "PERFORMANCE"
                            })
                            .then((data) => {
                                setPerformancePoints({
                                ...performancePoints,
                                start: data.range.start / 100,
                                end: data.range.end / 100
                                })
                                resolve();
                            })
                            .catch((error) => {
                                reject(error);
                            })
                        }))
                        promises.push(new Promise((resolve, reject) => {
                            api
                            .post(`${ENDPOINT}/range/get`, {
                                name: "QUALITY"
                            })
                            .then((data) => {
                                setQualityPoints({
                                ...qualityPoints,
                                start: data.range.start / 100,
                                end: data.range.end / 100
                                })
                                resolve();
                            })
                            .catch((error) => {
                                reject(error);
                            })
                        }))
                        Promise
                        .all(promises)
                        .then(() => {
                            setLoading(false);
                        })
                        .catch((error) => {
                            if(error && error.data && error.data.message) {
                                props.setError(error.data.message)
                            } else {
                                props.setError("An error occurred")
                            }
                        })
                    })
                    .catch((error) => {
                        setLoading(false);
                        if(error.data && error.data.message) {
                            props.setError(error.data.message)
                        } else {
                            props.setError("An error occurred")
                        }
                    })
                })
                .catch((error) => {
                    setLoading(false);
                    if(error.data && error.data.message) {
                        props.setError(error.data.message)
                    } else {
                        props.setError("An error occurred")
                    }
                })
			})
			.catch((error) => {
				setLoading(false);
				if(error.data && error.data.message) {
					props.setError(error.data.message)
				} else {
					props.setError("An error occurred")
				}
			})
        })
        .catch((error) => {
            setLoading(false);
            if(error.data && error.data.message) {
                props.setError(error.data.message);
            } else {
                props.setError("An error occurred");
            }
        })
    }, []);
    const [period, setPeriod] = React.useState<Number>(new Date().getMonth());
    const handlePeriodChange = (event) => {
        let machineID = props.machineID;
        let month = event.target.value;
        setLoading(true);
        setPeriod(event.target.value)
        let api = new API();
        if(Number(event.target.value) === 12) {
            api
            .post(`${ENDPOINT}/metrics/get/ytd`, {
                machineID: props.machineID,
                year
            })
            .then(({metrics}) => {
                if(metrics) {
                    setAvailability(metrics.availability);
                    setPerformance(metrics.performance);
                    setQuality(metrics.quality);
                    setOEE(metrics.OEE)
				} else {
                    setAvailability(null);
                    setPerformance(null);
                    setQuality(null);
                    setOEE(null);
				}
				api
                .post(`${ENDPOINT}/job/ranking/year`, {
                    machineID,
                    year
                })
                .then((data) => {
                    setPieData(data.components)
                    setPieLabels(pieData.map((obj) => {return obj.name}));
                    setPieDescriptions(pieData.map((obj) => {return `Value: ${obj.value}`}));
                    setLoading(false);
                })
                .catch((error) => {
                    setLoading(false);
                    if(error.data && error.data.message) {
                        props.setError(error.data.message)
                    } else {
                        props.setError("An error occurred")
                    }
                })
            })
            .catch((error) => {
                setLoading(false);
                if(error.data && error.data.message) {
                    props.setError(error.data.message);
                } else {
                    props.setError("An error occurred");
                }
            })
        } else {
            api
			.post(`${ENDPOINT}/metrics/get`, {
				machineID: props.machineID,
				month: event.target.value,
				year
			})
			.then(({metrics}) => {
				if(metrics) {
                    setAvailability(metrics.productionTime / metrics.availableTime);
                    setPerformance(metrics.actualProduction / metrics.productionCapacity);
                    setQuality(metrics.goodPieces / metrics.actualProduction);
                    setOEE((metrics.productionTime / metrics.availableTime) * (metrics.actualProduction / metrics.productionCapacity) * (metrics.goodPieces / metrics.actualProduction))
				} else {
                    setAvailability(null);
                    setPerformance(null);
                    setQuality(null);
                    setOEE(null);
                }
				api
                .post(`${ENDPOINT}/job/ranking/period`, {
                    machineID,
                    month,
                    year
                })
                .then((data) => {
                    setPieData(data.components)
                    setPieLabels(pieData.map((obj) => {return obj.name}));
                    setPieDescriptions(pieData.map((obj) => {return `Value: ${obj.value}`}));
                    setLoading(false);
                })
                .catch((error) => {
                    setLoading(false);
                    if(error.data && error.data.message) {
                        props.setError(error.data.message)
                    } else {
                        props.setError("An error occurred")
                    }
                })
			})
			.catch((error) => {
				setLoading(false);
				if(error.data && error.data.message) {
					props.setError(error.data.message)
				} else {
					props.setError("An error occurred")
				}
			})
        }
    }
    const currentYear = new Date().getFullYear()
    const [year, setYear] = React.useState<Number>(currentYear);
    const handleYearChange = (event) => {
        setLoading(true);
        setYear(event.target.value)
        let machineID = props.machineID;
        let year = event.target.value;
        let api = new API();
        if(Number(period) === 12) {
            api
            .post(`${ENDPOINT}/metrics/get/ytd`, {
                machineID: props.machineID,
                year: event.target.value
            })
            .then(({metrics}) => {
                if(metrics) {
                    setAvailability(metrics.availability);
                    setPerformance(metrics.performance);
                    setQuality(metrics.quality);
                    setOEE(metrics.OEE)
				} else {
                    setAvailability(null);
                    setPerformance(null);
                    setQuality(null);
                    setOEE(null);
				}
				api
                .post(`${ENDPOINT}/job/ranking/year`, {
                    machineID,
                    year
                })
                .then((data) => {
                    setPieData(data.components)
                    setPieLabels(pieData.map((obj) => {return obj.name}));
                    setPieDescriptions(pieData.map((obj) => {return `Value: ${obj.value}`}));
                    api
                    .post(`${ENDPOINT}/job/total`, {
                        machineID,
                        year
                    })
                    .then((data) => {
                        setLineData(data.hours)
                        setLoading(false);
                    })
                    .catch((error) => {
                        setLoading(false);
                        if(error.data && error.data.message) {
                            props.setError(error.data.message)
                        } else {
                            props.setError("An error occurred")
                        }
                    })
                })
                .catch((error) => {
                    setLoading(false);
                    if(error.data && error.data.message) {
                        props.setError(error.data.message)
                    } else {
                        props.setError("An error occurred")
                    }
                })
            })
            .catch((error) => {
                setLoading(false);
                if(error.data && error.data.message) {
                    props.setError(error.data.message);
                } else {
                    props.setError("An error occurred");
                }
            })
        } else {
            api
			.post(`${ENDPOINT}/metrics/get`, {
				machineID,
				month: period,
				year
			})
			.then(({metrics}) => {
				if(metrics) {
                    setAvailability(metrics.productionTime / metrics.availableTime);
                    setPerformance(metrics.actualProduction / metrics.productionCapacity);
                    setQuality(metrics.goodPieces / metrics.actualProduction);
                    setOEE((metrics.productionTime / metrics.availableTime) * (metrics.actualProduction / metrics.productionCapacity) * (metrics.goodPieces / metrics.actualProduction))
				} else {
                    setAvailability(null);
                    setPerformance(null);
                    setQuality(null);
                    setOEE(null);
				}
				api
                .post(`${ENDPOINT}/job/ranking/period`, {
                    machineID,
                    month: period,
                    year
                })
                .then((data) => {
                    setPieData(data.components)
                    setPieLabels(pieData.map((obj) => {return obj.name}));
                    setPieDescriptions(pieData.map((obj) => {return `Value: ${obj.value}`}));
                    api
                    .post(`${ENDPOINT}/job/total`, {
                        machineID,
                        year
                    })
                    .then((data) => {
                        setLineData(data.hours)
                        setLoading(false);
                    })
                    .catch((error) => {
                        setLoading(false);
                        if(error.data && error.data.message) {
                            props.setError(error.data.message)
                        } else {
                            props.setError("An error occurred")
                        }
                    })
                })
                .catch((error) => {
                    setLoading(false);
                    if(error.data && error.data.message) {
                        props.setError(error.data.message)
                    } else {
                        props.setError("An error occurred")
                    }
                })
			})
			.catch((error) => {
				setLoading(false);
				if(error.data && error.data.message) {
					props.setError(error.data.message)
				} else {
					props.setError("An error occurred")
				}
			})
        }
    }
    const [pieData, setPieData] = React.useState([]);
    const [pieLabels, setPieLabels] = React.useState([]);
    const [pieDescriptions, setPieDescriptions] = React.useState([]);
    const [lineData, setLineData] = React.useState([
        {
            month: 'Jan', value: 0,
        },
        {
            month: 'Feb', value: 0,
        },
        {
            month: 'Mar', value: 0,
        },
        {
            month: 'Apr', value: 0,
        },
        {
            month: 'May', value: 0,
        },
        {
            month: 'Jun', value: 0,
        },
        {
            month: 'Jul', value: 0,
        },
        {
            month: 'Aug', value: 0,
        },
        {
            month: 'Sep', value: 0,
        },
        {
            month: 'Oct', value: 0,
        },
        {
            month: 'Nov', value: 0,
        },
        {
            month: 'Dec', value: 0,
        }
    ]);
    const markBreakDown = () => {
        setLoading(true);
        let api = new API();
        let startDate = new Date()
        startDate = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate(), 23, 59, 59, 999);
        api
        .post(`${ENDPOINT}/breakdown/new`, {
            "machineID": machine._id,
            startDate
        })
        .then((data) => {
            api
            .get(`${ENDPOINT}/machine/board?_id=${props.machineID}`)
            .then((data) => {
                setStatus(data.status);
                setMachine({...machine, name: data.machine.name});
                props.refreshMap();
                setLoading(false)
            })
            .catch((error) => {
                setLoading(false);
                if(error.data && error.data.message) {
                    props.setError(error.data.message);
                } else {
                    props.setError("An error occurred");
                }
            })
        })
        .catch((error) => {
            setLoading(false);
            if(error.data && error.data.message) {
                props.setError(error.data.message);
            } else {
                props.setError("An error occurred");
            }
        })
    }
    const undoBreakdown = () => {
        setLoading(true);
        let api = new API();
        api
        .put(`${ENDPOINT}/breakdown/undo`, {
            machineID: machine._id
        })
        .then((data) => {
            api
            .get(`${ENDPOINT}/machine/board?_id=${props.machineID}`)
            .then((data) => {
                setStatus(data.status);
                setMachine({...machine, name: data.machine.name});
                props.refreshMap()
                setLoading(false)
            })
            .catch((error) => {
                setLoading(false);
                if(error.data && error.data.message) {
                    props.setError(error.data.message);
                } else {
                    props.setError("An error occurred");
                }
            })
        })
        .catch((error) => {
            setLoading(false);
            if(error.data && error.data.message) {
                props.setError(error.data.message);
            } else {
                props.setError("An error occurred");
            }
        })
    }
    const finishMaintenance = () => {
        setLoading(true);
        let api = new API();
        api
        .put(`${ENDPOINT}/maintenance/finish`, {
            machineID: machine._id
        })
        .then((data) => {
            api
            .get(`${ENDPOINT}/machine/board?_id=${machine._id}`)
            .then((data) => {
                setStatus(data.status);
                setMachine({...machine, name: data.machine.name});
                props.refreshMap()
                setLoading(false)
            })
            .catch((error) => {
                setLoading(false);
                if(error.data && error.data.message) {
                    props.setError(error.data.message);
                } else {
                    props.setError("An error occurred");
                }
            })
        })
        .catch((error) => {
            setLoading(false);
            if(error.data && error.data.message) {
                props.setError(error.data.message);
            } else {
                props.setError("An error occurred");
            }
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
                                    <Grid style={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center"}} item xs={12} sm={12} md={12} lg={12}>
                                        <div style={{textDecoration: "none", backgroundColor: "white", width: "95%", height: "100%", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center", paddingTop: "10px", paddingBottom: "10px"}}>
                                            <Link style={{width: "100%", justifyContent: "center", display: "flex"}} to={`/metrics/${props.machineID}`}><Button variant="contained" color="primary" style={{width: "80%"}}>Edit metrics</Button></Link>
                                        </div>
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
                                                <option value={12}>YTD</option>
                                                <option value={0}>January</option>
                                                <option value={1}>February</option>
                                                <option value={2}>March</option>
                                                <option value={3}>April</option>
                                                <option value={4}>May</option>
                                                <option value={5}>June</option>
                                                <option value={6}>July</option>
                                                <option value={7}>August</option>
                                                <option value={8}>September</option>
                                                <option value={9}>October</option>
                                                <option value={10}>November</option>
                                                <option value={11}>December</option>
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
                                                    _.range(2013, currentYear+1).map(value => <option key={value} value={value}>{value}</option>)
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
                                            <Link style={{width: "100%", justifyContent: "center", display: "flex"}} to={`/schedule/${props.machineID}`}><Button variant="contained" color="primary" style={{width: "80%"}}>View Schedule</Button></Link>
                                        </div>
                                    </Grid>
                                    <Grid style={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center"}} item xs={12} sm={12} md={12} lg={12}>
                                        <div style={{backgroundColor: "white", width: "95%", height: "90%", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center"}}>
                                            { status === "MAINTENANCE" ? (
                                                <Button style={{width: "80%"}} onClick={finishMaintenance} variant="contained" color="primary">Finish maintenance</Button>
                                            ) : (
                                                <div style={{width: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}>
                                                    {
                                                        status === "MAINTENANCE2" ? (
                                                            <Button style={{width: "80%"}} disabled onClick={finishMaintenance} variant="contained" color="primary">Finish maintenance</Button>
                                                        ) : (
                                                            <div style={{width: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}>
                                                                { status === "EXCEED" ? (
                                                                    <Button style={{width: "80%"}} variant="contained" onClick={finishMaintenance} color="secondary">Finish maintenance</Button>
                                                                ) : (
                                                                    <div style={{width: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}>
                                                                        {
                                                                            status === "EXCEED2" ? (
                                                                                <Button style={{width: "80%"}} disabled variant="contained" onClick={finishMaintenance} color="secondary">Finish maintenance</Button>
                                                                            ) : (
                                                                                <div style={{width: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}>
                                                                                    { status === "BREAKDOWN" ? (
                                                                                        <Button style={{width: "80%"}} onClick={undoBreakdown} variant="contained" color="secondary">Undo breakdown</Button>
                                                                                    ) : (
                                                                                        <div style={{width: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}>
                                                                                            {
                                                                                                status === "BREAKDOWN2" ? (
                                                                                                    <Button style={{width: "80%"}} disabled onClick={undoBreakdown} variant="contained" color="secondary">Undo breakdown</Button>
                                                                                                ) : (
                                                                                                    <Button style={{width: "80%"}} onClick={markBreakDown} variant="contained" color="secondary">Mark as breakdown</Button>
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
                                        <div style={{backgroundColor: "white", paddingTop: "12px", paddingBottom: "12px", marginTop: "5px"}}>
                                            <h3 style={{display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "0px"}}><b>Overall Equipment Efficiency</b></h3>
                                            <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%'}}>
                                                {
                                                    OEE === null ? (
                                                        <div style={{height: 375, width: 220, display: "flex", justifyContent: "center", alignItems: "center"}}>
                                                            <p>No data</p>
                                                        </div>
                                                    ) : (
                                                        <Guage 
                                                        stageWidth={220}
                                                        stageHeight={375}
                                                        customSegmentStops={[OEEPoints.startLimit, OEEPoints.start, OEEPoints.end, OEEPoints.endLimit]}
                                                        segmentColors={["#ff0000", "#ff9900", "#00ff00"]}
                                                        value={OEE}
                                                        height={300}
                                                        width={120}
                                                        currentValue = {`${Math.round(OEE * 1000) / 10}%`}
                                                        />
                                                    )
                                                }
                                            </div>
                                        </div>
                                    </Grid>
                                    <Grid item xs={6} sm={6} md={6} lg={6}>
                                        <div style={{display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "white", width: "95%", marginTop: "5px", paddingTop: "10px"}} >
                                            {
                                                availabilty === null ? (
                                                    <div style={{height: 125, width: 160, display: "flex", justifyContent: "center", alignItems: "center"}}>
                                                        <p>No data</p>
                                                    </div>
                                                ) : (
                                                    <ReactSpeedometer
                                                        customSegmentStops={[availabilityPoints.startLimit, availabilityPoints.start, availabilityPoints.end, availabilityPoints.endLimit]}
                                                        segmentColors={["#ff0000", "#ff9900", "#00ff00"]}
                                                        value={availabilty}
                                                        height={120}
                                                        width={160}
                                                        minValue={availabilityPoints.startLimit}
                                                        maxValue={availabilityPoints.endLimit}
                                                        currentValueText={`Availability: ${Math.round(availabilty * 1000) / 10}%`}
                                                    />
                                                )
                                            }
                                        </div>
                                        <div style={{display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "white", width: "95%", marginTop: "9px", paddingTop: "10px"}}>
                                            {
                                                performance === null ? (
                                                    <div style={{height: 125, width: 160, display: "flex", justifyContent: "center", alignItems: "center"}}>
                                                        <p>No data</p>
                                                    </div>
                                                ) : (
                                                    <ReactSpeedometer
                                                        customSegmentStops={[performancePoints.startLimit, performancePoints.start, performancePoints.end, performancePoints.endLimit]}
                                                        segmentColors={["#ff0000", "#ff9900", "#00ff00"]}
                                                        value={performance}
                                                        height={120}
                                                        width={160}
                                                        minValue={performancePoints.startLimit}
                                                        maxValue={performancePoints.endLimit}
                                                        currentValueText={`Performance: ${Math.round(performance * 1000) / 10}%`}
                                                    />
                                                )
                                            }
                                        </div>
                                        <div style={{display: "flex", justifyContent: "center", alignItems: "center", backgroundColor: "white", width: "95%", marginTop: "9px", paddingTop: "10px"}}>
                                            {
                                                quality === null ? (
                                                    <div style={{height: 125, width: 160, display: "flex", justifyContent: "center", alignItems: "center"}}>
                                                        <p>No data</p>
                                                    </div>
                                                ) : (
                                                    <ReactSpeedometer
                                                        customSegmentStops={[qualityPoints.startLimit, qualityPoints.start, qualityPoints.end, qualityPoints.endLimit]}
                                                        segmentColors={["#ff0000", "#ff9900", "#00ff00"]}
                                                        value={quality}
                                                        height={120}
                                                        width={160}
                                                        minValue={qualityPoints.startLimit}
                                                        maxValue={qualityPoints.endLimit}
                                                        currentValueText={`Quality: ${Math.round(quality * 1000) / 10}%`}
                                                    />
                                                )
                                            }
                                        </div>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={6} sm={6} md={6} lg={6}>
                                <div style={{backgroundColor: "white", marginTop: "5px", height: "423px"}}>
                                    <h3 style={{display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "0px", marginTop: "0px", paddingTop: "20px", paddingBottom: "15px"}}><b>Top 12 components (By labour hours)</b></h3>
                                    <Clock 
                                    stageWidth = {700}
                                    stageHeight= {350}
                                    radius = {100}
                                    rectWidth = {150}
                                    rectHeight = {40}
                                    setError={props.setError}
                                    status={status}
                                    machineID={props.machineID}
                                    />
                                </div>
                            </Grid>
                        </Grid>
                        <Grid container>
                            <Grid item xs={6} sm={6} md={6} lg={6}>
                                <div style={{backgroundColor: "white", marginTop: "10px"}}>
                                    <h3 style={{display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "0px", marginTop: "0px", paddingTop: "15px", paddingBottom: "15px"}}><b>Labour hours composition by component</b></h3>
                                    {
                                        pieData.length === 0 ? (
                                            <div style={{height: 270, width: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}>
                                                <p>No data</p>
                                            </div>
                                        ) : (
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
                                                    colors={COLORS}
                                                    />
                                                </Grid>
                                                <Grid item xs={7} sm={7} lg={7} md={7}>
                                                    <Legend colors={COLORS} maxHeight={250} data={pieData} />
                                                </Grid>
                                            </Grid>
                                        )
                                    }
                                </div>
                            </Grid>
                            <Grid item xs={6} sm={6} md={6} lg={6}>
                                <div style={{backgroundColor: "white", marginTop: "10px", marginLeft: "20px"}}>
                                    <h3 style={{display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "0px", marginTop: "0px", paddingTop: "15px", paddingBottom: "15px"}}><b>Total labour hours</b></h3>
                                    <Line lineData={lineData} width={700} height={270} />
                                </div>
                            </Grid>
                        </Grid>
                    </div>
                )
            }
        </div>
    )
}