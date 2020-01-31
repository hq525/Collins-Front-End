import React from "react";
import './ComponentData.css'
import { CircularProgress, Popover, Paper } from '@material-ui/core';
import { DataTypeProvider, EditingState, FilteringState, IntegratedFiltering} from '@devexpress/dx-react-grid';
import { Grid, Table, TableHeaderRow, TableEditRow, TableEditColumn } from '@devexpress/dx-react-grid-material-ui';
import DropdownList from 'react-widgets/lib/DropdownList'
import { ENDPOINT } from "../../utils/config";
import API from "../../utils/API";
import { CompactPicker } from 'react-color';

const getRowId = row => row.id;

export default function SectionData(props) {
    const [componentData, setComponentData] = React.useState([]);
    const [machineData, setMachineData] = React.useState(new Map());
    const [selectMachineData, setSelectMachineData] = React.useState([]);
    const [sectionData, setSectionData] = React.useState(new Map());
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        async function initialize () {
            let api = new API();
            try {
                await new Promise((resolve, reject) => {
                    api
                    .get(`${ENDPOINT}/section`)
                    .then((data) => {
                        sectionData.forEach((value, key) => {
                            setSectionData(new Map(sectionData.set(key, undefined)));
                        })
                        data.sections.forEach((section, index) => {
                            if(section.name !== "ROOT") {
                                setSectionData(new Map(sectionData.set(section._id, section.name)));
                            }
                        })
                        resolve();
                    })
                    .catch((error) => {
                        reject(error);
                    })
                })
            } catch (error) {
                setLoading(false);
                if(error.data && error.data.message) {
                    setLoading(false);
                    props.setError(error.data.message)
                } else {
                    props.setError("An error occurred")
                }
            }
            try {
                await new Promise((resolve, reject) => {
                    api
                    .get(`${ENDPOINT}/machine`)
                    .then((data) => {
                        let selectMachineData = [];
                        machineData.forEach((value, key) => {
                            setMachineData(new Map(machineData.set(key, undefined)));
                        })
                        data.machines.forEach((machine, index) => {
                            setMachineData(new Map(machineData.set(machine._id, {name: machine.name, section: sectionData.get(machine.sectionID)})));
                            selectMachineData.push({name: machine.name, _id: machine._id});
                        })
                        setSelectMachineData(selectMachineData);
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
            api
            .get(`${ENDPOINT}/component/all`)
            .then((data) => {
                let componentData = [];
                data.components.forEach((component, index) => {
                    componentData.push({id: index, name: component.name, _id: component._id, color: component.color, machineID: component.machineID, machineSection: component.machineID});
                })
                setComponentData(componentData);
                setLoading(false);
            })
            .catch(err => {
                setLoading(false);
                console.log(err);
            });
        }
        initialize();
    }, []);
    const [editingRowIds, setEditingRowIds] = React.useState([]);
    const [addedRows, setAddedRows] = React.useState([]);
    const [rowChanges, setRowChanges] = React.useState({});

    const changeAddedRows = (value) => {
        setAddedRows(value);
    };

    const [tableColumnExtensions] = React.useState([
        { columnName: 'id', width: 60 },
    ]);

    const [editingStateColumnExtensions] = React.useState([
        { columnName: 'id', editingEnabled: false },
        { columnName: 'machineSection', editingEnabled: false}
      ]);

    const commitSectionChanges = ({ added, changed, deleted }) => {
        let changedRows = componentData;
        let api = new API();
        if (added) {
            setLoading(true);
          const startingAddedId = componentData.length > 0 ? componentData[componentData.length - 1].id + 1 : 0;
          let promises = added.map((row, index) => {
              return new Promise((resolve, reject) => {
                  api
                  .post(`${ENDPOINT}/component/new`, {name: row.name, color: row.color, machineID: row.machineID})
                  .then((data) => {
                    changedRows.push({id: startingAddedId + index, name: row.name, _id: data.component._id, color: row.color, machineID: row.machineID, machineSection: row.machineID})
                    resolve();
                  })
                  .catch((error) => {
                      reject(error);
                  })
              })
          })
          Promise
          .all(promises)
          .then(() => {
            setLoading(false);
            setComponentData(changedRows);
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
            .put(`${ENDPOINT}/component/update`, {_id: componentData[index]._id, name: changed[index].name, color: changed[index].color, machineID: changed[index].machineID})
            .then(() => {
                changedRows = componentData.map(row => (changed[row.id] ? { ...row, ...changed[row.id], machineSection: changed[row.id].machineID ? changed[row.id].machineID : row.machineSection } : row));
                setComponentData(changedRows);
                setLoading(false);
            })
            .catch((error) => {
                setLoading(false);
                console.log(error);
            })
        }
        if (deleted) {
            setLoading(true);
            let promises = deleted.map((row, index) => {
                return new Promise((resolve, reject) => {
                    api
                    .post(`${ENDPOINT}/component/delete`, {_id: componentData[deleted[index]]._id})
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
                changedRows = componentData.filter(row => !deletedSet.has(row.id));
                setLoading(false);
                setComponentData(changedRows);
            })
            .catch((error) => {
                setLoading(false);
                console.log(error);
            })
        }
      };

        const MachineFormatter = ({ value }) => {return(<span>{machineData.get(value).name}</span>)}

        const MachineEditor = ({ value, onValueChange }) => (
            <DropdownList 
            filter="contains"
            data={selectMachineData}
            value={value}
            textField="name"
            valueField="_id"
            defaultValue={value}
            onChange={value => {
                onValueChange(value._id);
            }}
            />
        )

      const MachineTypeProvider = props => (
        <DataTypeProvider
          formatterComponent={MachineFormatter}
          editorComponent={MachineEditor}
          {...props}
        />
      );

      const SectionFormatter = ({ value }) => {return(<span>{value ? machineData.get(value).section : null}</span>)}
      const SectionEditor = ({ value }) => {return(<span style={{color: "#b3b3b3"}}>{value ? machineData.get(value).section : null}</span>)}
      const SectionTypeProvider = props => (
          <DataTypeProvider 
          formatterComponent={SectionFormatter}
          editorComponent={SectionEditor}
          {...props}
          />
      )

      const ColorFormatter = ({ value }) => {return(<div style={{width: "100%", height: 50, backgroundColor: value}}></div>)}

        const ColorEditor = ({ value, onValueChange }) => {
            const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

            const handleClick = (event) => {
                setAnchorEl(event.currentTarget);
            };

            const handleClose = () => {
                setAnchorEl(null);
            };

            const open = Boolean(anchorEl);
            const id = open ? 'simple-popover' : undefined;
            return (
                <div style={{ width: "100%", height: 50, display: "flex", justifyContent: "center" }}>
                    <div onClick={handleClick} style={{padding: "5px 5px", cursor: "pointer", width: "90%", height: "100%", border: "1px solid black", borderRadius: "5px"}}>
                        <div style={{backgroundColor: value, height: "100%", borderRadius: "5px"}}>
    
                        </div>
                    </div>
                    <Popover
                    id={id}
                    open={open}
                    anchorEl={anchorEl}
                    onClose={handleClose}
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                >
                    <CompactPicker color={value} onChangeComplete={(color) => {onValueChange(color.hex)}} />
                </Popover>
                </div>
            )
        }

        const ColorTypeProvider = props => (
            <DataTypeProvider 
            formatterComponent={ColorFormatter}
            editorComponent={ColorEditor}
            {...props}
            />
        )

      return (
          <div style={{display: "flex", flexFlow: "column", height: "100%"}}>
            { loading ? (
                <div style={{flexGrow: 1, width: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}>
                    <CircularProgress size={100} />
                </div>
            ) : (
                <div style={{justifyContent: "center", display: "flex"}}>
                    <Paper style={{width: "80%"}}>
                        <Grid
                        rows={componentData}
                        columns={[
                        {name: 'machineSection', title: 'Section'},
                        { name: 'machineID', title: 'Machine'},
                        { name: 'name', title: 'Component'},
                        { name: 'color', title: 'Status'}
                        ]}
                        getRowId={getRowId}
                        >
                            <MachineTypeProvider 
                            for={['machineID']}
                            />
                            <ColorTypeProvider 
                            for={['color']}
                            />
                            <SectionTypeProvider
                            for={['machineSection']}
                            />
                            <EditingState
                            editingRowIds={editingRowIds}
                            onEditingRowIdsChange={setEditingRowIds}
                            rowChanges={rowChanges}
                            onRowChangesChange={setRowChanges}
                            addedRows={addedRows}
                            onAddedRowsChange={changeAddedRows}
                            onCommitChanges={commitSectionChanges}
                            columnExtensions={editingStateColumnExtensions}
                            />
                            <Table 
                            columnExtensions={tableColumnExtensions} 
                            />
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
            )}
        </div>
      )
}