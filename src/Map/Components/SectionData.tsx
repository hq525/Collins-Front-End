import React from "react";
import { Paper, CircularProgress } from '@material-ui/core';
import { EditingState } from '@devexpress/dx-react-grid';
import { Grid, Table, TableHeaderRow, TableEditRow, TableEditColumn } from '@devexpress/dx-react-grid-material-ui';
import { ENDPOINT } from "../../utils/config";
import API from "../../utils/API";

const getRowId = row => row.id;

export default function SectionData(props) {
    const [sectionData, setSectionData] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        let api = new API();
        api
        .get(`${ENDPOINT}/section`)
        .then((data) => {
            let sectionData = [];
            data.sections.forEach((section, index) => {
                if(section.name !== 'ROOT') {
                    sectionData.push({id: index, name: section.name, _id: section._id});
                }
            })
            setSectionData(sectionData);
            setLoading(false);
        })
        .catch(err => {
            setLoading(false);
            console.log(err);
        });
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
      ]);

    const commitSectionChanges = ({ added, changed, deleted }) => {
        let changedRows = sectionData;
        let api = new API();
        if (added) {
            setLoading(true);
          const startingAddedId = sectionData.length > 0 ? sectionData[sectionData.length - 1].id + 1 : 0;
          let promises = added.map((row, index) => {
              return new Promise((resolve, reject) => {
                  api
                  .post(`${ENDPOINT}/section/new`, {name: row.name})
                  .then((data) => {
                    changedRows.push({id: startingAddedId + index, name: row.name, _id: data.section._id})
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
            setSectionData(changedRows);
          })
          .catch((error) => {
              setLoading(false);
              console.log(error);
          })
        }
        if (changed) {
            setLoading(true);
            let index = parseInt(Object.keys(changed)[0])
            api
            .put(`${ENDPOINT}/section/update`, {_id: sectionData[index - 1]._id, name: changed[index].name})
            .then(() => {
                setLoading(false);
                changedRows = sectionData.map(row => (changed[row.id] ? { ...row, ...changed[row.id] } : row));
                setSectionData(changedRows);
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
                    .post(`${ENDPOINT}/section/delete`, {_id: sectionData[deleted[index] - 1]._id})
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
                changedRows = sectionData.filter(row => !deletedSet.has(row.id));
                setLoading(false);
                setSectionData(changedRows);
            })
            .catch((error) => {
                setLoading(false);
                console.log(error);
            })
        }
      };
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
                        rows={sectionData}
                        columns={[
                        { name: 'id', title: 'ID' },
                        { name: 'name', title: 'Name'}
                        ]}
                        getRowId={getRowId}
                        >
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
                            <Table columnExtensions={tableColumnExtensions} />
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