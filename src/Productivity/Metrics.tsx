import React, { useState } from 'react';
import Chart from 'react-apexcharts'
import ProductivityMenu  from "./ProductivityMenu"
import { makeStyles, createStyles } from '@material-ui/styles';
import { Grid, FormControl, InputLabel, Select, MenuItem, Theme, CircularProgress, Button } from '@material-ui/core';
import { InputNumber } from 'antd';
import 'antd/dist/antd.css';
import _ from "lodash";
import { ENDPOINT } from "../utils/config";
import API from "../utils/API";

const categories = ['Available Time', 'Production Time', 'Production Capacity', 'Actual Production', 'Actual Production', 'Good Pieces']

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    formControl: {
      margin: theme.spacing(1),
      minWidth: 120,
    },
  }),
);

const monthss = [{value: 0, name: "January"}, {value: 1, name: "February"}, {value: 2, name: "March"}, {value: 3, name: "April"}, {value: 4, name: "May"}, {value: 5, name: "June"}, {value: 6, name: "July"}, {value: 7, name: "August"}, {value: 8, name: "September"}, {value: 9, name: "October"}, {value: 10, name: "November"}, {value: 11, name: "December"}]

const Colors = {
	blue: "#0099cc",
	orange: "#ff9900",
	green: "#00ff00"
}

export default function Metrics(props) {
	const classes = useStyles({});
	const [machine, setMachine] = useState('');
	const [machineData, setMachineData] = useState([]);
	const [month, setMonth] = useState(new Date().getMonth());
	const [year, setYear] = useState(new Date().getFullYear());
	const [loading, setLoading] = useState(true);
	const monthInputLabel = React.useRef<HTMLLabelElement>(null);
	const [monthLabelWidth, setMonthLabelWidth] = React.useState(0);
	const yearInputLabel = React.useRef<HTMLLabelElement>(null);
	const [yearLabelWidth, setYearLabelWidth] = React.useState(0);
	const machineInputLabel = React.useRef<HTMLLabelElement>(null);
	const [machineLabelWidth, setMachineLabelWidth] = React.useState(0);
	const [availableTime, setAvailableTime] = React.useState(0);
	const [productionTime, setProductionTime] = React.useState(0);
	const [productionCapacity, setProductionCapacity] = React.useState(0);
	const [actualProduction, setActualProduction] = React.useState(0);
	const [goodPieces, setGoodPieces] = React.useState(0);
	const [availabilty, setAvailability] = React.useState(0);
	const [performance, setPerformance] = React.useState(0);
	const [quality, setQuality] = React.useState(0);
	const [OEE, setOEE] = React.useState(0);
	const series = [{
		data: [availableTime, productionTime, productionCapacity, actualProduction, actualProduction, goodPieces]
	}]
	const updateBar = (month, year, machineID) => {
		if(machineID) {
			setLoading(true);
			let api = new API();
			api
			.post(`${ENDPOINT}/metrics/get`, {
				machineID,
				month,
				year
			})
			.then(({metrics}) => {
				if(metrics) {
					setAvailableTime(metrics.availableTime);
					setProductionTime(metrics.productionTime);
					setProductionCapacity(metrics.productionCapacity);
					setActualProduction(metrics.actualProduction);
					setGoodPieces(metrics.goodPieces);
					handleAvailabilityChange(metrics.productionTime, metrics.availableTime);
					handlePerformanceChange(metrics.actualProduction, metrics.productionCapacity);
					handleQualityChange(metrics.goodPieces, metrics.actualProduction);
					handleOEEChange(metrics.productionTime / metrics.availableTime, metrics.actualProduction / metrics.productionCapacity, metrics.goodPieces / metrics.actualProduction)
				} else {
					setAvailableTime(0);
					setProductionTime(0);
					setProductionCapacity(0);
					setActualProduction(0);
					setGoodPieces(0);
					handleAvailabilityChange(0, 0);
					handlePerformanceChange(0, 0);
					handleQualityChange(0, 0);
					handleOEEChange(0,0,0)
				}
				setLoading(false);
			})
			.catch((error) => {
				setLoading(false);
				if(error.data && error.data.message) {
					props.setError(error.data.message)
				} else {
					props.setError("An error occurred")
				}
			})
		}
	}
	React.useEffect(() => {
		setMonthLabelWidth(monthInputLabel.current!.offsetWidth);
		setYearLabelWidth(yearInputLabel.current!.offsetWidth);
		setMachineLabelWidth(machineInputLabel.current!.offsetWidth);
		let api = new API();
		api
		.get(`${ENDPOINT}/machine`)
		.then((data) => {
			let machineData = [];
			data.machines.forEach((machine, index) => {
				machineData.push({name: machine.name, _id: machine._id});
			})
			setMachineData(machineData);
			setLoading(false);
		})
		.catch((error) => {
			if(error.data && error.data.message) {
				props.setError(error.data.message)
			} else {
				props.setError("An error occurred")
			}
			setLoading(false);
		})
		if(props.match.params.machineID) {
			setMachine(props.match.params.machineID)
			updateBar(new Date().getMonth(), new Date().getFullYear(), props.match.params.machineID);
		}
	}, []);
	const options = {
		bar: {
			columnWidth: "100%",
			barHeight: "100%"
		},
		chart: {
		  type: 'bar',
		  height: "100%",
		  toolbar: {
			show: false
		  },
		  sparkline: {
			enabled: true,
			}
		},
		stroke: {
			width: 0
		},
		plotOptions: {
		  bar: {
			horizontal: true,
			barHeight: '80%',
            distributed: true
		  }
		},
		colors: [Colors.blue, Colors.blue, Colors.orange, Colors.orange, Colors.green, Colors.green],
		tooltip: {
			enabled: true,
			marker: {
				show: false
			},
			custom: function({series, seriesIndex, dataPointIndex, w}) {
				return '<div style="padding: 5px" class="arrow_box">' +
				  '<span>' + categories[dataPointIndex] + ": " + series[seriesIndex][dataPointIndex] + '</span>' +
				  '</div>'
			  }
		},
		dataLabels: {
		  enabled: false
		},
		xaxis: {
		  categories,
		  labels: {
			  show: false
		  }
		},
		markers: {
			strokeWidth: 0
		},
		yaxis: {
			labels: {
				show: false
			}
		}
	  }
	  const handleAvailabilityChange = (pt, at) => {
		if(at <= 0) {
			setAvailability(0);
			handleOEEChange(0, performance, quality);
		} else {
			setAvailability(pt / at);
			handleOEEChange(pt/at, performance, quality);
		}
	  }
	  const handlePerformanceChange = (ap, pc) => {
		  if(pc <= 0) {
			  setPerformance(0)
			  handleOEEChange(availabilty, 0, quality);
		  } else {
			  setPerformance(ap/pc);
			  handleOEEChange(availabilty, ap/pc, quality);
		  }
	  }
	  const handleQualityChange = (gp, ap) => {
		  if(ap <= 0) {
			  setQuality(0);
			  handleOEEChange(availabilty, performance, 0);
		  } else {
			  setQuality(gp / ap);
			  handleOEEChange(availabilty, performance, gp/ap);
		  }
	  }
	  const handleOEEChange = (a,p,q) => {
		  setOEE(a * p * q);
	  }
	  const saveMetrics = () => {
		  if(!Number.isInteger(availableTime)) {
			props.setError("Please enter a number for available time")			
		  }
		  else if (availableTime < 0) {
			  props.setError("Please enter a positive number for available time")
		  }
		  else if(availableTime < productionTime) {
			  props.setError("Production time cannot be greater than the available time")
		  }
		  else if (!Number.isInteger(productionTime)) {
			props.setError("Please enter a number for production time")			  
		  }
		  else if(productionTime < 0) {
			  props.setError("Please enter a positive number for production time")
		  }
		  else if (productionTime < productionCapacity) {
			props.setError("Production Capacity cannot be greater than the production time")
		  }
		  else if (!Number.isInteger(productionCapacity)) {
			props.setError("Please enter a number for production capacity")
		  }
		  else if(productionCapacity < 0) {
			props.setError("Please enter a positive number for production capacity")
		  }
		  else if (productionCapacity < actualProduction) {
		    props.setError("Actual production cannot be greater than the production capacity")
		  }
		  else if (!Number.isInteger(actualProduction)) {
			props.setError("Please enter a number for production capacity")
		  }
		  else if(actualProduction < 0) {
			props.setError("Please enter a positive number for production capacity")
		  }
		  else if (actualProduction < goodPieces) {
		    props.setError("Good pieces cannot be greater than the actual production")
		  }
		  else if (!Number.isInteger(goodPieces)) {
			props.setError("Please enter a number for good pieces")
		  }
		  else if(goodPieces < 0) {
			props.setError("Please enter a positive number for good pieces")
		  }
		  else {
			setLoading(true);
			let api = new API();
			api
			.post(`${ENDPOINT}/metrics`, {
				machineID: machine,
				month,
				year,
				availableTime,
				productionTime,
				productionCapacity,
				actualProduction,
				goodPieces
			})
			.then(() => {
				setLoading(false);
			})
			.catch((error) => {
				setLoading(false);
				if(error.data && error.data.message) {
					props.setError(error.data.message);
				} else {
					props.setError("An error occurred")
				}
			})
		  }
	  }
	return(
		<div style={{width: "100%", height: "100%"}}>
			<ProductivityMenu />
			<Grid style={{marginTop: "20px"}} container>
				<Grid style={{display: "flex", justifyContent: "flex-end"}} item xs={4} sm={4} md={4} lg={4}>
					<FormControl variant="outlined" className={classes.formControl}>
						<InputLabel ref={monthInputLabel} id="month-select-label">
							Month
						</InputLabel>
						<Select
						labelId="month-select-label"
						id="month-select"
						value={month}
						onChange={(event) => {setMonth(event.target.value as number); updateBar(event.target.value as number, year, machine)}}
						labelWidth={monthLabelWidth}
						>
							{
								monthss.map((month) => (
									<MenuItem value={month.value}>{month.name}</MenuItem>
								))
							}
						</Select>
					</FormControl>
				</Grid>
				<Grid style={{display: "flex", justifyContent: "center"}} item xs={4} sm={4} md={4} lg={4}>
					<FormControl variant="outlined" className={classes.formControl}>
						<InputLabel ref={machineInputLabel} id="machine-select-label">
							Machine
						</InputLabel>
						<Select
						labelId="machine-select-label"
						id="machine-select"
						value={machine}
						onChange={(event) => {setMachine(event.target.value as string);updateBar(month, year, event.target.value as string);}}
						labelWidth={machineLabelWidth}
						>
							<MenuItem value={''}>
								<em>None</em>
							</MenuItem>
							{
								machineData.map((machine) => (
									<MenuItem value={machine._id}>{machine.name}</MenuItem>
								))
							}
						</Select>
					</FormControl>
				</Grid>
				<Grid style={{display: "flex", justifyContent: "flex-start"}} item xs={4} sm={4} md={4} lg={4}>
					<FormControl variant="outlined" className={classes.formControl}>
						<InputLabel ref={yearInputLabel} id="year-select-label">
							Year
						</InputLabel>
						<Select
						labelId="year-select-label"
						id="year-select"
						value={year}
						onChange={(event) => {setYear(event.target.value as number); updateBar(month, event.target.value as number, machine);}}
						labelWidth={yearLabelWidth}
						>
							{
								_.range(2013, new Date().getFullYear()+2).map((year) => (
									<MenuItem value={year}>{year}</MenuItem>
								))
							}
						</Select>
					</FormControl>
				</Grid>
			</Grid>
			{
				machine ? (
					<Grid style={{height: "900px"}} container>
						<Grid item xs={2} sm={2} md={2} lg={2}>
							<div style={{display: "flex", flexDirection: "column", alignItems: "center", marginTop: "27px"}}>
								<h2 style={{color: Colors.blue}}><b>Available Time</b></h2>
								<InputNumber style={{width: "60%"}} min={Math.min(0, productionTime)} value={availableTime} step={1} onChange={(number) => {setAvailableTime(number);handleAvailabilityChange(productionTime, number);}} />
							</div>
							<div style={{display: "flex", flexDirection: "column", alignItems: "center", marginTop: "55px"}}>
								<h2 style={{color: Colors.blue}}><b>Production Time</b></h2>
								<InputNumber style={{width: "60%"}} max={availableTime} min={Math.min(0,productionCapacity)} value={productionTime} step={1} onChange={(number) => {setProductionTime(number);handleAvailabilityChange(number, availableTime);}} />
							</div>
							<div style={{display: "flex", flexDirection: "column", alignItems: "center", marginTop: "55px"}}>
								<h2 style={{color: Colors.orange}}><b>Production Capacity</b></h2>
								<InputNumber style={{width: "60%"}} max={productionTime} min={Math.min(0,actualProduction)} value={productionCapacity} step={1} onChange={(number) => {setProductionCapacity(number);handlePerformanceChange(actualProduction, number);}} />
							</div>
							<div style={{display: "flex", flexDirection: "column", alignItems: "center", marginTop: "55px"}}>
								<h2 style={{color: Colors.orange}}><b>Actual Production</b></h2>
								<InputNumber style={{width: "60%"}} max={productionCapacity} min={Math.min(0,goodPieces)} value={actualProduction} step={1} onChange={(number) => {setActualProduction(number);handlePerformanceChange(number, productionCapacity);handleQualityChange(goodPieces, number);}} />
							</div>
							<div style={{display: "flex", flexDirection: "column", alignItems: "center", marginTop: "55px"}}>
								<h2 style={{color: Colors.green}}><b>Actual Production</b></h2>
								<InputNumber style={{width: "60%"}} max={productionCapacity} min={Math.min(0,goodPieces)} value={actualProduction} step={1} onChange={(number) => {setActualProduction(number);handlePerformanceChange(number, productionCapacity);handleQualityChange(goodPieces, number);}} />
							</div>
							<div style={{display: "flex", flexDirection: "column", alignItems: "center", marginTop: "55px"}}>
								<h2 style={{color: Colors.green}}><b>Good pieces</b></h2>
								<InputNumber style={{width: "60%"}} min={0} max={actualProduction} value={goodPieces} step={1} onChange={(number) => {setGoodPieces(number);handleQualityChange(number, actualProduction);}} />
							</div>
							<div style={{marginTop: "77px"}}>
								<h1><b>OEE</b></h1>
							</div>
						</Grid>
						{
							loading ? (
								<Grid style={{display: "flex", justifyContent: "center", height: "100%"}} item xs={9} sm={9} md={9} lg={9}>
									<div style={{height: "100%", width: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}>
										<CircularProgress size={50} />
									</div>
								</Grid>
							) : (
								<Grid item xs={8} sm={8} md={8} lg={8}>
									<Chart
									options={options}
									series={series}
									type="bar"
									width={"100%"}
									height={"765px"}
									/>
								</Grid>
							)
						}
						{
							loading ? (
								<Grid item xs={1} sm={1} md={1} lg={1}>

								</Grid>
							) : (
								<Grid item xs={2} sm={2} md={2} lg={2}>
									<div style={{display: "flex", alignItems: "center", height: "260px", justifyContent: "center"}}>
										<div style={{display: "flex", flexDirection: "column", margin: "20px", border: `1px solid ${Colors.blue}`, borderRadius: "10px", width: "90%", height: "90%"}}>
											<h3 style={{marginBottom: "5px", marginTop: "5px", fontSize: 30, color: Colors.blue}}><b>Availability</b></h3>
											<hr style={{marginLeft: 0, marginRight: 0, border: `1px solid ${Colors.blue}`}} />
											<div style={{display: "flex", justifyContent: "center", alignItems: "center", flexGrow: 1}}>
												<h1 style={{marginBottom: "0px", color: Colors.blue}}>{`${Math.round(availabilty * 1000) / 10} %`}</h1>
											</div>
										</div>
									</div>
									<div style={{display: "flex", alignItems: "center", height: "250px", justifyContent: "center"}}>
										<div style={{display: "flex", flexDirection: "column", margin: "20px", border: `1px solid ${Colors.orange}`, borderRadius: "10px", width: "90%", height: "90%"}}>
											<h3 style={{marginBottom: "5px", marginTop: "5px", fontSize: 30, color: Colors.orange}}><b>Performance</b></h3>
											<hr style={{marginLeft: 0, marginRight: 0, border: `1px solid ${Colors.orange}`}} />
											<div style={{display: "flex", justifyContent: "center", alignItems: "center", flexGrow: 1}}>
												<h1 style={{marginBottom: "0px", color: Colors.orange}}>{`${Math.round(performance * 1000) / 10} %`}</h1>
											</div>
										</div>
									</div>
									<div style={{display: "flex", alignItems: "center", height: "250px", justifyContent: "center"}}>
										<div style={{display: "flex", flexDirection: "column", margin: "20px", border: `1px solid ${Colors.green}`, borderRadius: "10px", width: "90%", height: "90%"}}>
											<h3 style={{marginBottom: "5px", marginTop: "5px", fontSize: 30, color: Colors.green}}><b>Quality</b></h3>
											<hr style={{marginLeft: 0, marginRight: 0, border: `1px solid ${Colors.green}`}} />
											<div style={{display: "flex", justifyContent: "center", alignItems: "center", flexGrow: 1}}>
												<h1 style={{marginBottom: "0px", color: Colors.green}}>{`${Math.round(quality * 1000) / 10} %`}</h1>
											</div>
										</div>
									</div>
									<div style={{display: "flex", alignItems: "center", height: "90px", justifyContent: "center", marginTop: "17px"}}>
										<div style={{display: "flex", justifyContent: "center", alignItems: "center", margin: "20px", border: "1px solid black", borderRadius: "10px", width: "90%", height: "100%"}}>
											<h1 style={{marginBottom: "0px"}}>{`${Math.round(OEE * 1000) / 10} %`}</h1>
										</div>
									</div>
									<div style={{marginTop: "20px", width: "100%", display: "flex", justifyContent: "center"}}>
										<Button style={{width: "90%"}} onClick={saveMetrics} variant="contained" color="primary">
											Save
										</Button>
									</div>
								</Grid>
							)
						}
					</Grid>
				) : (
					<div></div>
				)
			}
		</div>
	)
}