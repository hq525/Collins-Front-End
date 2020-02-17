import React, {useCallback} from "react";
import { makeStyles, createStyles } from '@material-ui/styles';
import { Grid as MainGrid, Modal, Button, FormControl, List, ListItem, ListItemText, Theme, Select, InputLabel } from '@material-ui/core';
import SectionData from "./Components/SectionData";
import JobData from "./Components/JobData";
import ComponentData from "./Components/ComponentData";
import {useDropzone} from 'react-dropzone'
import { ENDPOINT } from "../utils/config";
import API from "../utils/API";
import ProductivityMenu  from "./ProductivityMenu"
import _ from "lodash";

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
      width: "50%",
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
  }),
);

const FileUpload = (props) => {
    const classes = useStyles({});
    const [errors, setErrors] = React.useState([]);
    const [file, setFile] = React.useState(null);
    const onDrop = useCallback(acceptedFiles => {
        setFile(acceptedFiles[0]);
    }, [])
    const {getRootProps, rejectedFiles, getInputProps, isDragActive} = useDropzone({onDrop, accept: '.xls, .xlsx'})
    
    const uploadFile = () => {
        setErrors([]);
        const data = new FormData()
        data.append('file', file, file.name)
        let api = new API();
        api
        .post(`${ENDPOINT}/upload/jobs`, data)
        .then((data) => {
            if(data.errors) {
                setErrors(data.errors);
            } else {
                props.setResetJobs(!props.resetJobs);
                props.handleClose();
            }
        })
        .catch((error) => {
            if(error.data && error.data.message) {
                props.setError(error.data.message);
            } else {
                props.setError("An error occurred");
            }
        })
    }
    
    return(
        <div style={{top: "50%", left: "50%", transform: "translate(-50%, -50%)", backgroundColor: "white", borderWidth: "0px"}} className={classes.paper}>
            <MainGrid container>
                <MainGrid item xs={3} sm={3} md={3} lg={3}>
                    <div style={{display: "flex", justifyContent: "center"}}>
                        <a style={{textDecoration: "none", color: "white", width: "80%"}} href={`${ENDPOINT}/upload/jobs/sample`}><Button style={{width: "100%"}} variant="contained" color="primary">Get sample</Button></a>
                    </div>
                </MainGrid>
                <MainGrid item xs={6} sm={6} md={6} lg={6}>
                    <div style={{display: "flex", justifyContent: "center"}}>
                        <h2 style={{fontWeight: "bold", fontSize: 30}}>Upload Excel</h2>
                    </div>
                </MainGrid>
                <MainGrid item xs={3} sm={3} md={3} lg={3}>
                    <div style={{display: "flex", justifyContent: "center"}}>
                        <Button onClick={uploadFile} disabled={!file} style={{width: "80%"}} variant="contained" color="primary">Upload</Button>
                    </div>
                </MainGrid>
            </MainGrid>
            <div style={{backgroundColor: "#f2f2f2", borderStyle: "dashed", borderWidth: "2px", marginTop: "20px", height: "100px", display: "flex", justifyContent: "center", alignItems: "center"}} {...getRootProps()}>
                <input {...getInputProps()} />
                {
                    isDragActive ?
                    <p>Drop the files here ...</p> : (
                        <div>
                            { file ? (
                                <p>{file.name}</p>
                            ) : (
                                <div>
                                    <p>Drag 'n' drop some files here, or click to select files</p>
                                    {
                                        rejectedFiles.length > 0 ? (<p>(Only files with .xls and .xlsx extensions are allowed)</p>) : (null)
                                    }
                                </div>
                            )}
                        </div>
                    )
                }
            </div>
            {
                (errors.length > 0) && (
                    <div>
                        <h2 style={{display: "flex", justifyContent: "flex-start", width: "80%", color: "red", marginTop: "20px"}}>Errors</h2>
                        <div style={{display: 'flex', justifyContent: 'center', width: "100%"}}>
                            <div style={{maxHeight: 300, overflow: 'auto', width: "100%"}}>
                                <List>
                                    {
                                    errors.map(error => {
                                        return(
                                            <ListItem button >
                                                <ListItemText style={{color: "red"}} primary={`${error}`} />
                                            </ListItem>
                                        )  
                                        }
                                    )
                                    }
                                </List>
                            </div>
                        </div>
                    </div>
                )
            }
        </div>
    )
}

const Top = (props) => {
    const classes = useStyles({});
    const monthInputLabel = React.useRef<HTMLLabelElement>(null);
    const [monthLabelWidth, setMonthLabelWidth] = React.useState(0);
    const yearInputLabel = React.useRef<HTMLLabelElement>(null);
    const [yearLabelWidth, setYearLabelWidth] = React.useState(0);
    React.useEffect(() => {
        if(props.job) {
            setMonthLabelWidth(monthInputLabel.current!.offsetWidth);
            setYearLabelWidth(yearInputLabel.current!.offsetWidth);
        }
    }, [props]);
    return (
        <MainGrid container style={{marginTop: "20px"}}>
            <MainGrid style={{display: "flex", justifyContent: "flex-end", alignItems: "center"}} item xs={5} sm={5} md={5} lg={5}>
                {
                    props.job ? (
                        <div style={{width: "76%", display: "flex", justifyContent: "flex-start", alignItems: "center"}}>
                            <Button variant="contained" onClick={props.handleOpen}>
                                Upload Excel
                            </Button>
                            <FormControl style={{marginLeft: "20px"}} variant="outlined" className={classes.formControl}>
                                <InputLabel ref={monthInputLabel} htmlFor="outlined-month-native-simple">
                                    Month
                                </InputLabel>
                                <Select
                                native
                                value={props.month}
                                onChange={(event) => {props.setMonth(event.target.value)}}
                                labelWidth={monthLabelWidth}
                                inputProps={{
                                    name: 'month',
                                    id: 'outlined-month-native-simple',
                                }}
                                >
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
                            <FormControl style={{marginLeft: "20px"}} variant="outlined" className={classes.formControl}>
                                <InputLabel ref={yearInputLabel} htmlFor="outlined-year-native-simple">
                                    Year
                                </InputLabel>
                                <Select
                                native
                                value={props.year}
                                onChange={(event) => props.setYear(event.target.value)}
                                labelWidth={yearLabelWidth}
                                inputProps={{
                                    name: 'year',
                                    id: 'outlined-year-native-simple',
                                }}
                                >
                                    {
                                        _.range(2013, new Date().getFullYear()+1).map(value => <option key={value} value={value}>{value}</option>)
                                    }
                                </Select>
                                </FormControl>
                        </div>
                    ) : (
                        <div>

                        </div>
                    )
                }
            </MainGrid>
            <MainGrid style={{display: "flex", justifyContent: "center", alignItems: "center"}} item xs={2} sm={2} md={2} lg={2}>
                <h1 style={{marginBottom: "0px"}}><b>Edit Data</b></h1>
            </MainGrid>
            <MainGrid style={{display: 'flex', justifyContent: 'flex-start', alignItems: "center"}} item xs={5} sm={5} md={5} lg={5}>
                <div style={{width: "77%", display: "flex", justifyContent: "flex-end", alignItems: "center"}}>   
                    <FormControl variant="outlined" className={props.classess.formControl}>
                        <Select
                        native
                        value={props.dataType}
                        onChange={(event) => props.handleDataTypeChange(event)}
                        inputProps={{
                            name: 'dataType',
                            id: 'outlined-dataType-native-simple',
                        }}
                        >
                            <option value={'JOBS'}>Jobs</option>
                            <option value={'SECTIONS'}>Sections</option>
                            <option value={'COMPONENTS'}>Components</option>
                        </Select>
                    </FormControl>
                </div>
            </MainGrid>
        </MainGrid>
    )
}

export default function Data(props) {
    const classes = useStyles({});

    const [month, setMonth] = React.useState(new Date().getMonth());
    const [year, setYear] = React.useState(new Date().getFullYear());

    const [open, setOpen] = React.useState(false);
    const [resetJobs, setResetJobs] = React.useState(true);

    const handleOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };
    const [dataType, setDataType] = React.useState('JOBS');
    const handleDataTypeChange = (event) => {
        setDataType(event.target.value)      
    }

    switch(dataType) {
        case 'JOBS':
            if(resetJobs) {
                return(
                    <div style={{height: "100%"}}>
                        <ProductivityMenu />
                        <Top month={month} year={year} setMonth={setMonth} setYear={setYear} job={true} classess={classes} dataType={dataType} handleDataTypeChange={handleDataTypeChange} handleOpen={handleOpen} />
                        <div style={{marginTop: "20px"}}></div>
                        <JobData month={month} year={year} reset={false} setError={props.setError} />
                        <Modal
                            aria-labelledby="simple-modal-title"
                            aria-describedby="simple-modal-description"
                            open={open}
                            onClose={handleClose}
                        >
                            <FileUpload handleClose={handleClose} resetJobs={resetJobs} setResetJobs={setResetJobs} setError={props.setError} />
                        </Modal>
                    </div>
                )
            } else {
                return(
                    <div style={{height: "100%"}}>
                        <ProductivityMenu />
                        <Top month={month} year={year} setMonth={setMonth} setYear={setYear} job={true} classess={classes} dataType={dataType} handleDataTypeChange={handleDataTypeChange} handleOpen={handleOpen} />
                        <div style={{marginTop: "20px"}}></div>
                        <JobData month={month} year={year} reset={true} setError={props.setError} />
                        <Modal
                            aria-labelledby="simple-modal-title"
                            aria-describedby="simple-modal-description"
                            open={open}
                            onClose={handleClose}
                        >
                            <FileUpload setError={props.setError} />
                        </Modal>
                    </div>
                )
            }
        case 'SECTIONS':
            return (
                <div style={{height: "100%"}}>
                    <ProductivityMenu />
                    <Top month={month} year={year} setMonth={setMonth} setYear={setYear} job={false} classess={classes} dataType={dataType} handleDataTypeChange={handleDataTypeChange} handleOpen={handleOpen} />
                    <div style={{marginTop: "20px"}}></div>
                    <SectionData setError={props.setError} />
                    <Modal
                        aria-labelledby="simple-modal-title"
                        aria-describedby="simple-modal-description"
                        open={open}
                        onClose={handleClose}
                    >
                        <FileUpload setError={props.setError} />
                    </Modal>
                </div>
            )
        case 'COMPONENTS':
            return (
                <div style={{height: "100%"}}>
                    <ProductivityMenu />
                    <Top month={month} year={year} setMonth={setMonth} setYear={setYear} job={false} classess={classes} dataType={dataType} handleDataTypeChange={handleDataTypeChange} handleOpen={handleOpen} />
                    <div style={{marginTop: "20px"}}></div>
                    <ComponentData setError={props.setError} />
                    <Modal
                        aria-labelledby="simple-modal-title"
                        aria-describedby="simple-modal-description"
                        open={open}
                        onClose={handleClose}
                    >
                        <FileUpload setError={props.setError} />
                    </Modal>
                </div>
            )
    }
};