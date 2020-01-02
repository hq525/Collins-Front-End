import React, { useState } from 'react';
import { makeStyles, createStyles } from '@material-ui/styles';
import { Theme, InputLabel, FormControl, Select } from '@material-ui/core';
import { observer } from 'mobx-react';
import Grid from '@material-ui/core/Grid';
import OTD from './OTD';
import TAT from './TAT';
import SWIP from './SWIP'
import DER from './DER'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
    //   margin: theme.spacing(1),
    marginTop: "10px",
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  }),
);

const Dashboard = () => {
    const classes = useStyles({});
    const [section, setSection] = useState('Overall');
    const handleChange = (event) => {
        setSection(event.target.value)
    }
    const inputLabel = React.useRef<HTMLLabelElement>(null);
    const [labelWidth, setLabelWidth] = React.useState(0);
    React.useEffect(() => {
        setLabelWidth(inputLabel.current!.offsetWidth);
    }, []);
    return (
        <div style={{height: "100%", justifyContent: "center"}}>
            <FormControl variant="outlined" className={classes.formControl}>
                  <InputLabel ref={inputLabel} htmlFor="outlined-section-native-simple">
                    Section
                  </InputLabel>
                  <Select
                  native
                  value={section}
                  onChange={(event) => handleChange(event)}
                  labelWidth={labelWidth}
                  inputProps={{
                      name: 'section',
                      id: 'outlined-section-native-simple',
                  }}
                  >
                    <option value={"Overall"}>Overall</option>
                    <option value={"January"}>ATE1</option>
                    <option value={"February"}>ATE2</option>
                    <option value={"March"}>Sensor1</option>
                    <option value={"April"}>Sensor2</option>
                    <option value={"April"}>BAE</option>
                  </Select>
                </FormControl>
            <Grid container>
                <Grid item xs={12} sm={12} md={4} lg={4} >
                    <OTD />
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={4} >
                    <TAT />
                    <SWIP />
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={4} >
                    <DER />
                </Grid>
            </Grid>
            <br />
        </div>
    )
}

export default observer(Dashboard);