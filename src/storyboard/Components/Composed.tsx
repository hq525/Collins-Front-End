import React from 'react';
import {
  ResponsiveContainer, ComposedChart, Line, ReferenceLine, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';

const data = [
    {
        name: 'January', Month: 590, YTD: 590,
    },
    {
        name: 'February', Month: 868, YTD: 967,
    },
    {
        name: 'March', Month: 1397, YTD: 1098,
    },
    {
        name: 'April', Month: 1480, YTD: 1200,
    },
    {
        name: 'May', Month: 1520, YTD: 1108,
    },
    {
        name: 'June', Month: 1400, YTD: 680,
    },
    {
        name: 'July', Month: 1359, YTD: 1209,
    },
    {
        name: 'August', Month: 1340, YTD: 872,
    },
    {
        name: 'September', Month: 1467, YTD: 989,
    },
    {
        name: 'October', Month: 1389, YTD: 890,
    },
    {
        name: 'November', Month: 1576, YTD: 1209,
    },
    {
        name: 'December', Month: 1400, YTD: 680,
    },
];

export default function Composed() {

    return (
    <div style={{ width: '100%', height: '100%' }}>
        <ResponsiveContainer>
        <ComposedChart
            data={data}
            margin={{
            top: 20, right: 20, bottom: 20, left: 20,
            }}
        >
            <CartesianGrid stroke="#f5f5f5" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Month" barSize={20} fill="#413ea0" />
            <Line type="monotone" dataKey="YTD" stroke="#ff7300" />
            <ReferenceLine y={1600} label="Target" stroke="red" />
        </ComposedChart>
        </ResponsiveContainer>
    </div>
    );
}
