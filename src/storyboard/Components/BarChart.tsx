import Chart from 'react-apexcharts'
import React from 'react';

export default function BarChart(props) {
	const optionsBar = {
		chart: {
		  stacked: true,
		  stackType: "normal",
		  toolbar: {
			show: false
		  },
		  sparkline: {
			  enabled: true
		  }
		},
		plotOptions: {
		  bar: {
			horizontal: true
		  }
		},
		dataLabels: {
			enabled: false,
		  dropShadow: {
			enabled: false
		  }
		},
		stroke: {
		  width: 0
		},
		tooltip: {
			marker: {
				show: false
			}
		},
		xaxis: {
		  categories: ["Average Time"],
		  labels: {
			show: false
		  },
		  axisBorder: {
			show: false
		  },
		  axisTicks: {
			show: false
		  }
		},
		fill: {
			colors: props.colors,
		  opacity: 1
		},
	
		legend: {
		  show: false
		},
		annotations: {
			xaxis: [{
				x: 39.75,
				x2: 40.25,
				strokeDashArray: 1,
				borderColor: '#ff0000',
				fillColor: "#ff0000",
				opacity: 1,
				label: {
					borderColor: '#c2c2c2',
					borderWidth: 1,
					text: "Target",
					textAnchor: 'middle',
					position: 'bottom',
					orientation: 'vertical',
					offsetX: 0,
					offsetY: 0,
					style: {
						background: '#fff',
						color: '#777',
						fontSize: '12px',
						cssClass: 'apexcharts-xaxis-annotation-label',
					},
				},
			}]
		}
	  }
	  console.log(props.colors)
	  console.log(props.seriesBar)
	return(
		<div style={{position: "relative", left: "30px"}}>
            <Chart
			  //@ts-ignore
              options={optionsBar}
			  height={140}
			  //@ts-ignore
              series={props.seriesBar}
              type="bar"
              width={"100%"}
            />
        </div>
	)
}
