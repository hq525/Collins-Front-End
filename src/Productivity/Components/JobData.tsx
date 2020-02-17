import React from "react";
import './ComponentData.css'
import { Paper, CircularProgress } from '@material-ui/core';
import { DataTypeProvider, EditingState } from '@devexpress/dx-react-grid';
import DropdownList from 'react-widgets/lib/DropdownList'
import DatePicker from "react-datepicker";
import { InputNumber } from 'antd';
import 'antd/dist/antd.css';
import { Grid, Table, TableHeaderRow, TableEditRow, TableEditColumn } from '@devexpress/dx-react-grid-material-ui';
import { ENDPOINT } from "../../utils/config";
import API from "../../utils/API";

const getRowId = row => row.id;

export default function JobData(props) {
    const [jobData, setJobData] = React.useState([]);
    const [selectComponentData, setSelectComponentData] = React.useState([]);
    const [componentData, setComponentData] = React.useState(new Map());
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        async function initialize() {
            setLoading(true);
            let api = new API();
            try {
                await new Promise((resolve, reject) => {
                    api
                    .get(`${ENDPOINT}/component/all`)
                    .then((data) => {
                        let selectComponentData = [];
                        componentData.forEach((value, key) => {
                            setComponentData(new Map(componentData.set(key, undefined)));
                        })
                        data.components.forEach((component, index) => {
                            setComponentData(new Map(componentData.set(component._id, component.name)));
                            selectComponentData.push({name: component.name, _id: component._id});
                        })
                        setSelectComponentData(selectComponentData);
                        resolve();
                    })
                    .catch(err => {
                        reject(err);
                    });
                })
            } catch (error) {
                setLoading(false);
                if(error.data && error.data.message) {
                    props.setError(error.data.message);
                } else {
                    props.setError("An error occurred");
                }
            }
            api
            .post(`${ENDPOINT}/job/period`, {
                year: props.year,
                month: props.month
            })
            .then(({jobs}) => {
                let jobData = [];
                jobs.forEach((job, index) => {
                    jobData.push({id: index, _id: job._id, component: job.componentID, date: job.date, labourHours: job.labourHours});
                })
                setJobData(jobData);
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
        initialize()
    }, [props]);
    const [editingRowIds, setEditingRowIds] = React.useState([]);
    const [rowChanges, setRowChanges] = React.useState({});
    const [addedRows, setAddedRows] = React.useState([]);
    const changeAddedRows = (value) => {
        setAddedRows(value);
    };
    const [editingStateColumnExtensions] = React.useState([
        { columnName: 'id', editingEnabled: false },
      ]);
    const commitJobChanges = ({ added, changed, deleted }) => {
        let changedRows = jobData;
        let api = new API();
        if(added) {
            setLoading(true);
            const startingAddedId = jobData.length > 0 ? jobData[jobData.length - 1].id + 1 : 0;
            let promises = added.map((row, index) => {
                return new Promise((resolve, reject) => {
                    let component = null;
                    if(row.component === null || row.component === undefined) {
                        component = selectComponentData.length > 0 ? (
                            selectComponentData[0]._id
                        ) : (
                            null
                        )
                    } else {
                        component = row.component
                    }
                    if(row.component === null) {
                        reject({data: {message: "Please indicate a component to be added"}})
                    } else {
                        api
                        .post(`${ENDPOINT}/job/new`, {date: (row.date === undefined || row.date === null) ? new Date() : row.date, labourHours: (row.labourHours === undefined || row.labourHours === null) ? 0 : row.labourHours, componentID: component})
                        .then((data) => {
                        changedRows.push({id: startingAddedId + index, _id: data.job._id, component, date: (row.date === undefined || row.date === null) ? new Date() : row.date, labourHours: (row.labourHours === undefined || row.labourHours === null) ? 0 : row.labourHours})
                        resolve();
                        })
                        .catch((error) => {
                            reject(error);
                        })
                    }
                })
            })
            Promise
            .all(promises)
            .then(() => {
                setLoading(false);
                setJobData(changedRows);
            })
            .catch((error) => {
                setLoading(false);
                if(error.data && error.data.message) {
                    props.setError(error.data.message);
                } else {
                    props.setError("An error occurred")
                }
            })
        }
        if (changed) {
            setLoading(true);
            let index = parseInt(Object.keys(changed)[0])
            api
            .put(`${ENDPOINT}/job/update`, {_id: jobData[index]._id, componentID: changed[index].component, date: changed[index].date, labourHours: changed[index].labourHours})
            .then(() => {
                changedRows = jobData.map(row => (changed[row.id] ? { ...row, ...changed[row.id] } : row));
                setJobData(changedRows);
                setLoading(false);
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
        if(deleted) {
            setLoading(true);
            let promises = deleted.map((row, index) => {
                return new Promise((resolve, reject) => {
                    api
                    .post(`${ENDPOINT}/job/delete`, {_id: jobData[deleted[index]]._id})
                    .then(() => {
                        resolve();
                    })
                    .catch((error) => {
                        reject(error);
                    })
                })
            })
            Promise.all(promises)
            .then(() => {
                const deletedSet = new Set(deleted);
                changedRows = jobData.filter(row => !deletedSet.has(row.id));
                setLoading(false);
                setJobData(changedRows);
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
    }

    const ComponentFormatter = ({ value }) => {return(<span>{componentData.get(value)}</span>)}

        const ComponentEditor = ({ value, onValueChange }) => (
            <DropdownList 
            filter="contains"
            data={selectComponentData}
            value={value}
            textField="name"
            valueField="_id"
            defaultValue={(value === undefined || value === null) ? (
                selectComponentData.length > 0 ? (
                    selectComponentData[0]._id
                ) : (
                    null
                )
            ) : (value)}
            onChange={value => {
                onValueChange(value._id);
            }}
            />
        )

      const ComponentTypeProvider = props => (
        <DataTypeProvider
          formatterComponent={ComponentFormatter}
          editorComponent={ComponentEditor}
          {...props}
        />
      );

      const DateFormatter = ({ value }) => {return(<span>{new Date(value).toDateString()}</span>)}

      const DateEditor = ({ value, onValueChange }) => (
        <DatePicker minDate={new Date(2013, 0, 1, 0, 0, 0, 0)} maxDate={new Date()} selected={value ? new Date(value) : new Date()} onChange={date => onValueChange(date)} />
      )

      const DateTypeProvider = props => (
        <DataTypeProvider
        formatterComponent={DateFormatter}
        editorComponent={DateEditor}
        {...props}
      />
      )

      const LabourHoursFormatter = ({ value }) => {return(<span>{value}</span>)}

      const LabourHoursEditor = ({ value, onValueChange }) => (
        <InputNumber style={{width: "100%"}}  min={0} value={(value === undefined || value === null) ? 0 : value} step={0.1} onChange={(number) => {onValueChange(number)}} />
      )

      const LabourHoursTypeProvider = props => (
        <DataTypeProvider
        formatterComponent={LabourHoursFormatter}
        editorComponent={LabourHoursEditor}
        {...props}
      />
      )

    return (
        <div style={{display: "flex", flexFlow: "column", height: "100%"}}>
            {
                loading ? (
                    <div style={{flexGrow: 1, width: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}>
                        <CircularProgress size={100} />
                    </div>
                ) : (
                    <div style={{justifyContent: "center", display: "flex"}}>
                        <Paper style={{width: "80%"}}>
                            <Grid
                                rows={jobData}
                                columns={[
                                { name: 'component', title: 'Component' },
                                { name: 'date', title: 'Date' },
                                { name: 'labourHours', title: 'Labour Hours' }
                                ]}
                                getRowId={getRowId}
                                >
                                    <ComponentTypeProvider for={['component']}/>
                                    <DateTypeProvider for={['date']}/>
                                    <LabourHoursTypeProvider for={['labourHours']}/>
                                    <EditingState
                                    editingRowIds={editingRowIds}
                                    onEditingRowIdsChange={setEditingRowIds}
                                    rowChanges={rowChanges}
                                    onRowChangesChange={setRowChanges}
                                    addedRows={addedRows}
                                    onAddedRowsChange={changeAddedRows}
                                    onCommitChanges={commitJobChanges}
                                    columnExtensions={editingStateColumnExtensions}
                                    />
                                <Table />
                                <TableHeaderRow />
                                <TableEditRow />
                                <TableEditColumn
                                showAddCommand={!addedRows.length}
                                showEditCommand
                                showDeleteCommand
                                />
                            </Grid>
                        </Paper>
                    </div>
                )
            }
        </div>
    )
}