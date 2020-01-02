import React from 'react';
import LineGraph from './Components/LineGraph';
import BarGraph from './Components/BarGraph';
import { makeStyles, createStyles } from '@material-ui/styles';
import { Theme, Box, Grid } from '@material-ui/core';
import { Typography, InputLabel, FormControl, Select } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  }),
);

const lineData = [
  {
    name: 'Page A', uv: 4000, pv: 2400, amt: 2400,
  },
  {
    name: 'Page B', uv: 3000, pv: 1398, amt: 2210,
  },
  {
    name: 'Page C', uv: 2000, pv: 9800, amt: 2290,
  },
  {
    name: 'Page D', uv: 2780, pv: 3908, amt: 2000,
  },
  {
    name: 'Page E', uv: 1890, pv: 4800, amt: 2181,
  },
  {
    name: 'Page F', uv: 2390, pv: 3800, amt: 2500,
  },
  {
    name: 'Page G', uv: 3490, pv: 4300, amt: 2100,
  },
];

export default function DER() {
    const classes = useStyles({});
    const [period, setPeriod] = React.useState<String>("Overall");
    const handleChange = (event) => {
        setPeriod(event.target.value)
    }
    const inputLabel = React.useRef<HTMLLabelElement>(null);
    const [labelWidth, setLabelWidth] = React.useState(0);
    React.useEffect(() => {
        setLabelWidth(inputLabel.current!.offsetWidth);
    }, []);
    return(
        <Box style={{margin:"10px 25px 0px 25px", border: "2px solid black"}}>
          <br />
            <Grid container>
              <Grid item xs={4} sm={4} md={4} lg={4}>
              <Typography>Target: <p>12 Days</p></Typography>
              </Grid>
              <Grid style={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center"}} item xs={4} sm={4} md={4} lg={4}>
                <Typography>Direct Expense Ratio</Typography>
              </Grid>
              <Grid item xs={4} sm={4} md={4} lg={4}>
                <FormControl variant="outlined" className={classes.formControl}>
                  <InputLabel ref={inputLabel} htmlFor="outlined-period-native-simple">
                    Period
                  </InputLabel>
                  <Select
                  native
                  value={period}
                  onChange={(event) => handleChange(event)}
                  labelWidth={labelWidth}
                  inputProps={{
                      name: 'period',
                      id: 'outlined-period-native-simple',
                  }}
                  >
                    <option value={"Overall"}>Overall</option>
                    <option value={"YTD"}>YTD</option>
                    <option value={"January"}>January</option>
                    <option value={"February"}>February</option>
                    <option value={"March"}>March</option>
                    <option value={"April"}>April</option>
                    <option value={"May"}>May</option>
                    <option value={"June"}>June</option>
                    <option value={"July"}>July</option>
                    <option value={"August"}>August</option>
                    <option value={"September"}>September</option>
                    <option value={"October"}>October</option>
                    <option value={"November"}>November</option>
                    <option value={"December"}>December</option>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
            <div style={{marginLeft: "15px", marginRight: "15px"}}>
                <LineGraph 
                data={lineData}
                width={380}
                height={228}
                />
            </div>
            <Grid container>
                  <Grid item xs={6} sm={6} md={6} lg={6}>
                    <Typography>Total Direct Charge Labour Hours</Typography>
                  </Grid>
                  <Grid item xs={6} sm={6} md={6} lg={6}>
                    <Typography>Available Hours (Direct Staff)</Typography>
                  </Grid>
                  <Grid item xs={6} sm={6} md={6} lg={6}>
                    <BarGraph />
                  </Grid>
                  <Grid item xs={6} sm={6} md={6} lg={6}>
                    <BarGraph />
                  </Grid>
            </Grid>
            <Grid container>
                  <Grid item xs={6} sm={6} md={6} lg={6}>
                    <Typography>Total controllable cost</Typography>
                    <BarGraph />
                  </Grid>
                  <Grid item xs={6} sm={6} md={6} lg={6}>
                    <Typography>Hours / Direct Staff</Typography>
                    <BarGraph />
                  </Grid>
            </Grid>
        </Box>
    )
}