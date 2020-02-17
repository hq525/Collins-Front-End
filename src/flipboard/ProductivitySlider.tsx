import React, { useState, useEffect } from "react";
import Slider from "react-slick";
import { Grid, Typography, CircularProgress } from '@material-ui/core';
import { ENDPOINT } from "../utils/config";
import API from "../utils/API";

const monthss = {
    0: "January",
    1: "February",
    2: "March",
    3: "April",
    4: "May",
    5: "June",
    6: "July",
    7: "August",
    8: "September",
    9: "October",
    10: "November",
    11: "December"
}

export default function ProductivitySlider(props) {
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        height: 2000,
        initialSlide: 1,
        nextArrow: <div style={{background: "transparent"}} />,
        prevArrow: <div style={{background: "transparent"}} />
    };
    const [loading, setLoading] = useState(true);
    const [YTDOEE, setYTDOEE] = useState(0);
    const [YTDTotalLabourHours, setYTDTotalLabourHours] = useState(0);
    const [YTDAverageLabourHours, setYTDAverageLabourHours] = useState(0);
    const [lastMonthOEE, setLastMonthOEE] = useState(0);
    const [lastMonthTotalLabourHours, setLastMonthTotalLabourHours] = useState(0);
    const [lastMonthAverageLabourHours, setLastMonthAverageLabourHours] = useState(0);
    const [lastLastMonthOEE, setLastLastMonthOEE] = useState(0);
    const [lastLastMonthTotalLabourHours, setLastLastMonthTotalLabourHours] = useState(0);
    const [lastLastMonthAverageLabourHours, setLastLastMonthAverageLabourHours] = useState(0);
    const [lastMonthDate, setLastMonthDate] = useState(new Date());
    const [lastLastMonthDate, setLastLastMonthDate] = useState(new Date());
    useEffect(() => {
        let lastMonthDate = new Date();
        lastMonthDate.setMonth(lastMonthDate.getMonth() - 1);
        let lastLastMonthDate = new Date();
        lastLastMonthDate.setMonth(lastLastMonthDate.getMonth() - 2);
        setLastMonthDate(lastMonthDate);
        setLastLastMonthDate(lastLastMonthDate);
        async function initialize() {
            let api = new API();
            try {
                await new Promise((resolve, reject) => {
                    api
                    .post(`${ENDPOINT}/metrics/get/ytd/average/OEE`, {
                        year: new Date().getFullYear()
                    })
                    .then((data) => {
                        setYTDOEE(data.OEE);
                        resolve()
                    })
                    .catch((error) => {
                        reject(error);
                    })
                })
            } catch (error) {
                setLoading(false);
                if(error && error.data && error.data.message) {
                    props.setError(error.data.message)
                } else {
                    props.setError("An error occurred")
                }
            }
            try {
                await new Promise((resolve, reject) => {
                    api
                    .post(`${ENDPOINT}/job/YTD/total`, {
                        year: new Date().getFullYear()
                    })
                    .then((data) => {
                        setYTDTotalLabourHours(data.total);
                        resolve()
                    })
                    .catch((error) => {
                        reject(error);
                    })
                })
            } catch (error) {
                setLoading(false);
                if(error && error.data && error.data.message) {
                    props.setError(error.data.message)
                } else {
                    props.setError("An error occurred")
                }
            }
            try {
                await new Promise((resolve, reject) => {
                    api
                    .post(`${ENDPOINT}/job/YTD/average`, {
                        year: new Date().getFullYear()
                    })
                    .then((data) => {
                        setYTDAverageLabourHours(data.average);
                        resolve()
                    })
                    .catch((error) => {
                        reject(error);
                    })
                })
            } catch (error) {
                setLoading(false);
                if(error && error.data && error.data.message) {
                    props.setError(error.data.message)
                } else {
                    props.setError("An error occurred")
                }
            }
            try {
                await new Promise((resolve, reject) => {
                    api
                    .post(`${ENDPOINT}/job/period/average`, {
                        year: lastMonthDate.getFullYear(),
                        month: lastMonthDate.getMonth()
                    })
                    .then((data) => {
                        setLastMonthAverageLabourHours(data.average);
                        resolve()
                    })
                    .catch((error) => {
                        reject(error);
                    })
                })
            } catch (error) {
                setLoading(false);
                if(error && error.data && error.data.message) {
                    props.setError(error.data.message)
                } else {
                    props.setError("An error occurred")
                }
            }
            try {
                await new Promise((resolve, reject) => {
                    api
                    .post(`${ENDPOINT}/job/period/total`, {
                        year: lastMonthDate.getFullYear(),
                        month: lastMonthDate.getMonth()
                    })
                    .then((data) => {
                        setLastMonthTotalLabourHours(data.total);
                        resolve()
                    })
                    .catch((error) => {
                        reject(error);
                    })
                })
            } catch (error) {
                setLoading(false);
                if(error && error.data && error.data.message) {
                    props.setError(error.data.message)
                } else {
                    props.setError("An error occurred")
                }
            }
            try {
                await new Promise((resolve, reject) => {
                    api
                    .post(`${ENDPOINT}/job/period/average`, {
                        year: lastLastMonthDate.getFullYear(),
                        month: lastLastMonthDate.getMonth()
                    })
                    .then((data) => {
                        setLastLastMonthAverageLabourHours(data.average);
                        resolve()
                    })
                    .catch((error) => {
                        reject(error);
                    })
                })
            } catch (error) {
                setLoading(false);
                if(error && error.data && error.data.message) {
                    props.setError(error.data.message)
                } else {
                    props.setError("An error occurred")
                }
            }
            try {
                await new Promise((resolve, reject) => {
                    api
                    .post(`${ENDPOINT}/job/period/total`, {
                        year: lastLastMonthDate.getFullYear(),
                        month: lastLastMonthDate.getMonth()
                    })
                    .then((data) => {
                        setLastLastMonthTotalLabourHours(data.total);
                        resolve()
                    })
                    .catch((error) => {
                        reject(error);
                    })
                })
            } catch (error) {
                setLoading(false);
                if(error && error.data && error.data.message) {
                    props.setError(error.data.message)
                } else {
                    props.setError("An error occurred")
                }
            }
            setLoading(false);
        }
        initialize()
    }, []);
    return (
        <div style={{display: "flex", justifyContent: "center", flexGrow: 1, marginTop: "20px", flexFlow: "column", alignItems: "center"}}>
                {
                    loading ? (
                        <div style={{flexGrow: 1, width: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}>
                            <CircularProgress size={40} />
                        </div>
                    ) : (
                        <div style={{width: "80%", height: "100%"}}>
                            <Slider {...settings}>
                                <div>
                                    <div style={{minHeight: "345px"}}>
                                        <h3 style={{fontWeight: "bold", fontSize: 30}}>{`${monthss[lastMonthDate.getMonth()]} (${lastMonthDate.getFullYear()})`}</h3>
                                        <hr />
                                        <Grid container justify="space-between">
                                            <Grid item>
                                                <Typography style={{fontWeight: "bold", fontSize: 20, paddingLeft: "5px"}}>OEE</Typography>
                                            </Grid>
                                            <Grid item>
                                                <Typography style={{fontWeight: "bold", fontSize: 20, paddingRight: "5px"}}>{`${Math.round(lastMonthOEE * 1000) / 10}%`}</Typography>
                                            </Grid>
                                        </Grid>
                                        <Grid container justify="space-between">
                                            <Grid item>
                                                <Typography style={{fontWeight: "bold", fontSize: 20, paddingLeft: "5px"}}>Total labour hours</Typography>
                                            </Grid>
                                            <Grid item>
                                                <Typography style={{fontWeight: "bold", fontSize: 20, paddingRight: "5px"}}>{lastMonthTotalLabourHours}</Typography>
                                            </Grid>
                                        </Grid>
                                        <Grid container justify="space-between">
                                            <Grid item>
                                                <Typography style={{fontWeight: "bold", fontSize: 20, paddingLeft: "5px"}}>Average labour hours</Typography>
                                            </Grid>
                                            <Grid item>
                                                <Typography style={{fontWeight: "bold", fontSize: 20, paddingRight: "5px"}}>{Math.round(lastMonthAverageLabourHours * 100) / 100}</Typography>
                                            </Grid>
                                        </Grid>
                                    </div>
                                </div>
                                <div>
                                    <div style={{minHeight: "345px"}}>
                                        <h3 style={{fontWeight: "bold", fontSize: 30}}>{`YTD (${new Date().getFullYear()})`}</h3>
                                        <hr />
                                        <Grid container justify="space-between">
                                            <Grid item>
                                                <Typography style={{fontWeight: "bold", fontSize: 20, paddingLeft: "5px"}}>OEE</Typography>
                                            </Grid>
                                            <Grid item>
                                                <Typography style={{fontWeight: "bold", fontSize: 20, paddingRight: "5px"}}>{`${Math.round(YTDOEE * 1000) / 10}%`}</Typography>
                                            </Grid>
                                        </Grid>
                                        <Grid container justify="space-between">
                                            <Grid item>
                                                <Typography style={{fontWeight: "bold", fontSize: 20, paddingLeft: "5px"}}>Total labour hours</Typography>
                                            </Grid>
                                            <Grid item>
                                                <Typography style={{fontWeight: "bold", fontSize: 20, paddingRight: "5px"}}>{YTDTotalLabourHours}</Typography>
                                            </Grid>
                                        </Grid>
                                        <Grid container justify="space-between">
                                            <Grid item>
                                                <Typography style={{fontWeight: "bold", fontSize: 20, paddingLeft: "5px"}}>Average labour hours</Typography>
                                            </Grid>
                                            <Grid item>
                                                <Typography style={{fontWeight: "bold", fontSize: 20, paddingRight: "5px"}}>{Math.round(YTDAverageLabourHours * 100) / 100}</Typography>
                                            </Grid>
                                        </Grid>
                                    </div>
                                </div>
                                <div >
                                    <div style={{minHeight: "345px"}}>
                                        <h3 style={{fontWeight: "bold", fontSize: 30}}>{`${monthss[lastLastMonthDate.getMonth()]} (${lastLastMonthDate.getFullYear()})`}</h3>
                                        <hr />
                                        <Grid container justify="space-between">
                                            <Grid item>
                                                <Typography style={{fontWeight: "bold", fontSize: 20, paddingLeft: "5px"}}>OEE</Typography>
                                            </Grid>
                                            <Grid item>
                                                <Typography style={{fontWeight: "bold", fontSize: 20, paddingRight: "5px"}}>{`${Math.round(lastLastMonthOEE * 1000) / 10}%`}</Typography>
                                            </Grid>
                                        </Grid>
                                        <Grid container justify="space-between">
                                            <Grid item>
                                                <Typography style={{fontWeight: "bold", fontSize: 20, paddingLeft: "5px"}}>Total labour hours</Typography>
                                            </Grid>
                                            <Grid item>
                                                <Typography style={{fontWeight: "bold", fontSize: 20, paddingRight: "5px"}}>{lastLastMonthTotalLabourHours}</Typography>
                                            </Grid>
                                        </Grid>
                                        <Grid container justify="space-between">
                                            <Grid item>
                                                <Typography style={{fontWeight: "bold", fontSize: 20, paddingLeft: "5px"}}>Average labour hours</Typography>
                                            </Grid>
                                            <Grid item>
                                                <Typography style={{fontWeight: "bold", fontSize: 20, paddingRight: "5px"}}>{Math.round(lastLastMonthAverageLabourHours * 100) / 100}</Typography>
                                            </Grid>
                                        </Grid>
                                    </div>
                                </div>
                            </Slider>
                        </div>
                    )
                }
        </div>
    );
}

