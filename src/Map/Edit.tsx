import React, { useEffect, useRef, useState } from 'react';
import useImage from 'use-image';
import { Stage, Layer, Image, Text, Rect } from 'react-konva';
import { Grid, Button, Typography, CircularProgress, FormControlLabel, Checkbox } from '@material-ui/core';
import { InputNumber, Input } from 'antd';
import 'antd/dist/antd.css';
import { ENDPOINT } from "../utils/config";
import API from "../utils/API";
import { Link } from "react-router-dom";
import DropdownList from 'react-widgets/lib/DropdownList'
import 'react-widgets/dist/css/react-widgets.css';
import { confirmAlert } from 'react-confirm-alert'; 
import 'react-confirm-alert/src/react-confirm-alert.css'; 

const MapImage = () => {
    const [image] = useImage(process.env.PUBLIC_URL + '/Map.jpg');
    return <Image image={image} />;
};

export default function Edit(props) {
    const [textState, setTextState] = useState({
        text: '',
        x: 0,
        y: 0,
        fontSize: 12,
        rotation: 0
    })
    const [machineState, setMachineState] = useState({
        name: '',
        section: '',
        sectionID: '',
        x: 0,
        y: 0,
        height: 100,
        width: 100
    })
    const [addText, setAddText] = useState(false);
    const [addMachine, setAddMachine] = useState(false);
    const [sectionData, setSectionData] = useState([]);
    const [includeMachines, setIncludeMachines] = useState(true);
    const [includeText, setIncludeText] = useState(true);
    const [allMachines, setAllMachines] = React.useState(new Map());
    const [allTexts, setAllTexts] = React.useState(new Map());
    const [machineIDs, setMachineIDs] = useState([]);
    const [textIDs, setTextIDs] = useState([]);
    const [selectedTextID, setSelectedTextID] = useState("");
    const [selectedMachineID, setSelectedMachineID] = useState("");
    const [dropdownValue, setDropdownValue] = useState("");
    const stageRef = useRef(null);
    const [loading, setLoading] = React.useState(true);
    
    useEffect(() => {
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
            console.log(err);
        });
        api
        .get(`${ENDPOINT}/machine`)
        .then((data) => {
            setMachineIDs([]);
            let tempArray = [];
            allMachines.forEach((value, key) => {
                setAllMachines(new Map(allMachines.set(key, undefined)));
            })
            data.machines.forEach((machine) => {
                let temp = {
                    x: machine.x,
                    y: machine.y,
                    width: machine.width,
                    height: machine.height,
                    name: machine.name,
                    sectionID: machine.sectionID
                }
                tempArray.push(machine._id);
                setAllMachines(new Map(allMachines.set(machine._id, temp)));
            })
            setMachineIDs(tempArray);
        })
        .catch((error) => {
            props.setError(error.data.message);
        })
        api
        .get(`${ENDPOINT}/text`)
        .then((data) => {
            setTextIDs([]);
            let tempArray = [];
            allTexts.forEach((value, key) => {
                setAllTexts(new Map(allTexts.set(key, undefined)));
            })
            data.texts.forEach((text) => {
                let temp ={
                    text: text.text,
                    x: text.x,
                    y: text.y,
                    fontSize: text.fontSize,
                    rotation: text.rotation
                }
                tempArray.push(text._id);
                setAllTexts(new Map(allTexts.set(text._id, temp)));
            })
            setTextIDs(tempArray);
        })
        .catch((error) => {
            props.setError(error.data.message);
        })
    }, []);
    const createNewMachine = (event) => {
        let api = new API();
        setLoading(true)
        api
        .post(`${ENDPOINT}/machine/new`, {
            name: machineState.name,
            sectionID: machineState.sectionID,
            x: machineState.x,
            y: machineState.y,
            width: machineState.width,
            height: machineState.height
        })
        .then((data) => {
            machineIDs.push(data.machine._id)
            setMachineIDs(machineIDs);
            let temp = {
                x: data.machine.x,
                y: data.machine.y,
                width: data.machine.width,
                height: data.machine.height,
                name: data.machine.name,
                sectionID: data.machine.sectionID
            }
            setAllMachines(new Map(allMachines.set(data.machine._id, temp)))
            setLoading(false);
        })
        .catch((error) => {
            props.setError(error.data.message);
            setLoading(false);
        })
    }
    const createNewText = (event) => {
        let api = new API();
        setLoading(true)
        api
        .post(`${ENDPOINT}/text/new`, {
            text: textState.text,
            x: textState.x,
            y: textState.y,
            fontSize: textState.fontSize,
            rotation: textState.rotation
        })
        .then((data) => {
            textIDs.push(data.text._id);
            setTextIDs(textIDs);
            let temp ={
                text: data.text.text,
                x: data.text.x,
                y: data.text.y,
                fontSize: data.text.fontSize,
                rotation: data.text.rotation
            }
            setAllTexts(new Map(allTexts.set(data.text._id, temp)))
            setLoading(false);
        })
        .catch((error) => {
            props.setError(error.data.message);
            setLoading(false);
        })
    }
    const resetSingleText = () => {
        let api = new API();
        api
        .get(`${ENDPOINT}/text/single?_id=${selectedTextID}`)
        .then((data) => {
            let temp ={
                text: data.text.text,
                x: data.text.x,
                y: data.text.y,
                fontSize: data.text.fontSize,
                rotation: data.text.rotation
            }
            setAllTexts(new Map(allTexts.set(selectedTextID, temp)));
        })
        .catch((error) => {
            props.setError(error.data.message);
        })
    }
    const resetSingleMachine = () => {
        let api = new API();
        api
        .get(`${ENDPOINT}/machine/single?_id=${selectedMachineID}`)
        .then((data) => {
            let temp = {
                x: data.machine.x,
                y: data.machine.y,
                width: data.machine.width,
                height: data.machine.height,
                name: data.machine.name,
                sectionID: data.machine.sectionID
            }
            setAllMachines(new Map(allMachines.set(selectedMachineID, temp)));
            setDropdownValue(data.machine.sectionID);
        })
        .catch((error) => {
            props.setError(error.data.message);
        })
    }
    const resetAllText = () => {
        setLoading(true);
        let api = new API();
        api
        .get(`${ENDPOINT}/text`)
        .then((data) => {
            setTextIDs([]);
            let tempArray = [];
            allTexts.forEach((value, key) => {
                setAllTexts(new Map(allTexts.set(key, undefined)));
            })
            data.texts.forEach((text) => {
                let temp ={
                    text: text.text,
                    x: text.x,
                    y: text.y,
                    fontSize: text.fontSize,
                    rotation: text.rotation
                }
                tempArray.push(text._id);
                setAllTexts(new Map(allTexts.set(text._id, temp)));
            })
            setTextIDs(tempArray);
            setLoading(false);
        })
        .catch((error) => {
            setLoading(false);
            props.setError(error.data.message);
        })
    }
    const resetAllMachines = () => {
        setLoading(true);
        let api = new API();
        api
        .get(`${ENDPOINT}/machine`)
        .then((data) => {
            setMachineIDs([]);
            let tempArray = [];
            allMachines.forEach((value, key) => {
                setAllMachines(new Map(allMachines.set(key, undefined)));
            })
            data.machines.forEach((machine) => {
                let temp = {
                    x: machine.x,
                    y: machine.y,
                    width: machine.width,
                    height: machine.height,
                    name: machine.name,
                    sectionID: machine.sectionID
                }
                tempArray.push(machine._id);
                setAllMachines(new Map(allMachines.set(machine._id, temp)));
            })
            setMachineIDs(tempArray);
            setDropdownValue(allMachines.get(selectedMachineID).sectionID);
            setLoading(false);
        })
        .catch((error) => {
            setLoading(false);
            props.setError(error.data.message);
        })
    }
    const updateMachine = () => {
        setLoading(true);
        let api = new API();
        api
        .put(`${ENDPOINT}/machine/update`, {
            _id: selectedMachineID,
            name: allMachines.get(selectedMachineID).name,
            sectionID: allMachines.get(selectedMachineID).sectionID,
            x: allMachines.get(selectedMachineID).x,
            y: allMachines.get(selectedMachineID).y,
            width: allMachines.get(selectedMachineID).width,
            height: allMachines.get(selectedMachineID).height
        })
        .then((data) => {
            let temp = {
                x: data.machine.x,
                y: data.machine.y,
                width: data.machine.width,
                height: data.machine.height,
                name: data.machine.name,
                sectionID: data.machine.sectionID
            }
            setAllMachines(new Map(allMachines.set(selectedMachineID, temp)));  
            setLoading(false);          
        })
        .catch((error) => {
            setLoading(false);
            props.setError(error.data.message);
        })
    }
    const deleteMachine = () => {
        confirmAlert({
            title: 'Confirm to delete',
            message: 'Are you sure you want to delete the machine?',
            buttons: [
              {
                label: 'Yes',
                onClick: async () => {
                    setLoading(true);
                    let api = new API();
                    api
                    .post(`${ENDPOINT}/machine/delete`, {
                        _id: selectedMachineID
                    })
                    .then(() => {
                        api
                        .get(`${ENDPOINT}/machine`)
                        .then((data) => {
                            setMachineIDs([]);
                            let tempArray = [];
                            allMachines.forEach((value, key) => {
                                setAllMachines(new Map(allMachines.set(key, undefined)));
                            })
                            data.machines.forEach((machine) => {
                                let temp = {
                                    x: machine.x,
                                    y: machine.y,
                                    width: machine.width,
                                    height: machine.height,
                                    name: machine.name,
                                    sectionID: machine.sectionID
                                }
                                tempArray.push(machine._id);
                                setAllMachines(new Map(allMachines.set(machine._id, temp)));
                            })
                            setMachineIDs(tempArray);
                            setSelectedMachineID("");
                            setLoading(false);
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
              },
              {
                label: 'No',
                onClick: () => {}
              }
            ]
          });
    }
    const updateText = () => {
        setLoading(true);
        let api = new API();
        api
        .put(`${ENDPOINT}/text/update`, {
            _id: selectedTextID,
            text: allTexts.get(selectedTextID).text,
            x: allTexts.get(selectedTextID).x,
            y: allTexts.get(selectedTextID).y,
            fontSize: allTexts.get(selectedTextID).fontSize,
            rotation: allTexts.get(selectedTextID).rotation
        })
        .then((data) => {
            let temp ={
                text: data.text.text,
                x: data.text.x,
                y: data.text.y,
                fontSize: data.text.fontSize,
                rotation: data.text.rotation
            }
            setAllTexts(new Map(allTexts.set(selectedTextID, temp)));   
            setLoading(false);         
        })
        .catch((error) => {
            setLoading(false);
            props.setError(error.data.message);
        })
    }
    const deleteText = () => {
        confirmAlert({
            title: 'Confirm to delete',
            message: 'Are you sure you want to delete text?',
            buttons: [
              {
                label: 'Yes',
                onClick: async () => {
                    setLoading(true);
                    let api = new API();
                    api
                    .post(`${ENDPOINT}/text/delete`, {
                        _id: selectedTextID
                    })
                    .then(() => {
                        api
                        .get(`${ENDPOINT}/text`)
                        .then((data) => {
                            setTextIDs([]);
                            let tempArray = [];
                            allTexts.forEach((value, key) => {
                                setAllTexts(new Map(allTexts.set(key, undefined)));
                            })
                            data.texts.forEach((text) => {
                                let temp ={
                                    text: text.text,
                                    x: text.x,
                                    y: text.y,
                                    fontSize: text.fontSize,
                                    rotation: text.rotation
                                }
                                tempArray.push(text._id);
                                setAllTexts(new Map(allTexts.set(text._id, temp)));
                            })
                            setTextIDs(tempArray);
                            setSelectedTextID("");
                            setLoading(false);
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
              },
              {
                label: 'No',
                onClick: () => {}
              }
            ]
          });
    }
    return (
        <div style={{display: "flex", justifyContent: "center", height: "100%"}}>
            { loading ? (
                <div style={{height: "100%", width: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}>
                    <CircularProgress size={50} />
                </div>
            ) : (
                <Grid container>
                    <Grid style={{display: "flex", justifyContent: "flex-end"}} item xs={9} sm={9} md={9} lg={9}>
                        <Stage ref={stageRef} width={1375} height={972}>
                            <Layer>
                                <MapImage />
                                {
                                    includeMachines && (
                                        machineIDs.map((_id) => <Rect 
                                        x={allMachines.get(_id).x}
                                        y={allMachines.get(_id).y}
                                        width={allMachines.get(_id).width}
                                        height={allMachines.get(_id).height}
                                        fill={"#ffffb3"}
                                        draggable={(!addText && ! addMachine)}
                                        onDragMove = {(event) => {
                                            setAllMachines(new Map(allMachines.set(_id, {...allMachines.get(_id), x: event.currentTarget.attrs.x, y: event.currentTarget.attrs.y})));
                                        }}
                                        onClick={e => {setSelectedMachineID(_id); setDropdownValue(allMachines.get(_id).sectionID);}}
                                        onDragStart={e => {setSelectedMachineID(_id); setDropdownValue(allMachines.get(_id).sectionID);}}
                                        onTap={e => {setSelectedMachineID(_id); setDropdownValue(allMachines.get(_id).sectionID);}}
                                        />)
                                    )
                                }
                                {
                                    addMachine && (
                                        <Rect 
                                        x={machineState.x} 
                                        y={machineState.y} 
                                        width={machineState.width} 
                                        height={machineState.height} 
                                        fill={"#b3ffff"} 
                                        draggable
                                        onDragMove={(event) => {setMachineState({...machineState, x: event.currentTarget.attrs.x, y: event.currentTarget.attrs.y})}}
                                        />
                                    )
                                }
                                {
                                    includeText && (
                                        textIDs.map((_id) => <Text 
                                        text={allTexts.get(_id).text} 
                                        x={allTexts.get(_id).x} 
                                        y = {allTexts.get(_id).y} 
                                        rotation={allTexts.get(_id).rotation}
                                        fontSize={allTexts.get(_id).fontSize}
                                        fill={"black"}
                                        draggable={(!addText && ! addMachine)}
                                        onDragMove = {(event) => {
                                            setAllTexts(new Map(allTexts.set(_id, {...allTexts.get(_id), x: event.currentTarget.attrs.x, y: event.currentTarget.attrs.y})));
                                        }}
                                        onClick={e => setSelectedTextID(_id)}
                                        onDragStart={e => setSelectedTextID(_id)}
                                        onTap={e => setSelectedTextID(_id)}
                                        />)
                                    )
                                }
                                { addText && (
                                    <Text 
                                    x={textState.x} 
                                    y={textState.y} 
                                    text={textState.text} 
                                    fontSize={textState.fontSize} 
                                    rotation={textState.rotation} 
                                    draggable
                                    fill={"#cc3300"}
                                    onDragMove={(event) => {setTextState({...textState, x: event.currentTarget.attrs.x, y: event.currentTarget.attrs.y})}}
                                    />
                                )}
                            </Layer>
                        </Stage>
                    </Grid>
                    <Grid style={{paddingTop: "20px"}} item xs={3} sm={3} md={3} lg={3}>
                    { (!addText && ! addMachine) && (
                        <div style={{position: "relative", height: "960px"}}>
                            <Grid container>
                                <Grid item xs={6} sm={6} lg={6} md={6}>
                                    <Button style={{width: "80%"}} onClick={() => {setAddMachine(true)}} variant="contained" color="primary">Add Machine</Button>
                                </Grid>
                                <Grid item xs={6} sm={6} lg={6} md={6}>
                                    <Button style={{width: "80%"}} onClick={() => {setAddText(true)}} variant="contained" color="primary">Add Text</Button>
                                </Grid>
                            </Grid>
                            <div style={{marginTop: "15px"}}></div>
                            <FormControlLabel
                            control={
                                <Checkbox
                                checked={includeMachines}
                                onChange={(event) => setIncludeMachines(event.target.checked)}
                                color="primary"
                                />
                            }
                            label="Include Machines"
                            />
                            <FormControlLabel
                            control={
                                <Checkbox
                                checked={includeText}
                                onChange={(event) => setIncludeText(event.target.checked)}
                                color="primary"
                                />
                            }
                            label="Include Text"
                            />
                            <div style={{margin: "20px", border: "1px solid black", borderRadius: "10px"}}>
                                <h2 style={{marginBottom: "5px", marginTop: "5px", fontSize: 30}}><b>Update text</b></h2>
                                <hr />
                                { !selectedTextID ? (
                                    <h2>Select a text to begin</h2>
                                ) : (
                                    <Grid container>
                                        <Grid style={{marginTop: "5px", display: 'flex', justifyContent: 'flex-end'}} item xs={4} sm={4} md={4} lg={4}>
                                            <div style={{width: '80%', display: "flex", justifyContent: "flex-start"}}>
                                                <Typography style={{textAlign: "left", fontSize: 20, fontWeight: 'bold'}}>Text:</Typography>
                                            </div>
                                        </Grid>
                                        <Grid style={{marginTop: "5px"}} item xs={8} sm={8} md={8} lg={8}>
                                            <Input style={{width: "80%"}} value={allTexts.get(selectedTextID).text} onChange={(event) => {
                                                setAllTexts(new Map(allTexts.set(selectedTextID, {...allTexts.get(selectedTextID), text: event.target.value})));
                                            }} />
                                        </Grid>
                                        <Grid style={{marginTop: "5px", display: 'flex', justifyContent: 'flex-end'}} item xs={4} sm={4} md={4} lg={4}>
                                            <div style={{width: '80%', display: "flex", justifyContent: "flex-start"}}>
                                                <Typography style={{textAlign: "left", fontSize: 20, fontWeight: 'bold'}}>x:</Typography>
                                            </div>
                                        </Grid>
                                        <Grid style={{marginTop: "5px"}} item xs={8} sm={8} md={8} lg={8}>
                                            <InputNumber style={{width: "80%"}} value={allTexts.get(selectedTextID).x} step={1} onChange={(number) => {
                                                setAllTexts(new Map(allTexts.set(selectedTextID, {...allTexts.get(selectedTextID), x: number})));
                                            }} />
                                        </Grid>
                                        <Grid style={{marginTop: "5px", display: 'flex', justifyContent: 'flex-end'}} item xs={4} sm={4} md={4} lg={4}>
                                            <div style={{width: '80%', display: "flex", justifyContent: "flex-start"}}>
                                                <Typography style={{textAlign: "left", fontSize: 20, fontWeight: 'bold'}}>y:</Typography>
                                            </div>
                                        </Grid>
                                        <Grid style={{marginTop: "5px"}} item xs={8} sm={8} md={8} lg={8}>
                                            <InputNumber style={{width: "80%"}} value={allTexts.get(selectedTextID).y} step={1} onChange={(number) => {
                                                setAllTexts(new Map(allTexts.set(selectedTextID, {...allTexts.get(selectedTextID), y: number})));
                                            }} />
                                        </Grid>
                                        <Grid style={{marginTop: "5px", display: 'flex', justifyContent: 'flex-end'}} item xs={4} sm={4} md={4} lg={4}>
                                            <div style={{width: '80%', display: "flex", justifyContent: "flex-start"}}>
                                                <Typography style={{textAlign: "left", fontSize: 20, fontWeight: 'bold'}}>Font Size:</Typography>
                                            </div>
                                        </Grid>
                                        <Grid style={{marginTop: "5px"}} item xs={8} sm={8} md={8} lg={8}>
                                            <InputNumber style={{width: "80%"}} min={1} value={allTexts.get(selectedTextID).fontSize} step={1} onChange={(number) => {
                                                setAllTexts(new Map(allTexts.set(selectedTextID, {...allTexts.get(selectedTextID), fontSize: number})));
                                            }} />
                                        </Grid>
                                        <Grid style={{marginTop: "5px", display: 'flex', justifyContent: 'flex-end'}} item xs={4} sm={4} md={4} lg={4}>
                                            <div style={{width: '80%', display: "flex", justifyContent: "flex-start"}}>
                                                <Typography style={{textAlign: "left", fontSize: 20, fontWeight: 'bold'}}>Rotation:</Typography>
                                            </div>
                                        </Grid>
                                        <Grid style={{marginTop: "5px"}} item xs={8} sm={8} md={8} lg={8}>
                                            <InputNumber style={{width: "80%"}} value={allTexts.get(selectedTextID).rotation} step={1} onChange={(number) => {
                                                setAllTexts(new Map(allTexts.set(selectedTextID, {...allTexts.get(selectedTextID), rotation: number})));
                                            }} />
                                        </Grid>
                                        <div style={{display: "flex", justifyContent: "center", width: "100%"}}>
                                            <Grid style={{width: "80%"}} container>
                                                <Grid item xs={6} sm={6} lg={6} md={6}>
                                                    <div style={{marginTop: "20px", display: 'flex', justifyContent: 'flex-start', width: '100%'}}>
                                                        <Button style={{width: "90%"}} onClick={resetSingleText} variant="contained" color="primary">Refresh</Button>
                                                    </div>
                                                </Grid>
                                                <Grid item xs={6} sm={6} lg={6} md={6}>
                                                    <div style={{marginTop: "20px", marginBottom: "10px", display: 'flex', justifyContent: 'flex-end', width: '100%'}}>
                                                        <Button style={{width: "90%"}} onClick={resetAllText} variant="contained" color="primary">Refresh All</Button>
                                                    </div>
                                                </Grid>
                                            </Grid>
                                        </div>
                                        <div style={{display: "flex", justifyContent: "center", width: "100%"}}>
                                            <Grid style={{width: "80%"}} container>
                                                <Grid item xs={6} sm={6} lg={6} md={6}>
                                                    <div style={{display: 'flex', justifyContent: 'flex-start', width: '100%'}}>
                                                        <Button style={{width: "90%"}} onClick={updateText} variant="contained" color="primary">Update</Button>
                                                    </div>
                                                </Grid>
                                                <Grid item xs={6} sm={6} lg={6} md={6}>
                                                    <div style={{marginBottom: "20px", display: 'flex', justifyContent: 'flex-end', width: '100%'}}>
                                                        <Button style={{width: "90%"}} onClick={deleteText} variant="contained" color="primary">Delete</Button>
                                                    </div>
                                                </Grid>
                                            </Grid>
                                        </div>
                                    </Grid>
                                ) }
                            </div>
                            <div style={{margin: "20px", border: "1px solid black", borderRadius: "10px"}}>
                                <h2 style={{marginBottom: "5px", marginTop: "5px", fontSize: 30}}><b>Update Machine</b></h2>
                                <hr />
                                {
                                    !selectedMachineID ? (
                                        <h2>Select a machine to begin</h2>
                                    ) : (
                                        <Grid container>
                                            <Grid style={{display: 'flex', justifyContent: 'flex-end', marginTop: "5px"}} item xs={4} sm={4} md={4} lg={4}>
                                                <div style={{width: '80%', display: "flex", justifyContent: "flex-start"}}>
                                                    <Typography style={{textAlign: "left", fontSize: 20, fontWeight: 'bold'}}>Name:</Typography>
                                                </div>
                                            </Grid>
                                            <Grid style={{marginTop: "5px"}} item xs={8} sm={8} md={8} lg={8}>
                                                <Input style={{width: "80%"}} value={allMachines.get(selectedMachineID).name} onChange={(event) => {
                                                    setAllMachines(new Map(allMachines.set(selectedMachineID, {...allMachines.get(selectedMachineID), name: event.target.value})));
                                                }} />
                                            </Grid>
                                            <Grid style={{marginTop: "5px", display: 'flex', justifyContent: 'flex-end'}} item xs={4} sm={4} md={4} lg={4}>
                                                <div style={{width: '80%', display: "flex", justifyContent: "flex-start"}}>
                                                    <Typography style={{textAlign: "left", fontSize: 20, fontWeight: 'bold'}}>Section:</Typography>
                                                </div>
                                            </Grid>
                                            <Grid style={{marginTop: "5px"}} item xs={8} sm={8} md={8} lg={8}>
                                                <div style={{display: "flex", justifyContent: "center"}}>
                                                    <div style={{width: "80%"}}>
                                                        <DropdownList 
                                                        filter="contains"
                                                        data={sectionData}
                                                        value={dropdownValue}
                                                        textField="name"
                                                        valueField="_id"
                                                        defaultValue={allMachines.get(selectedMachineID).sectionID}
                                                        onChange={value => {
                                                            setAllMachines(new Map(allMachines.set(selectedMachineID, {...allMachines.get(selectedMachineID), sectionID: value._id})));
                                                            setDropdownValue(value._id);
                                                        }}
                                                        />
                                                    </div>
                                                </div>
                                            </Grid>
                                            <Grid style={{marginTop: "5px", display: 'flex', justifyContent: 'flex-end'}} item xs={4} sm={4} md={4} lg={4}>
                                                <div style={{width: '80%', display: "flex", justifyContent: "flex-start"}}>
                                                    <Typography style={{textAlign: "left", fontSize: 20, fontWeight: 'bold'}}>x:</Typography>
                                                </div>
                                            </Grid>
                                            <Grid style={{marginTop: "5px"}} item xs={8} sm={8} md={8} lg={8}>
                                                <InputNumber style={{width: "80%"}} value={allMachines.get(selectedMachineID).x} step={1} onChange={(number) => {
                                                    setAllMachines(new Map(allMachines.set(selectedMachineID, {...allMachines.get(selectedMachineID), x: number})));
                                                }} />
                                            </Grid>
                                            <Grid style={{marginTop: "5px", display: 'flex', justifyContent: 'flex-end'}} item xs={4} sm={4} md={4} lg={4}>
                                                <div style={{width: '80%', display: "flex", justifyContent: "flex-start"}}>
                                                    <Typography style={{textAlign: "left", fontSize: 20, fontWeight: 'bold'}}>y:</Typography>
                                                </div>
                                            </Grid>
                                            <Grid style={{marginTop: "5px"}} item xs={8} sm={8} md={8} lg={8}>
                                                <InputNumber style={{width: "80%"}} value={allMachines.get(selectedMachineID).y} step={1} onChange={(number) => {
                                                    setAllMachines(new Map(allMachines.set(selectedMachineID, {...allMachines.get(selectedMachineID), y: number})));
                                                }} />
                                            </Grid>
                                            <Grid style={{marginTop: "5px", display: 'flex', justifyContent: 'flex-end'}} item xs={4} sm={4} md={4} lg={4}>
                                                <div style={{width: '80%', display: "flex", justifyContent: "flex-start"}}>
                                                    <Typography style={{textAlign: "left", fontSize: 20, fontWeight: 'bold'}}>Height:</Typography>
                                                </div>
                                            </Grid>
                                            <Grid style={{marginTop: "5px"}} item xs={8} sm={8} md={8} lg={8}>
                                                <InputNumber style={{width: "80%"}} value={allMachines.get(selectedMachineID).height} step={1} onChange={(number) => {
                                                    setAllMachines(new Map(allMachines.set(selectedMachineID, {...allMachines.get(selectedMachineID), height: number})));
                                                }} />
                                            </Grid>
                                            <Grid style={{marginTop: "5px", display: 'flex', justifyContent: 'flex-end'}} item xs={4} sm={4} md={4} lg={4}>
                                                <div style={{width: '80%', display: "flex", justifyContent: "flex-start"}}>
                                                    <Typography style={{textAlign: "left", fontSize: 20, fontWeight: 'bold'}}>Width:</Typography>
                                                </div>
                                            </Grid>
                                            <Grid style={{marginTop: "5px"}} item xs={8} sm={8} md={8} lg={8}>
                                                <InputNumber style={{width: "80%"}} value={allMachines.get(selectedMachineID).width} step={1} onChange={(number) => {
                                                    setAllMachines(new Map(allMachines.set(selectedMachineID, {...allMachines.get(selectedMachineID), width: number})));
                                                }} />
                                            </Grid>
                                            <div style={{display: "flex", justifyContent: "center", width: "100%"}}>
                                                <Grid style={{width: "80%"}} container>
                                                    <Grid item xs={6} sm={6} lg={6} md={6}>
                                                        <div style={{marginTop: "20px", display: 'flex', justifyContent: 'flex-start', width: '100%'}}>
                                                            <Button style={{width: "90%"}} onClick={resetSingleMachine} variant="contained" color="primary">Refresh</Button>
                                                        </div>
                                                    </Grid>
                                                    <Grid item xs={6} sm={6} lg={6} md={6}>
                                                        <div style={{marginTop: "20px", marginBottom: "10px", display: 'flex', justifyContent: 'flex-end', width: '100%'}}>
                                                            <Button style={{width: "90%"}} onClick={resetAllMachines} variant="contained" color="primary">Refresh All</Button>
                                                        </div>
                                                    </Grid>
                                                </Grid>
                                            </div>
                                            <div style={{display: "flex", justifyContent: "center", width: "100%"}}>
                                                <Grid style={{width: "80%"}} container>
                                                    <Grid item xs={6} sm={6} lg={6} md={6}>
                                                        <div style={{ display: 'flex', justifyContent: 'flex-start', width: '100%'}}>
                                                            <Button style={{width: "90%"}} onClick={updateMachine} variant="contained" color="primary">Update</Button>
                                                        </div>
                                                    </Grid>
                                                    <Grid item xs={6} sm={6} lg={6} md={6}>
                                                        <div style={{marginBottom: "20px", display: 'flex', justifyContent: 'flex-end', width: '100%'}}>
                                                            <Button style={{width: "90%"}} onClick={deleteMachine} variant="contained" color="primary">Delete</Button>
                                                        </div>
                                                    </Grid>
                                                </Grid>
                                            </div>
                                        </Grid>
                                    )
                                }
                            </div>
                            <div style={{position: "absolute", bottom: "0px", display: 'flex', justifyContent: 'center', width: '100%'}}>
                                <Link style={{width: "100%"}} to="/"><Button style={{width: "80%"}} variant="contained" color="primary">Back to map</Button></Link>
                            </div>
                        </div>
                    ) }
                    {
                        addText && (
                            <div>
                                <Button style={{width: "80%"}} onClick={() => {setAddText(false)}} variant="contained" color="primary">Back</Button>
                                <div style={{margin: "20px", border: "1px solid black", borderRadius: "20px"}}>
                                    <h2 style={{marginBottom: "5px", marginTop: "5px", fontSize: 30}}><b>Add text</b></h2>
                                    <hr />
                                    <Grid container>
                                        <Grid style={{marginTop: "5px", display: 'flex', justifyContent: 'flex-end'}} item xs={4} sm={4} md={4} lg={4}>
                                            <div style={{width: '80%', display: "flex", justifyContent: "flex-start"}}>
                                                <Typography style={{textAlign: "left", fontSize: 20, fontWeight: 'bold'}}>Text:</Typography>
                                            </div>
                                        </Grid>
                                        <Grid style={{marginTop: "5px"}} item xs={8} sm={8} md={8} lg={8}>
                                        <Input style={{width: "80%"}} value={textState.text} onChange={(event) => {setTextState({...textState, text: event.target.value})}} />
                                        </Grid>
                                        <Grid style={{marginTop: "5px", display: 'flex', justifyContent: 'flex-end'}} item xs={4} sm={4} md={4} lg={4}>
                                            <div style={{width: '80%', display: "flex", justifyContent: "flex-start"}}>
                                                <Typography style={{textAlign: "left", fontSize: 20, fontWeight: 'bold'}}>x:</Typography>
                                            </div>
                                        </Grid>
                                        <Grid style={{marginTop: "5px"}} item xs={8} sm={8} md={8} lg={8}>
                                            <InputNumber style={{width: "80%"}} value={textState.x} step={1} onChange={(number) => {setTextState({...textState, x: number})}} />
                                        </Grid>
                                        <Grid style={{marginTop: "5px", display: 'flex', justifyContent: 'flex-end'}} item xs={4} sm={4} md={4} lg={4}>
                                            <div style={{width: '80%', display: "flex", justifyContent: "flex-start"}}>
                                                <Typography style={{textAlign: "left", fontSize: 20, fontWeight: 'bold'}}>y:</Typography>
                                            </div>
                                        </Grid>
                                        <Grid style={{marginTop: "5px"}} item xs={8} sm={8} md={8} lg={8}>
                                            <InputNumber style={{width: "80%"}} value={textState.y} step={1} onChange={(number) => {setTextState({...textState, y: number})}} />
                                        </Grid>
                                        <Grid style={{marginTop: "5px", display: 'flex', justifyContent: 'flex-end'}} item xs={4} sm={4} md={4} lg={4}>
                                            <div style={{width: '80%', display: "flex", justifyContent: "flex-start"}}>
                                                <Typography style={{textAlign: "left", fontSize: 20, fontWeight: 'bold'}}>Font Size:</Typography>
                                            </div>
                                        </Grid>
                                        <Grid style={{marginTop: "5px"}} item xs={8} sm={8} md={8} lg={8}>
                                            <InputNumber style={{width: "80%"}} min={1} value={textState.fontSize} step={1} onChange={(number) => {setTextState({...textState, fontSize: number})}} />
                                        </Grid>
                                        <Grid style={{marginTop: "5px", display: 'flex', justifyContent: 'flex-end'}} item xs={4} sm={4} md={4} lg={4}>
                                            <div style={{width: '80%', display: "flex", justifyContent: "flex-start"}}>
                                                <Typography style={{textAlign: "left", fontSize: 20, fontWeight: 'bold'}}>Rotation:</Typography>
                                            </div>
                                        </Grid>
                                        <Grid style={{marginTop: "5px"}} item xs={8} sm={8} md={8} lg={8}>
                                            <InputNumber style={{width: "80%"}} value={textState.rotation} step={1} onChange={(number) => {setTextState({...textState, rotation: number})}} />
                                        </Grid>
                                        <div style={{width: "100%", marginTop: "10px", display: "flex", justifyContent: "center"}}>
                                            <FormControlLabel
                                            control={
                                                <Checkbox
                                                checked={includeMachines}
                                                onChange={(event) => setIncludeMachines(event.target.checked)}
                                                color="primary"
                                                />
                                            }
                                            label="Include Machines"
                                            />
                                            <FormControlLabel
                                            control={
                                                <Checkbox
                                                checked={includeText}
                                                onChange={(event) => setIncludeText(event.target.checked)}
                                                color="primary"
                                                />
                                            }
                                            label="Include Text"
                                            />
                                        </div>
                                        <div style={{marginTop: "40px", marginBottom: "40px", display: 'flex', justifyContent: 'center', width: '100%'}}>
                                            <Button style={{width: "80%"}} variant="contained" color="primary" onClick={createNewText}>Save</Button>
                                        </div>
                                    </Grid>
                                </div>
                            </div>
                        )
                    }
                    {
                        addMachine && (
                            <div>
                                <Button style={{width: "80%"}} onClick={() => {setAddMachine(false)}} variant="contained" color="primary">Back</Button>
                                <div style={{margin: "20px", border: "1px solid black", borderRadius: "20px"}}>
                                    <h2 style={{marginBottom: "5px", marginTop: "5px", fontSize: 30}}><b>Add Machine</b></h2>
                                    <hr />
                                    <Grid container>
                                        <Grid style={{display: 'flex', justifyContent: 'flex-end', marginTop: "5px"}} item xs={4} sm={4} md={4} lg={4}>
                                            <div style={{width: '80%', display: "flex", justifyContent: "flex-start"}}>
                                                <Typography style={{textAlign: "left", fontSize: 20, fontWeight: 'bold'}}>Name:</Typography>
                                            </div>
                                        </Grid>
                                        <Grid style={{marginTop: "5px"}} item xs={8} sm={8} md={8} lg={8}>
                                            <Input style={{width: "80%"}} value={machineState.name} onChange={(event) => {setMachineState({...machineState, name: event.target.value})}} />
                                        </Grid>
                                        <Grid style={{marginTop: "5px", display: 'flex', justifyContent: 'flex-end'}} item xs={4} sm={4} md={4} lg={4}>
                                            <div style={{width: '80%', display: "flex", justifyContent: "flex-start"}}>
                                                <Typography style={{textAlign: "left", fontSize: 20, fontWeight: 'bold'}}>Section:</Typography>
                                            </div>
                                        </Grid>
                                        <Grid style={{marginTop: "5px"}} item xs={8} sm={8} md={8} lg={8}>
                                            <div style={{display: "flex", justifyContent: "center"}}>
                                                <div style={{width: "80%"}}>
                                                    <DropdownList 
                                                    filter="contains"
                                                    data={sectionData}
                                                    textField="name"
                                                    valueField="_id"
                                                    onChange={value => {setMachineState({...machineState, section: value.name, sectionID: value._id})}}
                                                    />
                                                </div>
                                            </div>
                                        </Grid>
                                        <Grid style={{marginTop: "5px", display: 'flex', justifyContent: 'flex-end'}} item xs={4} sm={4} md={4} lg={4}>
                                            <div style={{width: '80%', display: "flex", justifyContent: "flex-start"}}>
                                                <Typography style={{textAlign: "left", fontSize: 20, fontWeight: 'bold'}}>x:</Typography>
                                            </div>
                                        </Grid>
                                        <Grid style={{marginTop: "5px"}} item xs={8} sm={8} md={8} lg={8}>
                                            <InputNumber style={{width: "80%"}} value={machineState.x} step={1} onChange={(number) => {setMachineState({...machineState, x: number})}} />
                                        </Grid>
                                        <Grid style={{marginTop: "5px", display: 'flex', justifyContent: 'flex-end'}} item xs={4} sm={4} md={4} lg={4}>
                                            <div style={{width: '80%', display: "flex", justifyContent: "flex-start"}}>
                                                <Typography style={{textAlign: "left", fontSize: 20, fontWeight: 'bold'}}>y:</Typography>
                                            </div>
                                        </Grid>
                                        <Grid style={{marginTop: "5px"}} item xs={8} sm={8} md={8} lg={8}>
                                            <InputNumber style={{width: "80%"}} value={machineState.y} step={1} onChange={(number) => {setMachineState({...machineState, y: number})}} />
                                        </Grid>
                                        <Grid style={{marginTop: "5px", display: 'flex', justifyContent: 'flex-end'}} item xs={4} sm={4} md={4} lg={4}>
                                            <div style={{width: '80%', display: "flex", justifyContent: "flex-start"}}>
                                                <Typography style={{textAlign: "left", fontSize: 20, fontWeight: 'bold'}}>Height:</Typography>
                                            </div>
                                        </Grid>
                                        <Grid style={{marginTop: "5px"}} item xs={8} sm={8} md={8} lg={8}>
                                            <InputNumber style={{width: "80%"}} value={machineState.height} step={1} onChange={(number) => {setMachineState({...machineState, height: number})}} />
                                        </Grid>
                                        <Grid style={{marginTop: "5px", display: 'flex', justifyContent: 'flex-end'}} item xs={4} sm={4} md={4} lg={4}>
                                            <div style={{width: '80%', display: "flex", justifyContent: "flex-start"}}>
                                                <Typography style={{textAlign: "left", fontSize: 20, fontWeight: 'bold'}}>Width:</Typography>
                                            </div>
                                        </Grid>
                                        <Grid style={{marginTop: "5px"}} item xs={8} sm={8} md={8} lg={8}>
                                            <InputNumber style={{width: "80%"}} value={machineState.width} step={1} onChange={(number) => {setMachineState({...machineState, width: number})}} />
                                        </Grid>
                                        <div style={{width: "100%", marginTop: "10px", display: "flex", justifyContent: "center"}}>
                                            <FormControlLabel
                                            control={
                                                <Checkbox
                                                checked={includeMachines}
                                                onChange={(event) => setIncludeMachines(event.target.checked)}
                                                color="primary"
                                                />
                                            }
                                            label="Include Machines"
                                            />
                                            <FormControlLabel
                                            control={
                                                <Checkbox
                                                checked={includeText}
                                                onChange={(event) => setIncludeText(event.target.checked)}
                                                color="primary"
                                                />
                                            }
                                            label="Include Text"
                                            />
                                        </div>
                                        <div style={{marginTop: "40px", marginBottom: "40px", display: 'flex', justifyContent: 'center', width: '100%'}}>
                                            <Button onClick={createNewMachine} style={{width: "80%"}} variant="contained" color="primary">Save</Button>
                                        </div>
                                    </Grid>
                                </div>
                            </div>
                        )
                    }
                    </Grid>
                </Grid>
            )}
        </div>
    )
}