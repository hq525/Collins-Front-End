import React, { useState } from 'react';
import { makeStyles, createStyles } from '@material-ui/styles';
import { Grid, Theme, Button, FormControl, Select, InputLabel, Box, Typography } from '@material-ui/core';
import { Redirect } from 'react-router-dom'
import Legend from './Components/Legend';
import Piee from './Components/Piee';
import Areaa from './Components/Areaa';

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

const pieData = [
    { name: 'No hold', value: 338 }, { name: 'Awaiting Parts', value: 95 },
    { name: 'Awaiting Sub-contract', value: 37 }, {name: 'Others', value: 220},
    {name: 'Others2', value: 200}
  ];

export default function WIPBoard() {
    const classes = useStyles({});
    const [section, setSection] = useState('Overall');
    const handleSectionChange = (event) => {
        setSection(event.target.value);
    }
    const inputLabel = React.useRef<HTMLLabelElement>(null);
    const [labelWidth, setLabelWidth] = React.useState(0);
    React.useEffect(() => {
        setLabelWidth(inputLabel.current!.offsetWidth);
    }, []);
    const [redirect, setRedirect] = useState(false);
    if(redirect) {
        return <Redirect to='/' />
    } else {
        return (
            <Box style={{height: "720px", padding:"10px 40px 40px 40px", margin:"10px 25px 0px 25px" }}>
                <Grid container >
                    <Grid style={{display: "flex", alignItems: "center"}} item xs={4} sm={4} md={4} lg={4}>
                        <Button onClick={(e: any) => {e.preventDefault();setRedirect(true);}} variant="contained">
                            Back to summary
                        </Button>
                    </Grid>
                    <Grid item xs={4} sm={4} md={4} lg={4}>

                    </Grid>
                    <Grid style={{display: "flex", justifyContent: "flex-end"}} item xs={4} sm={4} md={4} lg={4}>
                        <FormControl variant="outlined" className={classes.formControl}>
                            <InputLabel ref={inputLabel} htmlFor="outlined-section-native-simple">
                            Section
                            </InputLabel>
                            <Select
                            native
                            value={section}
                            onChange={(event) => handleSectionChange(event)}
                            labelWidth={labelWidth}
                            inputProps={{
                                name: 'section',
                                id: 'outlined-section-native-simple',
                            }}
                            >
                            <option value={"Overall"}>Overall</option>
                            <option value={"ATE1"}>ATE1</option>
                            <option value={"ATE2"}>ATE2</option>
                            <option value={"Sensor1"}>Sensor1</option>
                            <option value={"Sensor2"}>Sensor2</option>
                            <option value={"BAE"}>BAE</option>
                            </Select>
                        </FormControl>
                    </Grid>
                </Grid>
                <Grid container >
                    <Grid item xs={6} sm={6} md={6} lg={6}>
                        <div style={{border: "1px solid black", margin: "10px 5px 0px 0px"}}>
                            <Grid container>
                                <Grid style={{paddingTop: "15px", display: "flex", alignItems: "center", justifyContent: "center"}} item xs={4} sm={4} md={4} lg={4}>
                                    <Typography><b>Target:</b><p>950 units</p></Typography>
                                </Grid>
                                <Grid style={{display: "flex", alignItems: "center", justifyContent: "center"}} item xs={4} sm={4} md={4} lg={4}>
                                    <span style={{fontSize: "30px", fontWeight: "bold"}}>WIP</span>
                                </Grid>
                                <Grid style={{paddingTop: "15px", display: "flex", alignItems: "center", justifyContent: "center"}} item xs={4} sm={4} md={4} lg={4}>
                                    <Typography><b>Current:</b><p>950 units</p></Typography>
                                </Grid>
                            </Grid>
                            <br />
                            <Grid container>
                                <Grid item xs={4} sm={4} md={4} lg={4}>
                                <Piee 
                                width={150}
                                height={140}
                                dataKey={"value"}
                                data={pieData}
                                outerRadius={60}
                                labels={['No hold', 'Awaiting Parts', 'Awaiting Sub-contract', 'Others']}
                                descriptions={['value: 338', 'value: 95', 'value: 37', 'value: 420']}
                                />
                                </Grid>
                                <Grid item xs={8} sm={8} md={8} lg={8} style={{display: "flex", alignItems: "center"}}>
                                    <Legend
                                    maxHeight="150px"
                                    fontSize="24px"
                                    data={pieData} />
                                </Grid>
                            </Grid>
                            <br />
                            <Grid style={{paddingBottom: "15px", display: "flex", justifyContent: "center"}} item xs={12} sm={12} md={12} lg={12}>
                                <Areaa
                                width={700}
                                height={400}
                                />
                            </Grid>
                        </div>
                    </Grid>
                    <Grid item xs={6} sm={6} md={6} lg={6}>
                        <div style={{border: "1px solid black", margin: "10px 0px 0px 5px"}}>
                            <Grid container>
                                <Grid style={{paddingTop: "15px", display: "flex", alignItems: "center", justifyContent: "center"}} item xs={4} sm={4} md={4} lg={4}>
                                    <Typography><b>Target:</b><p>$700,000</p></Typography>
                                </Grid>
                                <Grid style={{display: "flex", alignItems: "center", justifyContent: "center"}} item xs={4} sm={4} md={4} lg={4}>
                                    <span style={{fontSize: "30px", fontWeight: "bold"}}>SWIP</span>
                                </Grid>
                                <Grid style={{paddingTop: "15px", display: "flex", alignItems: "center", justifyContent: "center"}} item xs={4} sm={4} md={4} lg={4}>
                                    <Typography><b>Current:</b><p>$700,000</p></Typography>
                                </Grid>
                            </Grid>
                            <br />
                            <Grid container>
                                <Grid item xs={4} sm={4} md={4} lg={4}>
                                <Piee 
                                width={150}
                                height={140}
                                dataKey={"value"}
                                data={pieData}
                                outerRadius={60}
                                labels={['No hold', 'Awaiting Parts', 'Awaiting Sub-contract', 'Others']}
                                descriptions={['value: 338', 'value: 95', 'value: 37', 'value: 420']}
                                />
                                </Grid>
                                <Grid item xs={8} sm={8} md={8} lg={8} style={{display: "flex", alignItems: "center"}}>
                                    <Legend
                                    maxHeight="150px"
                                    fontSize="24px"
                                    data={pieData} />
                                </Grid>
                            </Grid>
                            <br />
                            <Grid style={{paddingBottom: "15px", display: "flex", justifyContent: "center"}} item xs={12} sm={12} md={12} lg={12}>
                                <Areaa
                                width={700}
                                height={400}
                                />
                            </Grid>
                        </div>
                    </Grid>
                </Grid>
            </Box>
        )
    }
}