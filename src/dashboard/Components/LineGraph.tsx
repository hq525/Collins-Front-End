import React, { PureComponent } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine,
} from 'recharts';

const lineData = [
  {
    name: 'Jan', uv: 4000, pv: 2400, amt: 2400,
  },
  {
    name: 'Feb', uv: 3000, pv: 1398, amt: 2210,
  },
  {
    name: 'Mar', uv: 2000, pv: 9800, amt: 2290,
  },
  {
    name: 'Apr', uv: 2780, pv: 3908, amt: 2000,
  },
  {
    name: 'May', uv: 1890, pv: 4800, amt: 2181,
  },
  {
    name: 'Jun', uv: 2390, pv: 3800, amt: 2500,
  },
  {
    name: 'Jul', uv: 3490, pv: 4300, amt: 2100,
  },
  {
    name: 'Aug', uv: 4000, pv: 2400, amt: 2400,
  },
  {
    name: 'Sep', uv: 3490, pv: 4300, amt: 2100,
  },
  {
    name: 'Oct', uv: 1890, pv: 4800, amt: 2181,
  },
  {
    name: 'Nov', uv: 2000, pv: 9800, amt: 2290,
  },
  {
    name: 'Dec', uv: 3490, pv: 4300, amt: 2100,
  }
];

export default function LineGraph(props) {
    return (
      <div>
        {props.title && <h3>{props.title}</h3>}
        <LineChart
          width={props.width}
          height={props.height}
          data={lineData}
          margin={{
            top: 20, right: 20, left: 20, bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <ReferenceLine y={9800} stroke="red" />
          <Line type="monotone" dataKey="pv" stroke="#8884d8" />
          {/* <Line type="monotone" dataKey="uv" stroke="#82ca9d" /> */}
        </LineChart>
        {/* <div style={{width: "auto", height: "20px", bottom: "5px", alignItems: "center", justifyContent: "center", display: "flex"}}>
          <ul style={{padding: "0px", margin: "0px", textAlign: "center"}}>
            <li style={{display: "inline-block", marginRight: "10px"}}>
              <svg width={14} height={14} viewBox={"0 0 32 32"} version={"1.1"} style={{display: "inline-block", verticalAlign: "middle", marginRight: "4px"}}>
                <path strokeWidth={4} fill={"none"} stroke={"#8884d8"} d={"M0,16 h10.666666666666666 A5.333333333333333,5.333333333333333,0,1,1,21.333333333333332,16 H32M21.333333333333332,16 A5.333333333333333,5.333333333333333,0,1,1,10.666666666666666,16"} ></path>
              </svg>
              <span>pv</span>
            </li>
            <li style={{display: "inline-block", marginRight: "10px"}}>
            <svg width={14} height={14} viewBox={"0 0 32 32"} version={"1.1"} style={{display: "inline-block", verticalAlign: "middle", marginRight: "4px"}}>
                <path strokeWidth={4} fill={"none"} stroke={"#8884d8"} d={"M0,16 h10.666666666666666 A5.333333333333333,5.333333333333333,0,1,1,21.333333333333332,16 H32M21.333333333333332,16 A5.333333333333333,5.333333333333333,0,1,1,10.666666666666666,16"} ></path>
              </svg>
              <span>uv</span>
            </li>
          </ul>
        </div> */}
      </div>
    );
}