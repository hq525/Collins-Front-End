import React, {useCallback} from "react";
import { makeStyles, createStyles } from '@material-ui/styles';
import { Paper, Grid as MainGrid, Modal, Button, FormControl, List, ListItem, ListItemText, Theme, Select, CircularProgress } from '@material-ui/core';
import SectionData from "./Components/SectionData";
import JobData from "./Components/JobData";
import { Grid, Table, TableHeaderRow } from '@devexpress/dx-react-grid-material-ui';
import {useDropzone} from 'react-dropzone'
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
        const data = new FormData()
        data.append('file', file, file.name)
        let api = new API();
        api
        .post(`${ENDPOINT}/upload`, data)
        .then(() => {

        })
        .catch((error) => {
            console.log(error);
        })
    }
    
    return(
        <div style={{top: "50%", left: "50%", transform: "translate(-50%, -50%)", backgroundColor: "white", borderWidth: "0px"}} className={classes.paper}>
            <MainGrid container>
                <MainGrid item xs={3} sm={3} md={3} lg={3}>
                    <div style={{display: "flex", justifyContent: "center"}}>
                        <a style={{textDecoration: "none", color: "white", width: "80%"}} href={`${ENDPOINT}/upload/sample`}><Button style={{width: "100%"}} variant="contained" color="primary">Get sample</Button></a>
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
    return (
        <MainGrid container>
            <MainGrid style={{display: "flex", justifyContent: "center"}} item xs={4} sm={4} md={4} lg={4}>
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
            </MainGrid>
            <MainGrid style={{display: "flex", justifyContent: "center", alignItems: "center"}} item xs={4} sm={4} md={4} lg={4}>
                <h1>Edit Data</h1>
            </MainGrid>
            <MainGrid style={{display: 'flex', justifyContent: 'center', alignItems: "center"}} item xs={4} sm={4} md={4} lg={4}>
                <Button variant="contained" onClick={props.handleOpen}>
                    Upload Excel
                </Button>
            </MainGrid>
        </MainGrid>
    )
}

export default function Data(props) {
    const classes = useStyles({});

    const [open, setOpen] = React.useState(false);

    const handleOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };
    const [loading, setLoading] = React.useState(true);
    const [dataType, setDataType] = React.useState('SECTIONS');
    const handleDataTypeChange = (event) => {
        setDataType(event.target.value)      
    }

    switch(dataType) {
        case 'JOBS':
            return(
                <div style={{display: "flex", flexFlow: "column", height: "100%"}}>
                    <Top classess={classes} dataType={dataType} handleDataTypeChange={handleDataTypeChange} handleOpen={handleOpen} />
                        <JobData />
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
        case 'SECTIONS':
            return (
                <div style={{height: "100%"}}>
                    <Top classess={classes} dataType={dataType} handleDataTypeChange={handleDataTypeChange} handleOpen={handleOpen} />
                    <SectionData />
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
                <div style={{display: "flex", flexFlow: "column", height: "100%"}}>
                    <Top classess={classes} dataType={dataType} handleDataTypeChange={handleDataTypeChange} handleOpen={handleOpen} />
                    { loading ? (
                        <div style={{flexGrow: 1, width: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}>
                            <CircularProgress size={100} />
                        </div>
                    ) : (
                        <div>
                            <Modal
                                aria-labelledby="simple-modal-title"
                                aria-describedby="simple-modal-description"
                                open={open}
                                onClose={handleClose}
                            >
                                <FileUpload setError={props.setError} />
                            </Modal>
                        </div>
                    )}
                </div>
            )
    }
};