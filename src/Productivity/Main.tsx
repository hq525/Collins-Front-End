import React, { useState, useEffect, useRef } from 'react';
import { makeStyles, createStyles } from '@material-ui/styles';
import { Grid, InputLabel, FormControl, Select, List, ListItem, ListItemText, Button, MenuItem } from '@material-ui/core';
import { Stage, Layer, Image, Rect, Text } from 'react-konva';
import useImage from 'use-image';
import { Modal, Theme } from '@material-ui/core';
import Board from "./Board";
import _ from "lodash";
import { Link } from "react-router-dom";
import { ENDPOINT } from "../utils/config";
import API from "../utils/API";
import ProductivityMenu  from "./ProductivityMenu"

const monthss = [{value: 0, name: "January"}, {value: 1, name: "February"}, {value: 2, name: "March"}, {value: 3, name: "April"}, {value: 4, name: "May"}, {value: 5, name: "June"}, {value: 6, name: "July"}, {value: 7, name: "August"}, {value: 8, name: "September"}, {value: 9, name: "October"}, {value: 10, name: "November"}, {value: 11, name: "December"}]

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
    buttonGrid: {
      '&:hover': {
          cursor: 'pointer',
          backgroundColor: theme.palette.grey[100],
      },
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

const MapImage = () => {
    const [image] = useImage(process.env.PUBLIC_URL + '/Map.jpg');
    return <Image image={image} />;
  };


export default function Main(props) {
    const [amber, setAmber] = useState("#ff9900");
    const [year, setYear] = React.useState<Number>(new Date().getFullYear());
    const [period, setPeriod] = React.useState<Number>(new Date().getMonth());
    const classes = useStyles({});
    const inputLabel = React.useRef<HTMLLabelElement>(null);
    const [labelWidth, setLabelWidth] = React.useState(0);
    const periodInputLabel = React.useRef<HTMLLabelElement>(null);
    const [periodLabelWidth, setPeriodLabelWidth] = React.useState(0);
    const yearInputLabel = React.useRef<HTMLLabelElement>(null);
    const [yearLabelWidth, setYearLabelWidth] = React.useState(0);
    const [sectionData, setSectionData] = useState([]);
    const [machineData, setMachineData] = useState([]);
    const [componentRankings, setComponentRankings] = useState([]);
    React.useEffect(() => {
      async function initialize() {
        setLabelWidth(inputLabel.current!.offsetWidth);
        setPeriodLabelWidth(periodInputLabel.current!.offsetWidth);
        setYearLabelWidth(yearInputLabel.current!.offsetWidth);
        let api = new API();
        var sections = [];
        try {
          await new Promise((resolve, reject) => {
            api
            .get(`${ENDPOINT}/section`)
            .then((data) => {
                let sectionData = [];
                data.sections.forEach((section, index) => {
                    if(section.name !== 'ROOT') {
                        sectionData.push({name: section.name, _id: section._id});
                        sections.push({name: section.name, _id: section._id});
                    }
                })
                setSectionData(sectionData);
                resolve();
            })
            .catch(err => {
                reject(err);
            });
          })
        } catch (error) {
          if(error.data && error.data.message) {
            props.setError(error.data.message);
          } else {
            props.setError("An error occurred");
          }
        }
        if(sections.length === 0) {
          setSection("");
          setMachine("");
        } else {
          setSection("Overall")
          try {
            var machines = [];
            await new Promise((resolve, reject) => {
              api
              .get(`${ENDPOINT}/machine`)
              .then((data) => {
                let machineData = [];
                data.machines.forEach((machine, index) => {
                  machineData.push({name: machine.name, _id: machine._id});
                  machines.push({name: machine.name, _id: machine._id});
                })
                setMachineData(machineData);
                resolve();
              })
              .catch((error) => {
                reject(error);
              })
            })
          } catch (error) {
            if(error.data && error.data.message) {
              props.setError(error.data.message)
            } else {
              props.setError("An error occurred")
            }
          }
          if(machines.length === 0) {
            setMachine("");
            setComponentRankings([]);
          } else {
            setMachine("All");
            api
            .post(`${ENDPOINT}/job/period/ranking`, {
              month: period,
              year
            })
            .then((data) => {
              setComponentRankings(data.components);
            })
            .catch((error) => {
              if(error.data && error.data.message) {
                props.setError(error.data.message)
              } else {
                props.setError("An error occurred")
              }
            })
          }
        }
      }
      initialize()
    }, []);
    const Color = {
      "FLASHING": amber,
      "EXCEED": "#ff0000",
      "EXCEED2": "#ff0000",
      "MAINTENANCE": "#ff9900",
      "MAINTENANCE2": "#ff9900",
      "HEALTHY": "#00ff00",
      "BREAKDOWN": "#ff0000",
      "BREAKDOWN2": "#ff0000"
    }
    React.useEffect(() => {
      let api = new API();
      api
      .get(`${ENDPOINT}/machine/map`)
      .then((data) => {
          setAllMachines(data.machines);
      })
      .catch((error) => {
        if(error.data && error.data.message) {
            props.setError(error.data.message);
        } else {
            props.setError("An error occurred");
        }
      })
      api
      .get(`${ENDPOINT}/text`)
      .then((data) => {
        setAllTexts(data.texts);
      })
      .catch((error) => {
        if(error.data && error.data.message) {
          props.setError(error.data.message);
        } else {
            props.setError("An error occurred");
        }
      })
    }, [props]);
    const refreshMap = () => {
      let api = new API();
      api
      .get(`${ENDPOINT}/machine/map`)
      .then((data) => {
          setAllMachines(data.machines);
      })
      .catch((error) => {
        if(error.data && error.data.message) {
            props.setError(error.data.message);
        } else {
            props.setError("An error occurred");
        }
      })
      api
      .get(`${ENDPOINT}/text`)
      .then((data) => {
        setAllTexts(data.texts);
      })
      .catch((error) => {
        if(error.data && error.data.message) {
            props.setError(error.data.message);
        } else {
            props.setError("An error occurred");
        }
      })
    }
    useEffect(() => {
        setTimeout(() => {
            if(amber === "#ff9900") {
                setAmber("white");
            } else {
                setAmber("#ff9900");
            }
        }, 1000);
    }, [amber]);
    const [open, setOpen] = React.useState(false);

    const handleOpen = (_id) => {
      setMachineID(_id);
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };
    const stageRef = useRef(null);
    const [section, setSection] = React.useState<string>("Overall");
    const handleSectionChange = async (event) => {
      setSection(event.target.value)
      let sectionID = event.target.value
      let api = new API();
      if(event.target.value === "Overall") {
        try {
          var machines = [];
          await new Promise((resolve, reject) => {
            api
            .get(`${ENDPOINT}/machine`)
            .then((data) => {
              let machineData = [];
              data.machines.forEach((machine, index) => {
                machineData.push({name: machine.name, _id: machine._id});
                machines.push(machine._id);
              })
              setMachineData(machineData);
              resolve();
            })
            .catch((error) => {
              reject(error);
            })
          })
        } catch (error) {
          if(error.data && error.data.message) {
            props.setError(error.data.message)
          } else {
            props.setError("An error occurred")
          }
        }
        if(machines.length === 0) {
          setMachine("");
          setComponentRankings([]);
        } else {
          if(machine === "All") {
            if(period === 12) {
              api
              .post(`${ENDPOINT}/job/period/ranking/YTD`, {
                year
              })
              .then((data) => {
                setComponentRankings(data.components);
              })
              .catch((error) => {
                if(error.data && error.data.message) {
                  props.setError(error.data.message)
                } else {
                  props.setError("An error occurred")
                }
              })
            } else {
              api
              .post(`${ENDPOINT}/job/period/ranking`, {
                month: period,
                year
              })
              .then((data) => {
                setComponentRankings(data.components);
              })
              .catch((error) => {
                if(error.data && error.data.message) {
                  props.setError(error.data.message)
                } else {
                  props.setError("An error occurred")
                }
              })
            }
          } 
          else if (machine === "") {
            setComponentRankings([]);
          }
          else {
            if(machines.indexOf(machine) === -1) {
              setMachine(machines[0]);
              if (period === 12) {
                api
                .post(`${ENDPOINT}/job/machine/ranking/YTD`, {
                  year,
                  machineID: machines[0]
                })
                .then((data) => {
                  setComponentRankings(data.components);
                })
                .catch((error) => {
                  if(error.data && error.data.message) {
                    props.setError(error.data.message)
                  } else {
                    props.setError("An error occurred")
                  }
                })
              } else {
                api
                .post(`${ENDPOINT}/job/ranking/period`, {
                  year,
                  month: period,
                  machineID: machines[0]
                })
                .then((data) => {
                  setComponentRankings(data.components);
                })
                .catch((error) => {
                  if(error.data && error.data.message) {
                    props.setError(error.data.message)
                  } else {
                    props.setError("An error occurred")
                  }
                })
              }
            } else {
              if (period === 12) {
                api
                .post(`${ENDPOINT}/job/machine/ranking/YTD`, {
                  year,
                  machineID: machine
                })
                .then((data) => {
                  setComponentRankings(data.components);
                })
                .catch((error) => {
                  if(error.data && error.data.message) {
                    props.setError(error.data.message)
                  } else {
                    props.setError("An error occurred")
                  }
                })
              } else {
                api
                .post(`${ENDPOINT}/job/ranking/period`, {
                  year,
                  month: period,
                  machineID: machine
                })
                .then((data) => {
                  setComponentRankings(data.components);
                })
                .catch((error) => {
                  if(error.data && error.data.message) {
                    props.setError(error.data.message)
                  } else {
                    props.setError("An error occurred")
                  }
                })
              }
            }
          }
        }
      }
      else if(event.target.value === "") {
        setMachine("");
        setComponentRankings([])
        setMachineData([]);
      }
      else {
        try {
          var machines = [];
          await new Promise((resolve, reject) => {
            api
            .post(`${ENDPOINT}/machine/section`, {
              sectionID: event.target.value
            })
            .then((data) => {
              let machineData = [];
              data.machines.forEach((machine, index) => {
                machineData.push({name: machine.name, _id: machine._id});
                machines.push(machine._id);
              })
              setMachineData(machineData);
              resolve();
            })
            .catch((error) => {
              reject(error);
            })
          })
        } catch (error) {
          if(error.data && error.data.message) {
            props.setError(error.data.message)
          } else {
            props.setError("An error occurred")
          }
        }
        if(machines.length === 0) {
          setMachine("");
          setComponentRankings([]);
        } else {
          if(machine === "All") {
            if(period === 12) {
              api
              .post(`${ENDPOINT}/job/section/ranking/YTD`, {
                year,
                sectionID
              })
              .then((data) => {
                setComponentRankings(data.components);
              })
              .catch((error) => {
                if(error.data && error.data.message) {
                  props.setError(error.data.message)
                } else {
                  props.setError("An error occurred")
                }
              })
            } else {
              api
              .post(`${ENDPOINT}/job/section/month/ranking/YTD`, {
                year,
                sectionID,
                month: period
              })
              .then((data) => {
                setComponentRankings(data.components);
              })
              .catch((error) => {
                if(error.data && error.data.message) {
                  props.setError(error.data.message)
                } else {
                  props.setError("An error occurred")
                }
              })
            }
          }
          else if (machine === "") {
            setComponentRankings([]);
          }
          else {
            if(machines.indexOf(machine) === -1) {
              setMachine(machines[0]);
              if (period === 12) {
                api
                .post(`${ENDPOINT}/job/machine/ranking/YTD`, {
                  year,
                  machineID: machines[0]
                })
                .then((data) => {
                  setComponentRankings(data.components);
                })
                .catch((error) => {
                  if(error.data && error.data.message) {
                    props.setError(error.data.message)
                  } else {
                    props.setError("An error occurred")
                  }
                })
              } else {
                api
                .post(`${ENDPOINT}/job/ranking/period`, {
                  year,
                  month: period,
                  machineID: machines[0]
                })
                .then((data) => {
                  setComponentRankings(data.components);
                })
                .catch((error) => {
                  if(error.data && error.data.message) {
                    props.setError(error.data.message)
                  } else {
                    props.setError("An error occurred")
                  }
                })
              }
            } else {
              if (period === 12) {
                api
                .post(`${ENDPOINT}/job/machine/ranking/YTD`, {
                  year,
                  machineID: machine
                })
                .then((data) => {
                  setComponentRankings(data.components);
                })
                .catch((error) => {
                  if(error.data && error.data.message) {
                    props.setError(error.data.message)
                  } else {
                    props.setError("An error occurred")
                  }
                })
              } else {
                api
                .post(`${ENDPOINT}/job/ranking/period`, {
                  year,
                  month: period,
                  machineID: machine
                })
                .then((data) => {
                  setComponentRankings(data.components);
                })
                .catch((error) => {
                  if(error.data && error.data.message) {
                    props.setError(error.data.message)
                  } else {
                    props.setError("An error occurred")
                  }
                })
              }
            }
          }
        }
      }
    }
    const [machine, setMachine] = React.useState<string>("All");
    const handleMachineChange = async (event) => {
        setMachine(event.target.value) 
        let machineID = event.target.value
        let api = new API();
        if(machineID === "") {
          setComponentRankings([]);
        } 
        else if(machineID === "All") {
          if(section === "Overall") {
            if(period === 12) {
              api
              .post(`${ENDPOINT}/job/period/ranking/YTD`, {
                year
              })
              .then((data) => {
                setComponentRankings(data.components);
              })
              .catch((error) => {
                if(error.data && error.data.message) {
                  props.setError(error.data.message)
                } else {
                  props.setError("An error occurred")
                }
              })
            } else {
              api
              .post(`${ENDPOINT}/job/period/ranking`, {
                month: period,
                year
              })
              .then((data) => {
                setComponentRankings(data.components);
              })
              .catch((error) => {
                if(error.data && error.data.message) {
                  props.setError(error.data.message)
                } else {
                  props.setError("An error occurred")
                }
              })
            }
          }
          else {
            if(period === 12) {
              api
              .post(`${ENDPOINT}/job/section/ranking/YTD`, {
                year,
                sectionID: section
              })
              .then((data) => {
                setComponentRankings(data.components);
              })
              .catch((error) => {
                if(error.data && error.data.message) {
                  props.setError(error.data.message)
                } else {
                  props.setError("An error occurred")
                }
              })
            } else {
              api
              .post(`${ENDPOINT}/job/section/month/ranking/YTD`, {
                month: period,
                year,
                sectionID: section
              })
              .then((data) => {
                setComponentRankings(data.components);
              })
              .catch((error) => {
                if(error.data && error.data.message) {
                  props.setError(error.data.message)
                } else {
                  props.setError("An error occurred")
                }
              })
            }
          }
        }
        else {
          if(period === 12) {
            api
            .post(`${ENDPOINT}/job/machine/ranking/YTD`, {
              year,
              machineID
            })
            .then((data) => {
              setComponentRankings(data.components);
            })
            .catch((error) => {
              if(error.data && error.data.message) {
                props.setError(error.data.message)
              } else {
                props.setError("An error occurred")
              }
            })
          } else {
            api
            .post(`${ENDPOINT}/job/ranking/period`, {
              year,
              month: period,
              machineID
            })
            .then((data) => {
              setComponentRankings(data.components);
            })
            .catch((error) => {
              if(error.data && error.data.message) {
                props.setError(error.data.message)
              } else {
                props.setError("An error occurred")
              }
            })
          }
        }    
    }
    const [allMachines, setAllMachines] = React.useState([]);
    const [allTexts, setAllTexts] = React.useState([]);
    const [machineID, setMachineID] = React.useState(null);

    const handlePeriodChange = (event) => {
      setPeriod(event.target.value)
      let month = event.target.value
      let api = new API();
      if(section === "") {
        setComponentRankings([]);
      }
      else if (machine === "") {
        setComponentRankings([]);
      }
      else {
        if(section === "Overall") {
          if(machine === "All") {
            if(month === 12) {
              api
              .post(`${ENDPOINT}/job/period/ranking/YTD`, {
                year
              })
              .then((data) => {
                setComponentRankings(data.components);
              })
              .catch((error) => {
                if(error.data && error.data.message) {
                  props.setError(error.data.message)
                } else {
                  props.setError("An error occurred")
                }
              })
            } else {
              api
              .post(`${ENDPOINT}/job/period/ranking`, {
                year,
                month
              })
              .then((data) => {
                setComponentRankings(data.components);
              })
              .catch((error) => {
                if(error.data && error.data.message) {
                  props.setError(error.data.message)
                } else {
                  props.setError("An error occurred")
                }
              })
            }
          } else if(machine === "") {
            setComponentRankings([]);
          } else {
            if(month === 12) {
              api
              .post(`${ENDPOINT}/job/machine/ranking/YTD`, {
                year,
                machineID: machine
              })
              .then((data) => {
                setComponentRankings(data.components);
              })
              .catch((error) => {
                if(error.data && error.data.message) {
                  props.setError(error.data.message)
                } else {
                  props.setError("An error occurred")
                }
              })
            } else {
              api
              .post(`${ENDPOINT}/job/ranking/period`, {
                year,
                month,
                machineID: machine
              })
              .then((data) => {
                setComponentRankings(data.components);
              })
              .catch((error) => {
                if(error.data && error.data.message) {
                  props.setError(error.data.message)
                } else {
                  props.setError("An error occurred")
                }
              })
            }
          }
        } else {
          if(machine === "All") {
            if(month === 12) {
              api
              .post(`${ENDPOINT}/job/section/ranking/YTD`, {
                year,
                sectionID: section
              })
              .then((data) => {
                setComponentRankings(data.components);
              })
              .catch((error) => {
                if(error.data && error.data.message) {
                  props.setError(error.data.message)
                } else {
                  props.setError("An error occurred")
                }
              })
            } else {
              api
              .post(`${ENDPOINT}/job/section/month/ranking/YTD`, {
                year,
                month,
                sectionID: section
              })
              .then((data) => {
                setComponentRankings(data.components);
              })
              .catch((error) => {
                if(error.data && error.data.message) {
                  props.setError(error.data.message)
                } else {
                  props.setError("An error occurred")
                }
              })
            }
          } else if(machine === "") {
            setComponentRankings([]);
          } else {
            if(month === 12) {
              api
              .post(`${ENDPOINT}/job/machine/ranking/YTD`, {
                year,
                machineID: machine
              })
              .then((data) => {
                setComponentRankings(data.components);
              })
              .catch((error) => {
                if(error.data && error.data.message) {
                  props.setError(error.data.message)
                } else {
                  props.setError("An error occurred")
                }
              })
            } else {
              api
              .post(`${ENDPOINT}/job/ranking/period`, {
                year,
                month,
                machineID: machine
              })
              .then((data) => {
                setComponentRankings(data.components);
              })
              .catch((error) => {
                if(error.data && error.data.message) {
                  props.setError(error.data.message)
                } else {
                  props.setError("An error occurred")
                }
              })
            }
          }
        }
      }
    }

    const handleYearChange = (event) => {
      setYear(event.target.value);
      let yearr = event.target.value
      let api = new API();
      if(section === "") {
        setComponentRankings([]);
      }
      else if (machine === "") {
        setComponentRankings([]);
      }
      else {
        if(section === "Overall") {
          if(machine === "All") {
            if(period === 12) {
              api
              .post(`${ENDPOINT}/job/period/ranking/YTD`, {
                year: yearr
              })
              .then((data) => {
                setComponentRankings(data.components);
              })
              .catch((error) => {
                if(error.data && error.data.message) {
                  props.setError(error.data.message)
                } else {
                  props.setError("An error occurred")
                }
              })
            } else {
              api
              .post(`${ENDPOINT}/job/period/ranking`, {
                year: yearr,
                month: period
              })
              .then((data) => {
                setComponentRankings(data.components);
              })
              .catch((error) => {
                if(error.data && error.data.message) {
                  props.setError(error.data.message)
                } else {
                  props.setError("An error occurred")
                }
              })
            }
          } else if (machine === "") {
            setComponentRankings([]);
          } else {
            if(period === 12) {
              api
              .post(`${ENDPOINT}/job/machine/ranking/YTD`, {
                year: yearr,
                machineID: machine
              })
              .then((data) => {
                setComponentRankings(data.components);
              })
              .catch((error) => {
                if(error.data && error.data.message) {
                  props.setError(error.data.message)
                } else {
                  props.setError("An error occurred")
                }
              })
            } else {
              api
              .post(`${ENDPOINT}/job/ranking/period`, {
                year: yearr,
                month: period,
                machineID: machine
              })
              .then((data) => {
                setComponentRankings(data.components);
              })
              .catch((error) => {
                if(error.data && error.data.message) {
                  props.setError(error.data.message)
                } else {
                  props.setError("An error occurred")
                }
              })
            }
          }
        } else {
          if(machine === "All") {
            if(period === 12) {
              api
              .post(`${ENDPOINT}/job/section/ranking/YTD`, {
                year: yearr,
                sectionID: section
              })
              .then((data) => {
                setComponentRankings(data.components);
              })
              .catch((error) => {
                if(error.data && error.data.message) {
                  props.setError(error.data.message)
                } else {
                  props.setError("An error occurred")
                }
              })
            } else {
              api
              .post(`${ENDPOINT}/job/section/month/ranking/YTD`, {
                year: yearr,
                month: period,
                sectionID: section
              })
              .then((data) => {
                setComponentRankings(data.components);
              })
              .catch((error) => {
                if(error.data && error.data.message) {
                  props.setError(error.data.message)
                } else {
                  props.setError("An error occurred")
                }
              })
            }
          } else if(machine === "") {
            setComponentRankings([]);
          } else {
            if(period === 12) {
              api
              .post(`${ENDPOINT}/job/machine/ranking/YTD`, {
                year: yearr,
                machineID: machine
              })
              .then((data) => {
                setComponentRankings(data.components);
              })
              .catch((error) => {
                if(error.data && error.data.message) {
                  props.setError(error.data.message)
                } else {
                  props.setError("An error occurred")
                }
              })
            } else {
              api
              .post(`${ENDPOINT}/job/ranking/period`, {
                year: yearr,
                month: period,
                machineID: machine
              })
              .then((data) => {
                setComponentRankings(data.components);
              })
              .catch((error) => {
                if(error.data && error.data.message) {
                  props.setError(error.data.message)
                } else {
                  props.setError("An error occurred")
                }
              })
            }
          }
        }
      }
    }

    return (
      <div style={{display: "flex", justifyContent: "center"}}>
        <ProductivityMenu />
        <Grid container>
          <Grid style={{display: "flex", justifyContent: "flex-end"}} item xs={9} sm={9} md={9} lg={9}>
            <Stage ref={stageRef} width={1375} height={972}>
              <Layer>
                  <MapImage />
                  {
                    allMachines.map((machine) => <Rect 
                    x={machine.machine.x}
                    y={machine.machine.y}
                    width={machine.machine.width}
                    height={machine.machine.height}
                    fill={Color[machine.status]}
                    strokeWidth={1}
                    stroke="black"
                    />)
                  }
                  {
                    allTexts.map((text) => <Text 
                    text={text.text} 
                    x={text.x} 
                    y = {text.y} 
                    rotation={text.rotation}
                    fontSize={text.fontSize}
                    />)
                  }
                  {
                    allMachines.map((machine) => <Rect 
                    onMouseEnter={() => {stageRef.current.attrs.container.style.cursor = 'pointer'}} 
                    onMouseLeave={() => {stageRef.current.attrs.container.style.cursor = 'default'}}
                    x={machine.machine.x}
                    y={machine.machine.y}
                    width={machine.machine.width}
                    height={machine.machine.height}
                    fill={"hsla(32, 100%, 59%, 0)"}
                    onClick={() => {handleOpen(machine.machine._id)}} 
                    onTap={() => {handleOpen(machine.machine._id)}}
                    />)
                  }
              </Layer>
            </Stage>
          </Grid>
          <Grid item xs={3} sm={3} md={3} lg={3}>
            <Grid container style={{marginTop: "15px"}}>
              <Grid style={{display: "flex", justifyContent: "flex-end"}} item xs={5} sm={5} md={5} lg={5}>
                <FormControl variant="outlined" className={classes.formControl}>
                  <InputLabel ref={inputLabel} id="section-select-label">
                    Section
                  </InputLabel>
                  <Select
                  labelId="section-select-label"
                  id="section-select"
                  value={section}
                  onChange={(event) => {handleSectionChange(event)}}
                  labelWidth={labelWidth}
                  >
                    <MenuItem value={''}>
                      <em>None</em>
                    </MenuItem>
                    {sectionData.length > 0 && <MenuItem value={"Overall"}>Overall</MenuItem>}
                    {
                      sectionData.map((section) => <MenuItem value={section._id}>{section.name}</MenuItem>)
                    }
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={2} sm={2} md={2} lg={2}>

              </Grid>
              <Grid style={{display: "flex", justifyContent: "flex-start"}} item xs={5} sm={5} md={5} lg={5}>
                <FormControl variant="outlined" className={classes.formControl}>
                  <InputLabel ref={inputLabel} id="machine-select-label">
                    Machine
                  </InputLabel>
                  <Select
                  labelId="machine-select-label"
                  id="machine-select"
                  value={machine}
                  onChange={(event) => {handleMachineChange(event)}}
                  labelWidth={labelWidth}
                  >
                    <MenuItem value={''}>
                      <em>None</em>
                    </MenuItem>
                    {machineData.length > 0 && <MenuItem value={"All"}>All</MenuItem>}
                    {
                      machineData.map((machine) => (
                        <MenuItem value={machine._id}>{machine.name}</MenuItem>
                      ))
                    }
                  </Select>
                </FormControl>
              </Grid>
              <Grid style={{display: "flex", justifyContent: "flex-end"}} item xs={5} sm={5} md={5} lg={5}>
                <FormControl variant="outlined" className={classes.formControl}>
                  <InputLabel ref={periodInputLabel} id="period-select-label">
                    Period
                  </InputLabel>
                  <Select
                  labelId="period-select-label"
                  id="period-select"
                  value={period}
                  onChange={(event) => {handlePeriodChange(event)}}
                  labelWidth={periodLabelWidth}
                  >
                    <MenuItem value={12}>YTD</MenuItem>
                    {
                      monthss.map((month) => (
                        <MenuItem value={month.value}>{month.name}</MenuItem>
                      ))
                    }
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={2} sm={2} md={2} lg={2}>

              </Grid>
              <Grid style={{display: "flex", justifyContent: "flex-start"}} item xs={5} sm={5} md={5} lg={5}>
                <FormControl variant="outlined" className={classes.formControl}>
                  <InputLabel ref={yearInputLabel} id="year-select-label">
                    Year
                  </InputLabel>
                  <Select
                  labelId="year-select-label"
                  id="year-select"
                  value={year}
                  onChange={(event) => {handleYearChange(event)}}
                  labelWidth={yearLabelWidth}
                  >
                    {
                        _.range(2013, new Date().getFullYear()+1).map(value => <MenuItem key={value} value={value}>{value}</MenuItem>)
                    }
                  </Select>
                </FormControl>
              </Grid>
              <h1 style={{display: "flex", justifyContent: "center", width: "100%", marginTop: "5px"}}><b>Components Ranking</b></h1>
              <div style={{display: 'flex', justifyContent: 'center', width: "100%"}}>
                <div style={{height: 710, overflow: 'auto', width: "80%"}}>
                  <List>
                    {
                      componentRankings.map(component => {
                          return(
                            <ListItem button >
                              <ListItemText primary={component.name}/>
                            </ListItem>
                          )  
                        }
                      )
                    }
                  </List>
                </div>
              </div>
              <div style={{display: 'flex', justifyContent: 'center', width: '100%', paddingTop: '30px'}}>
                <Link style={{width: "100%"}} to="/edit"><Button style={{width: "80%"}} variant="contained" color="primary">Edit Map</Button></Link>
              </div>
            </Grid>
          </Grid>
        </Grid>
          <Modal
              aria-labelledby="simple-modal-title"
              aria-describedby="simple-modal-description"
              open={open}
              onClose={handleClose}
          >
              <Board refreshMap={refreshMap} setError={props.setError} machineID={machineID} />
          </Modal>
      </div>
    )
}
