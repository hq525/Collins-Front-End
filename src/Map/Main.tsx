import React, { useState, useEffect, useRef } from 'react';
import { makeStyles, createStyles } from '@material-ui/styles';
import { Grid, InputLabel, FormControl, Select, List, ListItem, ListItemText, Button } from '@material-ui/core';
import { Stage, Layer, Image, Rect, Text } from 'react-konva';
import useImage from 'use-image';
import { Modal, Theme } from '@material-ui/core';
import Board from "./Board";
import _ from "lodash";
import { Link } from "react-router-dom";
import { ENDPOINT } from "../utils/config";
import API from "../utils/API";

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
    const [amber, setAmber] = useState("#ffbf80");
    const classes = useStyles({});
    const inputLabel = React.useRef<HTMLLabelElement>(null);
    const [labelWidth, setLabelWidth] = React.useState(0);
    React.useEffect(() => {
      setLabelWidth(inputLabel.current!.offsetWidth);
    })
    const Color = {
      "FLASHING": amber,
      "EXCEED": "#ff9999",
      "EXCEED2": "#ff9999",
      "MAINTENANCE": "#ffbf80",
      "MAINTENANCE2": "#ffbf80",
      "HEALTHY": "#66ff66",
      "BREAKDOWN": "#cc3300",
      "BREAKDOWN2": "#cc3300"
    }
    React.useEffect(() => {
      let api = new API();
      api
      .get(`${ENDPOINT}/machine/map`)
      .then((data) => {
          setAllMachines(data.machines);
      })
      .catch((error) => {
        props.setError(error.data.message);
      })
      api
      .get(`${ENDPOINT}/text`)
      .then((data) => {
        setAllTexts(data.texts);
      })
      .catch((error) => {
        props.setError(error.data.message);
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
        props.setError(error.data.message);
      })
      api
      .get(`${ENDPOINT}/text`)
      .then((data) => {
        setAllTexts(data.texts);
      })
      .catch((error) => {
        props.setError(error.data.message);
      })
    }
    useEffect(() => {
        setTimeout(() => {
            if(amber === "#ffbf80") {
                setAmber("white");
            } else {
                setAmber("#ffbf80");
            }
        }, 1000);
    }, [amber]);
    const [open, setOpen] = React.useState(false);

    const handleOpen = (id) => {
      setMachineID(id);
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };
    const stageRef = useRef(null);
    const [section, setSection] = React.useState<string>("Overall");
    const handleSectionChange = (event) => {
        setSection(event.target.value)      
    }
    const [machine, setMachine] = React.useState<string>("All");
    const handleMachineChange = (event) => {
        setMachine(event.target.value)      
    }
    const [allMachines, setAllMachines] = React.useState([]);
    const [allTexts, setAllTexts] = React.useState([]);
    const [machineID, setMachineID] = React.useState(null);

    return (
      <div style={{display: "flex", justifyContent: "center"}}>
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
                    onClick={() => {handleOpen(machine.machine.id)}} 
                    onTap={() => {handleOpen(machine.machine.id)}}
                    />)
                  }
              </Layer>
            </Stage>
          </Grid>
          <Grid item xs={3} sm={3} md={3} lg={3}>
            <Grid container style={{marginTop: "15px"}}>
              <Grid style={{display: "flex", justifyContent: "flex-end"}} item xs={5} sm={5} md={5} lg={5}>
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
                        <option value={"SENSOR1"}>SENSOR2</option>
                        <option value={"SENSOR2"}>SENSOR2</option>
                        <option value={"BAE"}>BAE</option>
                    </Select>
                </FormControl>
              </Grid>
              <Grid item xs={2} sm={2} md={2} lg={2}>

              </Grid>
              <Grid style={{display: "flex", justifyContent: "flex-start"}} item xs={5} sm={5} md={5} lg={5}>
                <FormControl variant="outlined" className={classes.formControl}>
                  <InputLabel ref={inputLabel} htmlFor="outlined-machine-native-simple">
                    Machine
                  </InputLabel>
                  <Select
                  native
                  value={machine}
                  onChange={(event) => handleMachineChange(event)}
                  labelWidth={labelWidth}
                  inputProps={{
                      name: 'section',
                      id: 'outlined-machine-native-simple',
                  }}
                  >
                    <option value={"All"}>All</option>
                    <option value={"ITS700"}>ITS700</option>
                    <option value={"ITS701"}>ITS701</option>
                  </Select>
                </FormControl>
              </Grid>
              <h2 style={{display: "flex", justifyContent: "center", width: "100%"}}>Components</h2>
              <div style={{display: 'flex', justifyContent: 'center', width: "100%"}}>
                <div style={{height: 725, overflow: 'auto', width: "80%"}}>
                  <List>
                    {
                      _.range(0, 5).map(value => {
                          return(
                            <ListItem button >
                              <ListItemText primary="Component" />
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
