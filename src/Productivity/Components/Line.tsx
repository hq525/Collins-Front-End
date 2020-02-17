import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine,
} from 'recharts';

export default function LineGraph(props) {
    return (
      <div>
        {props.title && <h3>{props.title}</h3>}
        <LineChart
          width={props.width}
          height={props.height}
          data={props.lineData}
          margin={{
            top: 20, right: 20, left: 20, bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="value" stroke="#8884d8" />
        </LineChart>
      </div>
    );
}