import React, {useState, useEffect} from 'react';
import './Schedule.css'
import { MonthView } from 'react-calendar';
import _ from "lodash";
import { makeStyles, createStyles } from '@material-ui/styles';
import { Grid, CircularProgress, Fab, Typography, FormControl, Select, Theme, Button, FormControlLabel, Checkbox } from '@material-ui/core';
import DateRangePicker from '@wojtekmaj/react-daterange-picker';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import ScheduleIcon from '@material-ui/icons/Schedule';
import { ENDPOINT } from "../utils/config";
import API from "../utils/API";
import DropdownList from 'react-widgets/lib/DropdownList'
import 'react-widgets/dist/css/react-widgets.css';
import { confirmAlert } from 'react-confirm-alert'; 
import 'react-confirm-alert/src/react-confirm-alert.css'; 

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

export default function Schedule(props) {
    const classes = useStyles({});
    const [months, setMonths] = useState([]);
    const [maintenanceData, setMaintenanceData] = useState(new Map());
    const [formStartDate, setFormStartDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 23, 59, 59, 999));
    const [formEndDate, setFormEndDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 23, 59, 59, 999));
    const [formActualEndDate, setFormActualEndDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 23, 59, 59, 999));
    const [formID, setFormID] = useState("");
    const [breakdownData, setBreakdownData] = useState({
        _id: "",
        startDate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 23, 59, 59, 999),
        endDate: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 23, 59, 59, 999)
    });
    const [year, setYear] = useState(new Date().getFullYear());
    const [date, setDate] = useState([new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 23, 59, 59, 999), new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 23, 59, 59, 999)]);
    const [breakdownDate, setBreakdownDate] = useState([new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 23, 59, 59, 999), new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 23, 59, 59, 999)]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [machine, setMachine] = useState("");
    const [machineData, setMachineData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [checked, setChecked] = useState(true);
    const [breakdownChecked, setBreakdownChecked] = useState(true);

    useEffect(() => {
        async function initialize() {
            let api = new API();
            try {
                await new Promise((resolve, reject) => {
                    api
                    .get(`${ENDPOINT}/machine`)
                    .then((data) => {
                        let machineData = [];
                        data.machines.forEach((machine, index) => {
                            machineData.push({name: machine.name, _id: machine._id});
                        })
                        setMachineData(machineData);
                        resolve();
                    })
                    .catch((error) => {
                        reject(error);
                    })
                })
            } catch (error) {
                setLoading(false);
                props.setError(error.data.message);
            }
            if(props.match.params.machineID) {
                setMachine(props.match.params.machineID)
                try {
                    await updateCalendar(props.match.params.machineID, new Date().getFullYear());
                } catch(error) {
                    setLoading(false);
                    props.setError(error.data.message);
                }
            } else {
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
            }
            setLoading(false);
        }
        initialize();
    }, []);

    const updateCalendar = (machineID, year) => {
        return new Promise(async (resolve, reject) => {
            let api = new API();
            let temp = [];
            try {
                let maintenances = await new Promise((resolve, reject) => {
                    api
                    .post(`${ENDPOINT}/maintenance/year`, {
                        machineID,
                        year
                    })
                    .then((data) => {
                        resolve(data.maintenances);
                    })
                    .catch((error) => {
                        reject(error);
                    })
                })
                let breakdowns = await new Promise((resolve, reject) => {
                    api
                    .post(`${ENDPOINT}/breakdown/year`, {
                        machineID,
                        year
                    })
                    .then((data) => {
                        resolve(data.breakdowns);
                    })
                    .catch((error) => {
                        reject(error);
                    })
                })
                let dateMap = new Map();
                maintenanceData.forEach((value, key) => {
                    setMaintenanceData(new Map(maintenanceData.set(key, undefined)));
                })
                //@ts-ignore
                maintenances.forEach((maintenance) => {
                    let tempObj = {maintenance, type: "MAINTENANCE"}
                    if(maintenance.actualEndDate && (new Date(maintenance.actualEndDate) <= new Date(maintenance.endDate))) {
                        for (let d = new Date(maintenance.startDate); d <= new Date(maintenance.actualEndDate); d.setDate(d.getDate() + 1)) {
                            dateMap.set(`${d.getDate()},${d.getMonth()}`, "maintenance");
                            setMaintenanceData(new Map(maintenanceData.set(`${d.getDate()},${d.getMonth()}`, tempObj)));
                        }
                    } else {
                        for (let d = new Date(new Date(maintenance.startDate).getFullYear(), new Date(maintenance.startDate).getMonth(), new Date(maintenance.startDate).getDate(), 23, 59, 59, 999); d <= new Date(new Date(maintenance.endDate).getFullYear(), new Date(maintenance.endDate).getMonth(), new Date(maintenance.endDate).getDate(), 23, 59, 59, 999); d.setDate(d.getDate() + 1)) {
                            dateMap.set(`${d.getDate()},${d.getMonth()}`, "maintenance");
                            setMaintenanceData(new Map(maintenanceData.set(`${d.getDate()},${d.getMonth()}`, tempObj)));
                        }
                    }
                })
                //@ts-ignore
                breakdowns.forEach((breakdown) => {
                    let tempObj = {breakdown, type: "BREAKDOWN"}
                    if(breakdown.endDate) {
                        let d = new Date(new Date(breakdown.startDate).getFullYear(), new Date(breakdown.startDate).getMonth(), new Date(breakdown.startDate).getDate(), 23, 59, 59, 999);
                        let end = new Date(new Date(breakdown.endDate).getFullYear(), new Date(breakdown.endDate).getMonth(), new Date(breakdown.endDate).getDate(), 23, 59, 59, 999);
                        let yearEndDate = new Date(year, 12, 0, 23, 59, 59, 999)
                        if(end >= yearEndDate) {
                            while(!dateMap.get(`${d.getDate()},${d.getMonth()}`) && d <= yearEndDate) {
                                dateMap.set(`${d.getDate()},${d.getMonth()}`, "alert");
                                setMaintenanceData(new Map(maintenanceData.set(`${d.getDate()},${d.getMonth()}`, tempObj)));
                                d.setDate(d.getDate() + 1);
                            }
                        } else {
                            while(!dateMap.get(`${d.getDate()},${d.getMonth()}`) && d <= end) {
                                dateMap.set(`${d.getDate()},${d.getMonth()}`, "alert");
                                setMaintenanceData(new Map(maintenanceData.set(`${d.getDate()},${d.getMonth()}`, tempObj)));
                                d.setDate(d.getDate() + 1);
                            }
                        }
                    } else {
                        let currentDate = new Date()
                        currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 23, 59, 59, 999);
                        if(new Date(breakdown.startDate) >= currentDate) {
                            if(!dateMap.get(`${currentDate.getDate()},${currentDate.getMonth()}`)) {
                                dateMap.set(`${currentDate.getDate()},${currentDate.getMonth()}`, "alert");
                                setMaintenanceData(new Map(maintenanceData.set(`${currentDate.getDate()},${currentDate.getMonth()}`, tempObj)));
                            }
                        } else {
                            let d = new Date(breakdown.startDate);
                            d = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
                            let end = new Date(year, 12, 0, 23, 59, 59, 999);
                            while(!dateMap.get(`${d.getDate()},${d.getMonth()}`) && d < end) {
                                dateMap.set(`${d.getDate()},${d.getMonth()}`, "alert");
                                setMaintenanceData(new Map(maintenanceData.set(`${d.getDate()},${d.getMonth()}`, tempObj)));
                                d.setDate(d.getDate() + 1);
                            }
                        }
                    }
                })
                //@ts-ignore
                maintenances.forEach((maintenance) => {
                    let tempObj = {maintenance, type: "MAINTENANCE"}
                    if(maintenance.actualEndDate) {
                        if(new Date(maintenance.actualEndDate) > new Date(maintenance.endDate)) {
                            let d = new Date(maintenance.endDate);
                            d = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
                            let end = new Date(maintenance.actualEndDate);
                            end = new Date(end.getFullYear(), end.getMonth(), end.getDate(), 23, 59, 59, 999);
                            d.setDate(d.getDate() + 1);
                            while(!dateMap.get(`${d.getDate()},${d.getMonth()}`) && d <= end) {
                                dateMap.set(`${d.getDate()},${d.getMonth()}`, "alert");
                                setMaintenanceData(new Map(maintenanceData.set(`${d.getDate()},${d.getMonth()}`, tempObj)));
                                d.setDate(d.getDate() + 1);
                            }
                        }
                    } else {
                        let d = new Date(maintenance.endDate);
                        d = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
                        let end = new Date();
                        end = new Date(end.getFullYear(), end.getMonth(), end.getDate(), 23, 59, 59, 999);
                        let yearEndDate = new Date(d.getFullYear(), 12, 0, 23, 59, 59, 999)
                        if(end > yearEndDate) {
                            end = yearEndDate
                        }
                        let currentDate = new Date()
                        currentDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate(), 23, 59, 59, 999);
                        if(d < currentDate) {
                            d.setDate(d.getDate() + 1);
                            while(!dateMap.get(`${d.getDate()},${d.getMonth()}`) && d <= end) {
                                dateMap.set(`${d.getDate()},${d.getMonth()}`, "alert");
                                setMaintenanceData(new Map(maintenanceData.set(`${d.getDate()},${d.getMonth()}`, tempObj)));
                                d.setDate(d.getDate() + 1);
                            }
                        }
                    }
                })
                for (let monthIndex = 0; monthIndex < 12; monthIndex += 1) {
                    temp.push(
                        <Grid item xs={3} sm={3} md={3} lg={3} style={{padding: "7px"}}>
                            <h2 style={{marginTop: "0px", marginBottom: "0px"}}>{monthss[monthIndex]}</h2>
                            <MonthView tileClassName={({ date, view }) => ((view === 'month') && (dateMap.get(`${date.getDate()},${date.getMonth()}`))) ? dateMap.get(`${date.getDate()},${date.getMonth()}`) : null} onClick={(value) => handleSelectedDateChange(value)} activeStartDate={new Date(new Date().getFullYear(), monthIndex)} />
                        </Grid>
                    );
                }
                setMonths(temp);
                resolve();
            } catch (error) {
                reject(error);
            }
        })
    }

    const handleYearChange = async (event) => {
        setLoading(true);
        let currentYear = event.target.value
        setYear(currentYear)
        if(machine) {
            try {
                await updateCalendar(machine, currentYear);
            } catch(error) {
                setLoading(false);
                props.setError(error.data.message);
            }
            try {
                if(selectedDate !== null) {
                    if((maintenanceData.get(`${selectedDate.getDate()},${selectedDate.getMonth()}`)) !== undefined) {
                        if(maintenanceData.get(`${selectedDate.getDate()},${selectedDate.getMonth()}`).type === "MAINTENANCE") {
                            setFormID(maintenanceData.get(`${selectedDate.getDate()},${selectedDate.getMonth()}`).maintenance._id);
                            setFormStartDate(new Date(maintenanceData.get(`${selectedDate.getDate()},${selectedDate.getMonth()}`).maintenance.startDate));
                            setFormEndDate(new Date(maintenanceData.get(`${selectedDate.getDate()},${selectedDate.getMonth()}`).maintenance.endDate));
                            setFormActualEndDate((maintenanceData.get(`${selectedDate.getDate()},${selectedDate.getMonth()}`).maintenance.actualEndDate) ? new Date(maintenanceData.get(`${selectedDate.getDate()},${selectedDate.getMonth()}`).maintenance.actualEndDate) : new Date(maintenanceData.get(`${selectedDate.getDate()},${selectedDate.getMonth()}`).maintenance.startDate))
                        } else {
                            setBreakdownData({
                                ...breakdownData, 
                                _id: maintenanceData.get(`${selectedDate.getDate()},${selectedDate.getMonth()}`).breakdown._id,
                                startDate: new Date(maintenanceData.get(`${selectedDate.getDate()},${selectedDate.getMonth()}`).breakdown.startDate),
                                endDate: (maintenanceData.get(`${selectedDate.getDate()},${selectedDate.getMonth()}`).breakdown.endDate) ? new Date(maintenanceData.get(`${selectedDate.getDate()},${selectedDate.getMonth()}`).breakdown.endDate) : new Date(maintenanceData.get(`${selectedDate.getDate()},${selectedDate.getMonth()}`).breakdown.startDate)
                            })
                        }
                    }
                }
            } catch (error) {
                setLoading(false);
                props.setError(error);
            }
        } else {
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
        }
        setLoading(false);
    }

    const handleMachineChange = async (machineID) => {
        setMachine(machineID)
        setLoading(true);
        try {
            await updateCalendar(machineID, year);
        } catch(error) {
            setLoading(false);
            props.setError(error.data.message);
        }
        try {
            if(selectedDate !== null) {
                if((maintenanceData.get(`${selectedDate.getDate()},${selectedDate.getMonth()}`)) !== undefined) {
                    if(maintenanceData.get(`${selectedDate.getDate()},${selectedDate.getMonth()}`).type === "MAINTENANCE") {
                        setFormID(maintenanceData.get(`${selectedDate.getDate()},${selectedDate.getMonth()}`).maintenance._id);
                        setFormStartDate(new Date(maintenanceData.get(`${selectedDate.getDate()},${selectedDate.getMonth()}`).maintenance.startDate));
                        setFormEndDate(new Date(maintenanceData.get(`${selectedDate.getDate()},${selectedDate.getMonth()}`).maintenance.endDate));
                        setFormActualEndDate((maintenanceData.get(`${selectedDate.getDate()},${selectedDate.getMonth()}`).maintenance.actualEndDate) ? new Date(maintenanceData.get(`${selectedDate.getDate()},${selectedDate.getMonth()}`).maintenance.actualEndDate) : new Date(maintenanceData.get(`${selectedDate.getDate()},${selectedDate.getMonth()}`).maintenance.startDate))
                    } else {
                        setBreakdownData({
                            ...breakdownData, 
                            _id: maintenanceData.get(`${selectedDate.getDate()},${selectedDate.getMonth()}`).breakdown._id,
                            startDate: new Date(maintenanceData.get(`${selectedDate.getDate()},${selectedDate.getMonth()}`).breakdown.startDate),
                            endDate: (maintenanceData.get(`${selectedDate.getDate()},${selectedDate.getMonth()}`).breakdown.endDate) ? new Date(maintenanceData.get(`${selectedDate.getDate()},${selectedDate.getMonth()}`).breakdown.endDate) : new Date(maintenanceData.get(`${selectedDate.getDate()},${selectedDate.getMonth()}`).breakdown.startDate)
                        })
                    }
                }
            }
        } catch (error) {
            setLoading(false);
            props.setError(error);
        }
        setLoading(false);
    }

    const onDateChange = (date) => {
        setDate(date);
    }

    const onBreakdownDateChange = (date) => {
        setBreakdownDate(date);
    }

    const handleSelectedDateChange = (date: Date) => {
        if((maintenanceData.get(`${date.getDate()},${date.getMonth()}`)) !== undefined) {
            if(maintenanceData.get(`${date.getDate()},${date.getMonth()}`).type === "MAINTENANCE") {
                setFormID(maintenanceData.get(`${date.getDate()},${date.getMonth()}`).maintenance._id);
                setFormStartDate(new Date(maintenanceData.get(`${date.getDate()},${date.getMonth()}`).maintenance.startDate));
                setFormEndDate(new Date(maintenanceData.get(`${date.getDate()},${date.getMonth()}`).maintenance.endDate));
                setFormActualEndDate((maintenanceData.get(`${date.getDate()},${date.getMonth()}`).maintenance.actualEndDate) ? new Date(maintenanceData.get(`${date.getDate()},${date.getMonth()}`).maintenance.actualEndDate) : new Date(maintenanceData.get(`${date.getDate()},${date.getMonth()}`).maintenance.startDate))
            } else {
                setBreakdownData({
                    ...breakdownData, 
                    _id: maintenanceData.get(`${date.getDate()},${date.getMonth()}`).breakdown._id,
                    startDate: new Date(maintenanceData.get(`${date.getDate()},${date.getMonth()}`).breakdown.startDate),
                    endDate: (maintenanceData.get(`${date.getDate()},${date.getMonth()}`).breakdown.endDate) ? new Date(maintenanceData.get(`${date.getDate()},${date.getMonth()}`).breakdown.endDate) : new Date(maintenanceData.get(`${date.getDate()},${date.getMonth()}`).breakdown.startDate)
                })
            }
        }
        setSelectedDate(date);
    }

    const scheduleMaintenance = async () => {
        setLoading(true);
        let api = new API();
        try {
            await new Promise((resolve, reject) => {
                api
                .post(`${ENDPOINT}/maintenance/new`, {
                  machineID: machine, 
                  startDate: date[0],
                  endDate: date[1]
                })
                .then(() => {
                    resolve();
                })
                .catch((error) => {
                    reject(error);
                })
            })
        } catch (error) {
            setLoading(false);
            props.setError(error.data.message);
        }
        try {
            await updateCalendar(machine, year);
        } catch(error) {
            setLoading(false);
            props.setError(error.data.message);
        }
        setLoading(false);
      }

      const indicateBreakdown = async () => {
        setLoading(true);
        let api = new API();
        try {
            await new Promise((resolve, reject) => {
                api
                .post(`${ENDPOINT}/breakdown/new`, {
                  machineID: machine, 
                  startDate: breakdownDate[0],
                  endDate: breakdownDate[1]
                })
                .then(() => {
                    resolve();
                })
                .catch((error) => {
                    reject(error);
                })
            })
        } catch (error) {
            setLoading(false);
            props.setError(error.data.message);
        }
        try {
            await updateCalendar(machine, year);
        } catch(error) {
            setLoading(false);
            props.setError(error.data.message);
        }
        setLoading(false);
      }

      const deleteBreakdown = () => {
        confirmAlert({
            title: 'Confirm to delete',
            message: 'Are you sure you want to delete the indicated breakdown?',
            buttons: [
              {
                label: 'Yes',
                onClick: async () => {
                  setLoading(true);
                  let api = new API();
                  try {
                      await new Promise((resolve, reject) => {
                          api
                          .post(`${ENDPOINT}/breakdown/delete`, {
                              _id: breakdownData._id
                          })
                          .then(() => {
                              resolve();
                          })
                          .catch((error) => {
                              reject(error);
                          })
                      })
                  } catch (error) {
                      setLoading(false);
                      props.setError(error.data.message);
                  }
                  try {
                      await updateCalendar(machine, year);
                  } catch(error) {
                      setLoading(false);
                      props.setError(error.data.message);
                  }
                  try {
                      if(selectedDate !== null) {
                          if((maintenanceData.get(`${selectedDate.getDate()},${selectedDate.getMonth()}`)) !== undefined) {
                              if(maintenanceData.get(`${selectedDate.getDate()},${selectedDate.getMonth()}`).type === "MAINTENANCE") {
                                  setFormID(maintenanceData.get(`${selectedDate.getDate()},${selectedDate.getMonth()}`).maintenance._id);
                                  setFormStartDate(new Date(maintenanceData.get(`${selectedDate.getDate()},${selectedDate.getMonth()}`).maintenance.startDate));
                                  setFormEndDate(new Date(maintenanceData.get(`${selectedDate.getDate()},${selectedDate.getMonth()}`).maintenance.endDate));
                                  setFormActualEndDate((maintenanceData.get(`${selectedDate.getDate()},${selectedDate.getMonth()}`).maintenance.actualEndDate) ? new Date(maintenanceData.get(`${selectedDate.getDate()},${selectedDate.getMonth()}`).maintenance.actualEndDate) : new Date(maintenanceData.get(`${selectedDate.getDate()},${selectedDate.getMonth()}`).maintenance.startDate))
                              } else {
                                  setBreakdownData({
                                      ...breakdownData, 
                                      _id: maintenanceData.get(`${selectedDate.getDate()},${selectedDate.getMonth()}`).breakdown._id,
                                      startDate: new Date(maintenanceData.get(`${selectedDate.getDate()},${selectedDate.getMonth()}`).breakdown.startDate),
                                      endDate: (maintenanceData.get(`${selectedDate.getDate()},${selectedDate.getMonth()}`).breakdown.endDate) ? new Date(maintenanceData.get(`${selectedDate.getDate()},${selectedDate.getMonth()}`).breakdown.endDate) : new Date(maintenanceData.get(`${selectedDate.getDate()},${selectedDate.getMonth()}`).breakdown.startDate)
                                  })
                              }
                          }
                      }
                  } catch (error) {
                      setLoading(false);
                      props.setError(error);
                  }
                  setLoading(false);
                }
              },
              {
                label: 'No',
                onClick: () => {}
              }
            ]
          });
      }

      const submit = () => {
        confirmAlert({
          title: 'Confirm to delete',
          message: 'Are you sure you want to delete the scheduled maintenance?',
          buttons: [
            {
              label: 'Yes',
              onClick: async () => {
                setLoading(true);
                let api = new API();
                try {
                    await new Promise((resolve, reject) => {
                        api
                        .post(`${ENDPOINT}/maintenance/delete`, {
                            _id: formID
                        })
                        .then(() => {
                            resolve();
                        })
                        .catch((error) => {
                            reject(error);
                        })
                    })
                } catch (error) {
                    setLoading(false);
                    props.setError(error.data.message);
                }
                try {
                    await updateCalendar(machine, year);
                } catch(error) {
                    setLoading(false);
                    props.setError(error.data.message);
                }
                try {
                    if(selectedDate !== null) {
                        if((maintenanceData.get(`${selectedDate.getDate()},${selectedDate.getMonth()}`)) !== undefined) {
                            if(maintenanceData.get(`${selectedDate.getDate()},${selectedDate.getMonth()}`).type === "MAINTENANCE") {
                                setFormID(maintenanceData.get(`${selectedDate.getDate()},${selectedDate.getMonth()}`).maintenance._id);
                                setFormStartDate(new Date(maintenanceData.get(`${selectedDate.getDate()},${selectedDate.getMonth()}`).maintenance.startDate));
                                setFormEndDate(new Date(maintenanceData.get(`${selectedDate.getDate()},${selectedDate.getMonth()}`).maintenance.endDate));
                                setFormActualEndDate((maintenanceData.get(`${selectedDate.getDate()},${selectedDate.getMonth()}`).maintenance.actualEndDate) ? new Date(maintenanceData.get(`${selectedDate.getDate()},${selectedDate.getMonth()}`).maintenance.actualEndDate) : new Date(maintenanceData.get(`${selectedDate.getDate()},${selectedDate.getMonth()}`).maintenance.startDate))
                            } else {
                                setBreakdownData({
                                    ...breakdownData, 
                                    _id: maintenanceData.get(`${selectedDate.getDate()},${selectedDate.getMonth()}`).breakdown._id,
                                    startDate: new Date(maintenanceData.get(`${selectedDate.getDate()},${selectedDate.getMonth()}`).breakdown.startDate),
                                    endDate: (maintenanceData.get(`${selectedDate.getDate()},${selectedDate.getMonth()}`).breakdown.endDate) ? new Date(maintenanceData.get(`${selectedDate.getDate()},${selectedDate.getMonth()}`).breakdown.endDate) : new Date(maintenanceData.get(`${selectedDate.getDate()},${selectedDate.getMonth()}`).breakdown.startDate)
                                })
                            }
                        }
                    }
                } catch (error) {
                    setLoading(false);
                    props.setError(error);
                }
                setLoading(false);
              }
            },
            {
              label: 'No',
              onClick: () => {}
            }
          ]
        });
      };

      const updateBreakdown = async () => {
        setLoading(true);
        let api = new API();
        try {
            await new Promise((resolve, reject) => {
                api
                .put(`${ENDPOINT}/breakdown/update`, {
                    _id: breakdownData._id,
                    startDate: breakdownData.startDate,
                    endDate: breakdownChecked ? breakdownData.endDate : undefined,
                    machineID: machine
                })
                .then(() => {
                    resolve();
                })
                .catch((error) => {
                    reject(error);
                })
            })
        } catch (error) {
            setLoading(false);
            props.setError(error.data.message);
        }
        try {
            await updateCalendar(machine, year);
        } catch(error) {
            setLoading(false);
            props.setError(error.data.message);
        }
        setLoading(false);
      }

      const update = async () => {
        setLoading(true);
        let api = new API();
        try {
            await new Promise((resolve, reject) => {
                api
                .put(`${ENDPOINT}/maintenance/update`, {
                    _id: formID,
                    startDate: formStartDate,
                    endDate: formEndDate,
                    actualEndDate: checked ? formActualEndDate : undefined,
                    machineID: machine
                })
                .then(() => {
                    resolve();
                })
                .catch((error) => {
                    reject(error);
                })
            })
        } catch (error) {
            setLoading(false);
            props.setError(error.data.message);
        }
        try {
            await updateCalendar(machine, year);
        } catch(error) {
            setLoading(false);
            props.setError(error.data.message);
        }
        setLoading(false);
      }
      
      const handleChecked = (event) => {
          setChecked(event.target.checked);
      }

      const handleBreakdownChecked = (event) => {
        setBreakdownChecked(event.target.checked);
    }

    return (
        <div style={{width: "100%", height: "100%"}}>
            { loading ? (
                <div style={{width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}>
                    <CircularProgress size={50} />
                </div>
            ) : (
                <div>
                    <div style={{marginTop: "15px"}}></div>
                    <div style={{display: 'flex', justifyContent: "center"}}>
                        <div style={{width: 300}}>
                            <DropdownList 
                            filter="contains"
                            data={machineData}
                            textField="name"
                            valueField="_id"
                            defaultValue={machine}
                            placeholder="Select machine..."
                            onChange={value => {handleMachineChange(value._id)}}
                            />
                        </div>
                    </div>
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
                            { machine && (
                                <div style={{margin: "20px", border: "1px solid black", borderRadius: "20px"}}>
                                <h2 style={{marginBottom: "5px", marginTop: "5px", fontSize: 30}}><b>Schedule Maintenance</b></h2>
                                    <hr />
                                    <div style={{marginTop: "20px"}}></div>
                                    <DateRangePicker
                                    onChange={onDateChange}
                                    value={date}
                                    />
                                    <div style={{marginTop: "20px"}}></div>
                                    <Fab onClick={scheduleMaintenance} variant="extended">
                                        <ScheduleIcon className={classes.extendedIcon} />
                                        Schedule
                                    </Fab>
                                    <div style={{marginTop: "30px"}}></div>
                                </div>
                            ) }
                            { machine && (
                                <div style={{margin: "20px", border: "1px solid black", borderRadius: "20px"}}>
                                <h2 style={{marginBottom: "5px", marginTop: "5px", fontSize: 30}}><b>Indicate breakdown</b></h2>
                                    <hr />
                                    <div style={{marginTop: "20px"}}></div>
                                    <DateRangePicker
                                    onChange={onBreakdownDateChange}
                                    value={breakdownDate}
                                    />
                                    <div style={{marginTop: "20px"}}></div>
                                    <div style={{width: "100%", display: "flex", justifyContent: "center"}}>
                                        <Button onClick={indicateBreakdown} style={{width: "80%"}} variant="contained" color="secondary">Indicate</Button>
                                    </div>
                                    <div style={{marginTop: "30px"}}></div>
                                </div>
                            ) }
                                {selectedDate !== null ?  (
                                    <div>
                                        {
                                            (maintenanceData.get(`${selectedDate.getDate()},${selectedDate.getMonth()}`)) !== undefined ? (
                                                <div style={{margin: "20px", border: "1px solid black", borderRadius: "20px"}}>
                                                    {
                                                        (maintenanceData.get(`${selectedDate.getDate()},${selectedDate.getMonth()}`).type === "MAINTENANCE") ? (
                                                            <div>
                                                                <h2 style={{marginBottom: "5px", marginTop: "5px", fontSize: 20}}>
                                                                    <b>
                                                                        Maintenance
                                                                    </b>
                                                                </h2>
                                                                <hr />
                                                                <Grid container>
                                                                    <Grid style={{marginTop: "5px", display: 'flex', justifyContent: 'flex-end'}} item xs={5} sm={5} md={5} lg={5}>
                                                                        <div style={{width: '80%', display: "flex", justifyContent: "flex-start"}}>
                                                                            <Typography style={{textAlign: "left", fontSize: 15, fontWeight: 'bold'}}>Start Date:</Typography>
                                                                        </div>
                                                                    </Grid>
                                                                    <Grid item xs={7} sm={7} md={7} lg={7}>
                                                                        <div style={{width: '80%', display: "flex", justifyContent: "flex-start"}}>
                                                                            <DatePicker maxDate={formEndDate} dateFormat="MMMM d, yyyy" selected={formStartDate} onChange={date => {setFormStartDate(date)}} />
                                                                        </div>
                                                                    </Grid>
                                                                    <Grid style={{marginTop: "5px", display: 'flex', justifyContent: 'flex-end'}} item xs={5} sm={5} md={5} lg={5}>
                                                                        <div style={{width: '80%', display: "flex", justifyContent: "flex-start"}}>
                                                                            <Typography style={{textAlign: "left", fontSize: 15, fontWeight: 'bold'}}>End Date:</Typography>
                                                                        </div>
                                                                    </Grid>
                                                                    <Grid item xs={7} sm={7} md={7} lg={7}>
                                                                        <div style={{width: '80%', display: "flex", justifyContent: "flex-start"}}>
                                                                            <DatePicker minDate={formStartDate} dateFormat="MMMM d, yyyy" selected={formEndDate} onChange={date => {setFormEndDate(date)}} />
                                                                        </div>
                                                                    </Grid>
                                                                    <Grid style={{marginTop: "5px", display: 'flex', justifyContent: 'flex-end'}} item xs={5} sm={5} md={5} lg={5}>
                                                                        <div style={{width: '80%', display: "flex", justifyContent: "flex-start", alignItems: "center"}}>
                                                                            <Typography style={{textAlign: "left", fontSize: 15, fontWeight: 'bold'}}>Actual End Date:</Typography>
                                                                        </div>
                                                                    </Grid>
                                                                    <Grid item xs={7} sm={7} md={7} lg={7}>
                                                                        <div style={{width: '80%', display: "flex", justifyContent: "flex-start", marginTop: "10px"}}>
                                                                            {
                                                                                (maintenanceData.get(`${selectedDate.getDate()},${selectedDate.getMonth()}`)).maintenance.actualEndDate ? (
                                                                                    <DatePicker disabled={!checked} minDate={formStartDate} dateFormat="MMMM d, yyyy" selected={formActualEndDate} onChange={date => {setFormActualEndDate(date)}} />
                                                                                ) : (
                                                                                    <DatePicker disabled={!checked} minDate={formStartDate} dateFormat="MMMM d, yyyy" selected={formActualEndDate} isClearable placeholderText="Select a date" onChange={date => {setFormActualEndDate(date)}} />
                                                                                )
                                                                            }
                                                                        </div>
                                                                    </Grid>
                                                                </Grid>
                                                                <FormControlLabel
                                                                control={
                                                                    <Checkbox
                                                                    checked={checked}
                                                                    onChange={handleChecked}
                                                                    color="primary"
                                                                    />
                                                                }
                                                                label="Include Actual End Date"
                                                                />
                                                                <div style={{marginTop: "20px", backgroundColor: "white", width: "100%", height: "90%", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center"}}>
                                                                    <Button style={{width: "80%"}} variant="contained" onClick={update} color="primary">Update</Button>
                                                                </div>
                                                                <div style={{marginTop: "20px", backgroundColor: "white", width: "100%", height: "90%", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center"}}>
                                                                    <Button style={{width: "80%"}} variant="contained" onClick={submit} color="secondary">Delete</Button>
                                                                </div>
                                                                <div style={{marginTop: "20px"}}></div>
                                                            </div>
                                                        ) : (
                                                            <div>
                                                                <h2 style={{marginBottom: "5px", marginTop: "5px", fontSize: 20}}>
                                                                    <b>
                                                                        Breakdown
                                                                    </b>
                                                                </h2>
                                                                <hr />
                                                                <Grid container>
                                                                    <Grid style={{marginTop: "5px", display: 'flex', justifyContent: 'flex-end'}} item xs={5} sm={5} md={5} lg={5}>
                                                                        <div style={{width: '80%', display: "flex", justifyContent: "flex-start"}}>
                                                                            <Typography style={{textAlign: "left", fontSize: 15, fontWeight: 'bold'}}>Start Date:</Typography>
                                                                        </div>
                                                                    </Grid>
                                                                    <Grid item xs={7} sm={7} md={7} lg={7}>
                                                                        <div style={{width: '80%', display: "flex", justifyContent: "flex-start"}}>
                                                                            <DatePicker maxDate={breakdownData.endDate} dateFormat="MMMM d, yyyy" selected={breakdownData.startDate} onChange={date => {setBreakdownData({...breakdownData, startDate: date})}} />
                                                                        </div>
                                                                    </Grid>
                                                                    <Grid style={{marginTop: "5px", display: 'flex', justifyContent: 'flex-end'}} item xs={5} sm={5} md={5} lg={5}>
                                                                        <div style={{width: '80%', display: "flex", justifyContent: "flex-start", alignItems: "center"}}>
                                                                            <Typography style={{textAlign: "left", fontSize: 15, fontWeight: 'bold'}}>End Date:</Typography>
                                                                        </div>
                                                                    </Grid>
                                                                    <Grid item xs={7} sm={7} md={7} lg={7}>
                                                                        <div style={{width: '80%', display: "flex", justifyContent: "flex-start", marginTop: "10px"}}>
                                                                            {
                                                                                (maintenanceData.get(`${selectedDate.getDate()},${selectedDate.getMonth()}`)).breakdown.endDate ? (
                                                                                    <DatePicker disabled={!breakdownChecked} minDate={breakdownData.startDate} dateFormat="MMMM d, yyyy" selected={breakdownData.endDate} onChange={date => {setBreakdownData({...breakdownData, endDate: date})}} />
                                                                                ) : (
                                                                                    <DatePicker disabled={!breakdownChecked} minDate={breakdownData.startDate} dateFormat="MMMM d, yyyy" selected={breakdownData.endDate} isClearable placeholderText="Select a date" onChange={date => {setBreakdownData({...breakdownData, endDate: date})}} />
                                                                                )
                                                                            }
                                                                        </div>
                                                                    </Grid>
                                                                </Grid>
                                                                <FormControlLabel
                                                                control={
                                                                    <Checkbox
                                                                    checked={breakdownChecked}
                                                                    onChange={handleBreakdownChecked}
                                                                    color="primary"
                                                                    />
                                                                }
                                                                label="Include End Date"
                                                                />
                                                                <div style={{marginTop: "20px", backgroundColor: "white", width: "100%", height: "90%", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center"}}>
                                                                    <Button style={{width: "80%"}} variant="contained" onClick={updateBreakdown} color="primary">Update</Button>
                                                                </div>
                                                                <div style={{marginTop: "20px", backgroundColor: "white", width: "100%", height: "90%", display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center"}}>
                                                                    <Button style={{width: "80%"}} variant="contained" onClick={deleteBreakdown} color="secondary">Delete</Button>
                                                                </div>
                                                                <div style={{marginTop: "20px"}}></div>
                                                            </div>
                                                        )
                                                    }
                                                </div>
                                            ) : (
                                                <div style={{marginTop: "20px"}}>
                                                    <h3>{selectedDate.toDateString()}</h3>
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