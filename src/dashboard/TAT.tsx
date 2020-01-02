import React from 'react';
import { makeStyles, createStyles } from '@material-ui/styles';
import { Theme, Box, Typography, FormControl, InputLabel, Select, Grid } from '@material-ui/core';
import Speedometer from './Components/Speedometer';
import Breakdown from './Components/Breakdown';
import { TATData } from './TATData';

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

export default function TAT() {
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
                <Typography>Turn-around Time</Typography>
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
                    <option value={"TAT"}>Overall</option>
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
            <Speedometer
            height={174}
            width={261}
            segmentStops={[0, 12, 15, 30]}
            segmentColors={["limegreen", "gold", "firebrick"]}
            value={23.4}
            minValue={0}
            maxValue={30}
            currentValue={"23.4D"}
            />
            <Breakdown
            data={TATData}
            />
            <br />
        </Box>
    )
}