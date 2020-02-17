import React from 'react';
import Superman from '../images/Superman.jpg';
import { Grid} from '@material-ui/core';
import { ENDPOINT } from "../utils/config";
import API from "../utils/API";
import ProductivityMenu  from "./ProductivityMenu"

const months = {
    0: "January",
    1: "February",
    2: "March",
    3: "April",
    4: "May",
    5: "June",
    6: "July",
    7: "August",
    8: "September",
    9: "October",
    10: "November",
    11: "December"
}

const monthss = {
    0: "Jan",
    1: "Feb",
    2: "Mar",
    3: "Apr",
    4: "May",
    5: "Jun",
    6: "Jul",
    7: "Aug",
    8: "Sep",
    9: "Oct",
    10: "Nov",
    11: "Dec"
}

const Time = (props) => {
    const [currentTime, setCurrentTime] = React.useState(String(new Date().getHours()).padStart(2, '0') + ":" + String(new Date().getMinutes()).padStart(2, '0') + ":" + String(new Date().getSeconds()).padStart(2, '0'));
    React.useEffect(() => {
        setTimeout(() => {
            setCurrentTime(String(new Date().getHours()).padStart(2, '0') + ":" + String(new Date().getMinutes()).padStart(2, '0') + ":" + String(new Date().getSeconds()).padStart(2, '0'));
        }, 1000);
    }, [currentTime])
    return (
        <div style={{width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center"}}>
            <h1 style={{color: "white", fontSize: props.fontSize}}>{currentTime}</h1>
        </div>
    )
}

const Calendar = (props) => {
    return(
        <div style={{width: "100%", height: "100%", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center"}}>
            <div style={{backgroundColor: "red", display: "flex", alignItems: "center", justifyContent: "center", height: "50px", width: "180px", borderRadius: "15px 15px 0px 0px"}}>
                <h1 style={{marginBottom: "0px", color: "white"}}>{months[new Date().getMonth()]}</h1>
            </div>
            <div style={{backgroundColor: "white", display: "flex", alignItems: "center", justifyContent: "center", height: "120px", width: "180px", borderRadius: "0px 0px 15px 15px"}}>
                <h1 style={{marginBottom: "0px", fontSize: 60}}>{new Date().getDate()}</h1>
            </div>
        </div>
    )
}

export default function Roster(props) {
    const [tableData, setTableData] = React.useState({
        shift1IC: "",
        shift1ICSection: "",
        shift2IC: "",
        shift2ICSection: "",
        shift3IC: "",
        shift3ICSection: ""
    })
    const [saturdayIC, setSaturdayIC] = React.useState("");
    const [sundayIC, setSundayIC] = React.useState("");
    React.useEffect(() => {
        async function initialize() {
            var saturday = getNextDayOfWeek(new Date(), 6);
            var sunday = getNextDayOfWeek(new Date(), 7);
            let api = new API();
            try {
                await new Promise((resolve, reject) => {
                    api
                    .post(`${ENDPOINT}/roster/get`, {
                        date: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 0, 0, 0, 0)
                    })
                    .then((data) => {
                        if(data.roster) {
                            console.log(data.roster.shift1IC);
                            setTableData({...tableData,
                                shift1IC: data.roster.shift1IC,
                                shift1ICSection: data.roster.shift1ICSection,
                                shift2IC: data.roster.shift2IC,
                                shift2ICSection: data.roster.shift2ICSection,
                                shift3IC: data.roster.shift3IC,
                                shift3ICSection: data.roster.shift3ICSection
                            })
                        } else {
                            setTableData({...tableData,
                                shift1IC: "",
                                shift1ICSection: "",
                                shift2IC: "",
                                shift2ICSection: "",
                                shift3IC: "",
                                shift3ICSection: ""
                            })
                        }
                        resolve();
                    })
                    .catch(err => {
                        reject(err);
                    });
                })
            } catch (err) {
                if(err.data && err.data.message) {
                    props.setError(err.data.message);
                } else {
                    props.setError("An error occurred")
                }
            }
            try {
                await new Promise((resolve, reject) => {
                    api
                    .post(`${ENDPOINT}/roster/get`, {
                        date: saturday
                    })
                    .then((data) => {
                        if(data.roster) {
                            setSaturdayIC(data.roster.weekendIC)
                        } 
                        resolve();
                    })
                    .catch(err => {
                        reject(err);
                    });
                })
            } catch (err) {
                if(err.data && err.data.message) {
                    props.setError(err.data.message);
                } else {
                    props.setError("An error occurred")
                }
            }
            api
            .post(`${ENDPOINT}/roster/get`, {
                date: sunday
            })
            .then((data) => {
                if(data.roster) {
                    setSundayIC(data.roster.weekendIC)
                } 
            })
            .catch(err => {
                if(err.data && err.data.message) {
                    props.setError(err.data.message);
                } else {
                    props.setError("An error occurred")
                }
            });
        }
        initialize()
    }, []);
    return(
        <div style={{width: "100%", height: "100%", backgroundColor: "black", display: "flex", flexDirection: "column", justifyContent: "space-between"}}>
            <ProductivityMenu />
            <Grid container>
                <Grid item xs={4} sm={4} md={4} lg={4}>
                    <Time fontSize={40} />
                </Grid>
                <Grid item xs={4} sm={4} md={4} lg={4}>
                    <img src={Superman} alt="Superman" height="auto" width="100%" />
                </Grid>
                <Grid item xs={4} sm={4} md={4} lg={4}>
                    <Calendar />
                </Grid>
            </Grid>
            <div>
                <div style={{display: "flex", justifyContent: "center", alignItems: "center", height: "50px", paddingTop: "40px", paddingBottom: "40px"}}>
                    <h1 style={{marginBottom: "0px", color: "white", fontSize: 50}}>DAILY OVERTIME IN-CHARGE (IC)</h1>
                </div>
                <table style={{width: "100%"}}>
                    <tr>
                        <th style={{color: "white", textAlign: "left", paddingLeft: "40px", fontSize: 40, width: "400px"}}>SHIFT:</th>
                        <th style={{color: "white", textAlign: "center", padding: "5px", fontSize: 40}}>1st SHIFT</th>
                        <th style={{color: "white", textAlign: "center", padding: "5px", fontSize: 40}}>2nd SHIFT</th>
                        <th style={{color: "white", textAlign: "center", padding: "5px", fontSize: 40}}>3rd SHIFT</th>
                    </tr>
                    <tr>
                        <th style={{color: "white", textAlign: "left", paddingLeft: "40px", fontSize: 40, width: "400px"}}>IN-CHARGE (IC)</th>
                        <td style={{color: "white", textAlign: "center", backgroundColor: "#353434", padding: "5px", fontSize: 40}}>{tableData.shift1IC ? tableData.shift1IC : "NIL"}</td>
                        <td style={{color: "white", textAlign: "center", backgroundColor: "#353434", padding: "5px", fontSize: 40}}>{tableData.shift2IC ? tableData.shift2IC : "NIL"}</td>
                        <td style={{color: "white", textAlign: "center", backgroundColor: "#353434", padding: "5px", fontSize: 40}}>{tableData.shift3IC ? tableData.shift3IC : "NIL"}</td>
                    </tr>
                    <tr>
                        <th style={{color: "white", textAlign: "left", paddingLeft: "40px", fontSize: 40, width: "400px"}}>SECTION:</th>
                        <td style={{color: "white", textAlign: "center", backgroundColor: "#353434", padding: "5px", fontSize: 40}}>{tableData.shift1ICSection ? tableData.shift1ICSection : "NIL"}</td>
                        <td style={{color: "white", textAlign: "center", backgroundColor: "#353434", padding: "5px", fontSize: 40}}>{tableData.shift2ICSection ? tableData.shift2ICSection : "NIL"}</td>
                        <td style={{color: "white", textAlign: "center", backgroundColor: "#353434", padding: "5px", fontSize: 40}}>{tableData.shift3ICSection ? tableData.shift3ICSection : "NIL"}</td>
                    </tr>
                </table>
                <div style={{backgroundColor: "#50717E", display: "flex", justifyContent: "center", alignItems: "center", height: "50px", paddingTop: "40px", paddingBottom: "40px"}}>
                    <h1 style={{marginBottom: "0px", color: "white", fontSize: 50}}>WEEKENDS OVERTIME IN-CHARGE (IC)</h1>
                </div>
                <table style={{width: "100%"}}>
                    <tr>
                        <th style={{color: "white", textAlign: "left", paddingLeft: "40px", fontSize: 40, width: "400px", backgroundColor: "#50717E"}}>SATURDAY:</th>
                        <th style={{color: "white", textAlign: "center", padding: "5px", fontSize: 40, backgroundColor: "#50717E"}}>{`${getNextDayOfWeek(new Date(), 6).getDate()} ${monthss[getNextDayOfWeek(new Date(), 6).getMonth()]} ${getNextDayOfWeek(new Date(), 6).getFullYear()}`}</th>
                        <td style={{color: "black", textAlign: "center", backgroundColor: "#BEE9E4", padding: "5px", fontSize: 40}}>{saturdayIC ? saturdayIC : "NIL"}</td>
                    </tr>
                    <tr>
                        <th style={{color: "white", textAlign: "left", paddingLeft: "40px", fontSize: 40, width: "400px", backgroundColor: "#50717E"}}>SUNDAY:</th>
                        <th style={{color: "white", textAlign: "center", padding: "5px", fontSize: 40, backgroundColor: "#50717E"}}>{`${getNextDayOfWeek(new Date(), 7).getDate()} ${monthss[getNextDayOfWeek(new Date(), 7).getMonth()]} ${getNextDayOfWeek(new Date(), 7).getFullYear()}`}</th>
                        <td style={{color: "black", textAlign: "center", backgroundColor: "#BEE9E4", padding: "5px", fontSize: 40}}>{sundayIC ? sundayIC : "NIL"}</td>
                    </tr>
                </table>
            </div>
        </div>
    )
}

function getNextDayOfWeek(date, dayOfWeek) {

    var resultDate = new Date(date.getTime());

    resultDate.setDate(date.getDate() + (7 + dayOfWeek - date.getDay()) % 7);

    return new Date(resultDate.getFullYear(), resultDate.getMonth(), resultDate.getDate(), 0, 0, 0, 0);
}