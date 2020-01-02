import React, { useState } from 'react';
import { makeStyles } from '@material-ui/styles';
import { Theme, Typography, Grid } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => ({
    arrowGrid: {
        '&:hover': {
            cursor: 'pointer',
            backgroundColor: theme.palette.grey[100],
        },
    },
    prev: {
        cursor: 'pointer',
        width: 'auto',
        fontWeight: 'bold',
        fontSize: '18px',
        transition: '0.6s ease',
        borderRadius: '0 3px 3px 0',
        userSelect: 'none',
    },
    next: {
        cursor: 'pointer',
        width: 'auto',
        fontWeight: 'bold',
        fontSize: '18px',
        transition: '0.6s ease',
        borderRadius: '0 3px 3px 0',
        userSelect: 'none',
    }
}))

export default function Breakdown(props) {
    const classes = useStyles({});
    const [slideIndex, changeSlideIndex] = useState(1);
    const plusSlides = (event) => {
        var newValue = slideIndex + 1;
        if(newValue > props.data.length) {
            newValue = 1
        }        
        changeSlideIndex(newValue);
    }
    const minusSlides = (event) => {
        var newValue = slideIndex - 1;
        if(newValue < 1) {
            newValue = props.data.length;
        }
        changeSlideIndex(newValue);
    }
    React.useEffect(() => {
        let rotationInterval = setInterval(()=> {
            var newValue = slideIndex + 1;
            if(newValue > props.data.length) {
                newValue = 1
            }        
            changeSlideIndex(newValue);
        }, 2000);
        return () => {
            clearInterval(rotationInterval);
        }
    }, [slideIndex]);
    if(props.vertical) {
        return (
            <div>
                <Typography style={{height: '50px', marginTop: '10px'}}><b>{props.data[slideIndex - 1].name}</b></Typography>
                <Grid container style={{alignItems: "center", display: "flex"}}>
                    <Grid className={classes.arrowGrid} onClick={minusSlides} item xs={1} sm={1} md={1} lg={1}>
                        <a className={classes.next} >&#10094;</a>
                    </Grid>
                    <Grid item xs={10} sm={10} md={10} lg={10}>
                        <Typography><b>Actual</b></Typography>
                        <Typography>{props.data[slideIndex - 1].actual}</Typography>
                        <br />
                        <Typography><b>Target</b></Typography>
                        <Typography>{props.data[slideIndex - 1].target}</Typography>
                    </Grid>
                    <Grid className={classes.arrowGrid} onClick={plusSlides} item xs={1} sm={1} md={1} lg={1}>
                        <a className={classes.prev} >&#10095;</a>
                    </Grid>
                </Grid>
            </div>
        )
    } else {
        return (
            <div>
                <Typography style={{height: '50px', marginTop: '10px'}}>{props.data[slideIndex - 1].name}</Typography>
                <Grid container justify="space-evenly">
                    <Grid className={classes.arrowGrid} onClick={minusSlides} item xs={1} sm={1} md={1} lg={1}>
                        <a className={classes.next} >&#10094;</a>
                    </Grid>
                    <Grid item xs={5} sm={5} md={5} lg={5}>
                        <Typography>Actual</Typography>
                        <Typography>{props.data[slideIndex - 1].actual}</Typography>
                    </Grid>
                    <Grid item xs={5} sm={5} md={5} lg={5}>
                        <Typography>Target</Typography>
                        <Typography>{props.data[slideIndex - 1].target}</Typography>
                    </Grid>
                    <Grid className={classes.arrowGrid} onClick={plusSlides} item xs={1} sm={1} md={1} lg={1}>
                        <a className={classes.prev} >&#10095;</a>
                    </Grid>
                </Grid>
            </div>
        )
    }
}