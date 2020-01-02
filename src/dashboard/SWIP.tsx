import React from 'react';
import { makeStyles, createStyles } from '@material-ui/styles';
import { Theme, Box, Grid, Typography, FormControl, InputLabel, Select } from  '@material-ui/core';
import Piee from './Components/Piee';
import Breakdown from './Components/Breakdown';
import { SWIPData } from './SWIPData'

const pieData = [
  { name: 'Customer Hold', value: 300000 }, { name: 'Awaiting Parts', value: 200000 },
  { name: 'Awaiting Sub-contract', value: 450000 }
];

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

export default function SWIP() {
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
        <Box style={{margin:"10px 25px 0px 25px", border: "2px solid black"}} >
            <br />
            <Grid container>
              <Grid item xs={4} sm={4} md={4} lg={4}>
                <Typography>Target: <p>$700,000</p></Typography>
              </Grid>
              <Grid style={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center"}} item xs={4} sm={4} md={4} lg={4}>
                <Typography>SWIP</Typography>
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
            <Grid container>
                  <Grid  item xs={6} sm={6} md={6} lg={6}>
                  <Piee
                  width={150}
                  height={150}
                  dataKey={"value"}
                  data={pieData}
                  label={"$700K"}
                  innerRadius={0}
                  outerRadius={60}
                  labels={['Customer Hold', 'Awaiting Parts', 'Awaiting Sub-contract']}
                  descriptions={['value: 300,000', 'value: 200,000', 'value: 450,000']}
                  />
                  </Grid>
                  <Grid item xs={6} sm={6} md={6} lg={6}>
                    <Breakdown
                    data={SWIPData}
                    vertical={true}
                    />
                  </Grid>                  
            </Grid>
            <br />
        </Box>
    )
}