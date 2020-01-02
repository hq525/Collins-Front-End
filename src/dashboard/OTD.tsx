import React from 'react';
import { makeStyles, createStyles } from '@material-ui/styles';
import { Theme, Box, Grid } from '@material-ui/core';
import { Typography, InputLabel, FormControl, Select, Modal } from '@material-ui/core';
import Breakdown from './Components/Breakdown'
import Piee from './Components/Piee'
import Speedometer from './Components/Speedometer'
import Legend from './Components/Legend';
import { breakdownData } from './BreakdownData';
import LineGraph from './Components/LineGraph';

const pieData = [
  { name: 'No hold', value: 338 }, { name: 'Awaiting Parts', value: 95 },
  { name: 'Awaiting Sub-contract', value: 37 }, {name: 'Others', value: 220},
  {name: 'Others2', value: 200}
];

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
      width: "80%",
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    },
  }),
);

export default function OTD() {
    const classes = useStyles({});
    const [period, setPeriod] = React.useState<string>("Overall");
    const handleChange = (event) => {
        setPeriod(event.target.value)      
    }
    const inputLabel = React.useRef<HTMLLabelElement>(null);
    const [labelWidth, setLabelWidth] = React.useState(0);
    React.useEffect(() => {
        setLabelWidth(inputLabel.current!.offsetWidth);
    }, []);

    const [open, setOpen] = React.useState(false);

    const handleOpen = () => {
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
    };

    if(["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"].indexOf(period) >= 0) {
      return(
        <Box style={{height: "720px", paddingBottom:"0px", margin:"10px 25px 0px 25px", border: "2px solid black"}}>
            <br />
            <Grid container>
              <Grid item xs={4} sm={4} md={4} lg={4}>
                <Typography><b>Target:</b><p>98%</p></Typography>
              </Grid>
              <Grid style={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center"}} item xs={4} sm={4} md={4} lg={4}>
                <Typography><b>On-Time Delivery</b></Typography>
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
                  <Grid item xs={4} sm={4} md={4} lg={4}>
                  <Piee 
                  width={150}
                  height={150}
                  dataKey={"value"}
                  data={pieData}
                  label={"100%"}
                  innerRadius={45}
                  outerRadius={60}
                  labels={['No hold', 'Awaiting Parts', 'Awaiting Sub-contract', 'Others']}
                  descriptions={['value: 338', 'value: 95', 'value: 37', 'value: 420']}
                  />
                  </Grid>
                  <Grid item xs={8} sm={8} md={8} lg={8} style={{display: "flex", alignItems: "center"}}>
                    <Legend data={pieData} />
                  </Grid>
            </Grid>
            <LineGraph 
            data={lineData} 
            width={390}
            height={190}
            />
            {/* <Breakdown 
            data = {breakdownData}
            /> */}
            <Speedometer
            segmentStops={[0, 0.8, 0.95, 1]}
            segmentColors={["firebrick", "gold", "limegreen"]}
            value={0.90}
            minValue={0}
            maxValue={1}
            currentValue={"90%"}
            title={"Overall Equipment Effectiveness"}
            />
        </Box>
      );
    } 
    else if (period == "YTD") {
      return (
        <Box style={{height: "720px", paddingBottom:"0px", margin:"10px 25px 0px 25px", border: "2px solid black"}}>
          <br />
          <Grid container>
            <Grid item xs={4} sm={4} md={4} lg={4}>
              <Typography><b>Target:</b><p>98%</p></Typography>
            </Grid>
            <Grid style={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center"}} item xs={4} sm={4} md={4} lg={4}>
              <Typography><b>On-Time Delivery</b></Typography>
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
            <Piee 
            width={200}
            height={200}
            dataKey={"value"}
            data={pieData}
            label={"99%"}
            innerRadius={60}
            outerRadius={80}
            labels={['No hold', 'Awaiting Parts', 'Awaiting Sub-contract', 'Others']}
            descriptions={['value: 338', 'value: 95', 'value: 37', 'value: 420']}
            />
          </Grid>
          <Legend data={pieData} />
          <div onClick={handleOpen}>
            <Speedometer
            segmentStops={[0, 0.8, 0.95, 1]}
            segmentColors={["firebrick", "gold", "limegreen"]}
            value={0.90}
            minValue={0}
            maxValue={1}
            currentValue={"90%"}
            title={"Overall Equipment Effectiveness"}
            />
          </div>
          <Modal
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            open={open}
            onClose={handleClose}
          >
            <div style={{top: "50%", left: "50%", transform: "translate(-50%, -50%)"}} className={classes.paper}>
              <Grid container>
                <Grid item xs={12} sm={12} md={4} lg={4}>
                  <Speedometer
                  segmentStops={[0, 0.8, 0.95, 1]}
                  segmentColors={["firebrick", "gold", "limegreen"]}
                  value={0.90}
                  minValue={0}
                  maxValue={1}
                  currentValue={"90%"}
                  title={"Availability"}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={4}>
                  <Speedometer
                  segmentStops={[0, 0.8, 0.95, 1]}
                  segmentColors={["firebrick", "gold", "limegreen"]}
                  value={0.90}
                  minValue={0}
                  maxValue={1}
                  currentValue={"90%"}
                  title={"Performance"}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={4} lg={4}>
                  <Speedometer
                  segmentStops={[0, 0.8, 0.95, 1]}
                  segmentColors={["firebrick", "gold", "limegreen"]}
                  value={0.90}
                  minValue={0}
                  maxValue={1}
                  currentValue={"90%"}
                  title={"Quality"}
                  />
                </Grid>
              </Grid>
            </div>
          </Modal>
        </Box>
      )
    }
    else {
      return(
        <Box style={{height: "720px", paddingBottom:"0px", margin:"10px 25px 0px 25px", border: "2px solid black"}}>
          <br />
          <Grid container>
              <Grid item xs={4} sm={4} md={4} lg={4}>
              </Grid>
              <Grid style={{display: "flex", flexDirection: "row", alignItems: "center", justifyContent: "center"}} item xs={4} sm={4} md={4} lg={4}>
                <Typography><b>On-Time Delivery</b></Typography>
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
            <Grid item xs={4} sm={4} md={4} lg={4}>
              <Typography><b>Target:</b><p>98%</p></Typography>
            </Grid>
            <Grid className={classes.buttonGrid} item xs={4} sm={4} md={4} lg={4} onClick={() => {setPeriod("YTD")}}>
              <Typography><b>YTD:</b><p>99%</p></Typography>
            </Grid>
            <Grid className={classes.buttonGrid} item xs={4} sm={4} md={4} lg={4} onClick={() => {setPeriod("January")}}>
              <Typography><b>Current month:</b><p>100%</p></Typography>
            </Grid>
          </Grid>
          <LineGraph 
            title={"Overall Equipment Effectiveness"}
            data={lineData} 
            width={390}
            height={190}
          />
          <LineGraph 
            title={"Overall Labour Effectiveness"}
            data={lineData} 
            width={390}
            height={190}
          />
        </Box>
      )
    }
}

