import React from "react";
import { Paper, CircularProgress } from '@material-ui/core';
import { EditingState } from '@devexpress/dx-react-grid';
import { Grid, Table, TableHeaderRow, TableEditRow, TableEditColumn } from '@devexpress/dx-react-grid-material-ui';
import { ENDPOINT } from "../../utils/config";
import API from "../../utils/API";

const getRowId = row => row.id;

export default function JobData(props) {
    const [jobData, setJobData] = React.useState([]);
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        
    }, []);
    
      return (
        <div style={{display: "flex", flexFlow: "column", height: "100%"}}>
            <div style={{justifyContent: "center", display: "flex"}}>
                <Paper style={{width: "80%"}}>
                    <Grid
                        rows={[
                        { id: 0, section: 'ATE1', machine: 'RFT-1000', component: 'AFDC-770', day: 2, month: 'January', year: 2019, labourHours: 3 },
                        { id: 1, section: 'ATE2', machine: 'RFT-1000', component: 'DRV-2320', day: 3, month: 'March', year: 2019, labourHours: 6 },
                        ]}
                        columns={[
                        { name: 'id', title: 'ID' },
                        { name: "section", title: 'Section'},
                        { name: 'machine', title: 'Machine' },
                        { name: 'component', title: 'Component' },
                        { name: 'day', title: 'Day' },
                        { name: 'month', title: 'Month' },
                        { name: 'year', title: 'Year' },
                        { name: 'labourHours', title: 'Labour Hours' }
                        ]}>
                        <Table />
                        <TableHeaderRow />
                    </Grid>
                </Paper>
            </div>
        </div>
      )
}