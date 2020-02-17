import React, {useState, useEffect} from 'react';
import { MonthView } from 'react-calendar';
import _ from "lodash";
import { makeStyles, createStyles } from '@material-ui/styles';
import { Grid, CircularProgress, FormControl, Select, Theme, Button, TextField } from '@material-ui/core';
import { ENDPOINT } from "../utils/config";
import API from "../utils/API";
import DropdownList from 'react-widgets/lib/DropdownList'
import 'react-widgets/dist/css/react-widgets.css';
import ProductivityMenu  from "./ProductivityMenu"

const monthss = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

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
      extendedIcon: {
        marginRight: theme.spacing(1),
      },
  }),
);

export default function RosterEdit(props) {
    const classes = useStyles({});
    const [months, setMonths] = useState([]);
    const [year, setYear] = useState(new Date().getFullYear());
    const [selectedDate, setSelectedDate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [weekend, setWeekend] = useState(true);
    const [sectionData, setSectionData] = useState([]);
    const [formData, setFormData] = useState({
        shift1IC: "",
        shift1ICSection: "",
        shift2IC: "",
        shift2ICSection: "",
        shift3IC: "",
        shift3ICSection: "",
        weekendIC: ""
    })

    useEffect(() => {
        async function initialize() {
            let temp = [];
            for (let monthIndex = 0; monthIndex < 12; monthIndex += 1) {
                temp.push(
                    <Grid item xs={3} sm={3} md={3} lg={3} style={{padding: "7px"}}>
                        <h2 style={{marginTop: "0px", marginBottom: "0px"}}>{monthss[monthIndex]}</h2>
                        <MonthView onClick={(value) => handleSelectedDateChange(value)} activeStartDate={new Date(new Date().getFullYear(), monthIndex)} />
                    </Grid>
                );
            }
            setMonths(temp);
            let api = new API();
            api
            .get(`${ENDPOINT}/section`)
            .then((data) => {
                let sectionData = [];
                data.sections.forEach((section, index) => {
                    if(section.name !== 'ROOT') {
                        sectionData.push({name: section.name, _id: section._id});
                    }
                })
                setSectionData(sectionData);
                setLoading(false);
            })
            .catch(err => {
                setLoading(false);
                if(err.data && err.data.message) {
                    props.setError(err.data.message);
                } else {
                    props.setError("An error occurred")
                }
            });
        }
        initialize();
    }, []);

    const handleYearChange = async (event) => {
        setLoading(true);
        let currentYear = event.target.value
        setYear(currentYear)
        let temp = [];
        for (let monthIndex = 0; monthIndex < 12; monthIndex += 1) {
            temp.push(
                <Grid item xs={3} sm={3} md={3} lg={3} style={{padding: "7px"}}>
                    <h2 style={{marginTop: "0px", marginBottom: "0px"}}>{monthss[monthIndex]}</h2>
                    <MonthView onClick={(value) => handleSelectedDateChange(value)} activeStartDate={new Date(currentYear, monthIndex)} />
                </Grid>
            );
        }
        setMonths(temp);
        setLoading(false);
    }

    const handleSelectedDateChange = (date: Date) => {
        setLoading(true);
        console.log(date);
        let api = new API()
        if(isWeekend(date)) {
            setWeekend(true);
        } else {
            setWeekend(false);
        }
        api
        .post(`${ENDPOINT}/roster/get`, {
            date
        })
        .then((data) => {
            if(data.roster) {
                setFormData({...formData,
                    shift1IC: data.roster.shift1IC,
                    shift1ICSection: data.roster.shift1ICSection,
                    shift2IC: data.roster.shift2IC,
                    shift2ICSection: data.roster.shift2ICSection,
                    shift3IC: data.roster.shift3IC,
                    shift3ICSection: data.roster.shift3ICSection,
                    weekendIC: data.roster.weekendIC
                })
            } else {
                setFormData({...formData,
                    shift1IC: "",
                    shift1ICSection: "",
                    shift2IC: "",
                    shift2ICSection: "",
                    shift3IC: "",
                    shift3ICSection: "",
                    weekendIC: ""
                })
            }
            setSelectedDate(date);
            setLoading(false);
        })
        .catch((error) => {
            if(error.data && error.data.message) {
                props.setError(error.data.message)
            } else {
                props.setError("An error occurred")
            }
            setLoading(false);
        })
    }

    const save  = () => {
        setLoading(true);
        let api = new API();
        api
        .post(`${ENDPOINT}/roster`, {
            date: selectedDate,
            shift1IC: formData.shift1IC,
            shift1ICSection: formData.shift1ICSection,
            shift2IC: formData.shift2IC,
            shift2ICSection: formData.shift2ICSection,
            shift3IC: formData.shift3IC,
            shift3ICSection: formData.shift3ICSection,
            weekendIC: formData.weekendIC
        })
        .then((data) => {
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
    }

    return (
        <div style={{width: "100%", height: "100%"}}>
            <ProductivityMenu />
            { loading ? (
                <div style={{width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}>
                    <CircularProgress size={50} />
                </div>
            ) : (
                <div>
                    <div style={{marginTop: "15px"}}></div>
                    <Grid container>
                        <Grid item xs={9} sm={9} md={9} lg={9}>
                            <Grid container>
                                {months}
                            </Grid>
                        </Grid>
                        <Grid style={{padding: "10px"}} item xs={3} sm={3} md={3} lg={3}>
                                <FormControl variant="outlined" className={classes.formControl}>
                                    <Select
                                    native
                                    value={year}
                                    onChange={(event) => handleYearChange(event)}
                                    inputProps={{
                                        name: 'year',
                                        id: 'outlined-year-native-simple',
                                    }}
                                    >   
                                        {
                                            _.range(2013, new Date().getFullYear()+2).map(value => <option key={value} value={value}>{value}</option>)
                                        }
                                    </Select>
                                </FormControl>
                                {selectedDate !== null ?  (
                                    <div>
                                        {
                                            weekend ? (
                                                <div style={{margin: "20px", border: "1px solid black", borderRadius: "20px"}}>
                                                    <h2 style={{marginBottom: "5px", marginTop: "5px", fontSize: 30}}><b>Weekend Overtime In-charge (IC)</b></h2>
                                                    <hr />
                                                    <h3>{selectedDate.toDateString()}</h3>
                                                    <div style={{marginTop: "20px"}}></div>
                                                    <TextField style={{width: "80%"}} value={formData.weekendIC} onChange={(event) => {setFormData({...formData, weekendIC: event.target.value})}} id="outlined-basic" label="Name" variant="outlined" />
                                                    <div style={{marginTop: "20px"}}></div>
                                                    <div style={{marginTop: "20px", backgroundColor: "white", width: "100%", height: "90%", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center"}}>
                                                        <Button style={{width: "80%"}} variant="contained" onClick={save} color="primary">Save</Button>
                                                    </div>
                                                    <div style={{marginTop: "30px"}}></div>
                                                </div>
                                            ) : (
                                                <div style={{margin: "20px", border: "1px solid black", borderRadius: "20px"}}>
                                                    <h2 style={{marginBottom: "5px", marginTop: "5px", fontSize: 30}}><b>In-charge (IC) details</b></h2>
                                                    <hr />
                                                    <h3>{selectedDate.toDateString()}</h3>
                                                    <div style={{marginTop: "20px"}}></div>
                                                    <TextField style={{width: "80%"}} value={formData.shift1IC} onChange={(event) => {setFormData({...formData, shift1IC: event.target.value})}} id="outlined-basic" label="Shift 1 IC" variant="outlined" />
                                                    <div style={{marginTop: "20px"}}></div>
                                                    <div style={{width: "100%", display: "flex", justifyContent: "center"}}>
                                                        <div style={{width: "80%"}}>
                                                            <DropdownList 
                                                            filter="contains"
                                                            data={sectionData}
                                                            value={formData.shift1ICSection}
                                                            textField="name"
                                                            valueField="name"
                                                            onChange={value => {
                                                                setFormData({...formData, shift1ICSection: value.name});
                                                            }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div style={{marginTop: "20px"}}></div>
                                                    <TextField style={{width: "80%"}} value={formData.shift2IC} onChange={(event) => {setFormData({...formData, shift2IC: event.target.value})}} id="outlined-basic" label="Shift 2 IC" variant="outlined" />
                                                    <div style={{marginTop: "20px"}}></div>
                                                    <div style={{width: "100%", display: "flex", justifyContent: "center"}}>
                                                        <div style={{width: "80%"}}>
                                                            <DropdownList 
                                                            filter="contains"
                                                            data={sectionData}
                                                            value={formData.shift2ICSection}
                                                            textField="name"
                                                            valueField="name"
                                                            onChange={value => {
                                                                setFormData({...formData, shift2ICSection: value.name});
                                                            }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div style={{marginTop: "20px"}}></div>
                                                    <TextField style={{width: "80%"}} value={formData.shift3IC} onChange={(event) => {setFormData({...formData, shift3IC: event.target.value})}} id="outlined-basic" label="Shift 3 IC" variant="outlined" />
                                                    <div style={{marginTop: "20px"}}></div>
                                                    <div style={{width: "100%", display: "flex", justifyContent: "center"}}>
                                                        <div style={{width: "80%"}}>
                                                            <DropdownList 
                                                            filter="contains"
                                                            data={sectionData}
                                                            value={formData.shift3ICSection}
                                                            textField="name"
                                                            valueField="name"
                                                            onChange={value => {
                                                                setFormData({...formData, shift3ICSection: value.name});
                                                            }}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div style={{marginTop: "20px"}}></div>
                                                    <div style={{marginTop: "20px", backgroundColor: "white", width: "100%", height: "90%", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center"}}>
                                                        <Button style={{width: "80%"}} variant="contained" onClick={save} color="primary">Save</Button>
                                                    </div>
                                                    <div style={{marginTop: "30px"}}></div>
                                                </div>
                                            )
                                        }
                                    </div>
                                ) : (
                                    <div style={{marginTop: "20px"}}><h3>Click on a date to begin</h3></div>
                                )}
                        </Grid>
                    </Grid>      
                </div>
            )}
        </div>
    );
}

function isWeekend(d: Date) {
    var day = d.getDay();
    return (day === 6) || (day === 0); 
}