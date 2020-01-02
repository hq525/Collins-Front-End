import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell 
} from 'recharts';

const data = [
  {
    name: 'Sept',
    value: 60
  },
  {
    name: 'YTD',
    value: 65
  }
]

export default function BarGraph() {
  return(
    <BarChart
    width={250}
    height={150}
    data={data}
    margin={{
      top: 5, right: 30, left: 20, bottom: 5,
    }}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="name" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="value"  fill="#8884d8" >
        {
          data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={index === 0 ? "#ff9900" : "#00cc00"} />
          ))
        }
      </Bar>
    </BarChart>    
  )
}