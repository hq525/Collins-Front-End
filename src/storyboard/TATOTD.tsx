import React, { useState } from 'react';
import { makeStyles, createStyles } from '@material-ui/styles';
import { Redirect } from 'react-router-dom'
import { Grid, Theme, Button, FormControl, Select, InputLabel, Box } from '@material-ui/core';
import OTDBoard from './OTDBoard';
import TATBoard from './TATBoard';

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

export default function TATOTD() {
    const classes = useStyles({});
    const [board, setBoard] = useState('OTD');
    const handleBoardChange = (event) => {
        setBoard(event.target.value)
    }
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
                <Grid container>
                    <Grid style={{display: "flex", alignItems: "center"}} item xs={4} sm={4} md={4} lg={4}>
                    <Button onClick={(e: any) => {e.preventDefault();setRedirect(true);}} variant="contained">
                        Back to summary
                    </Button>
                    </Grid>
                    <Grid item xs={4} sm={4} md={4} lg={4}>
                    <FormControl variant="outlined" className={classes.formControl}>
                        <InputLabel ref={inputLabel} htmlFor="outlined-section-native-simple">
                        Board
                        </InputLabel>
                        <Select
                        native
                        value={board}
                        onChange={(event) => handleBoardChange(event)}
                        labelWidth={labelWidth}
                        inputProps={{
                            name: 'section',
                            id: 'outlined-section-native-simple',
                        }}
                        >
                        <option value={"OTD"}>OTD</option>
                        <option value={"TAT"}>TAT</option>
                        </Select>
                    </FormControl>
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
                {board === 'OTD' ? (
                    <OTDBoard />
                ) : (
                    <TATBoard />
                )}
            </Box>
        )
    }
}