import React from 'react';
import {
  PieChart, Pie, Tooltip, Cell
} from 'recharts';

const innerRadius = 0
const outerRadius = 100
const width = 200
const height = 200

export default function Piee(props) {
  const CustomTooltip = ({active, payload}) => {
    if (active) {     
      return (
        <div style={{width: "200px", margin: "0", lineHeight: "24px", textAlign: "left", border: "1px solid #f5f5f5", backgroundColor: "hsla(0,0%,100%,.8)", padding:"10px"}}>
          <p style={{margin: 0, color: "#666", fontWeight: 700}}>{`${payload[0].name}`}</p>
          <p style={{borderTop: "1px solid #f5f5f5", margin: 0}}></p>
          <p style={{margin: 0, color: "#999"}}>{getIntroOfPage(payload[0].name)}</p>
        </div>
      );
    }
  
    return null;
  };
  const getIntroOfPage = (label) => {
    return props.descriptions[props.labels.indexOf(label)]
  };
  return (
    <div style={{width: "100%", display:"flex", alignItems: "center", justifyContent: "center"}}>
      <PieChart width={props.width ? props.width : width} height={props.height ? props.height : height}>
        <Pie 
        label={() => {return (
            <g >
              <text fontSize={props.width / 7} x={props.width / 2} y={props.height / 2} dy={8} textAnchor="middle" fill={"black"}>{props.label}</text>
            </g>
        )}} 
        labelLine={false}
        dataKey={props.dataKey} 
        isAnimationActive={false} 
        data={props.data} 
        innerRadius={props.innerRadius !== undefined && props.innerRadius !== null ? props.innerRadius : innerRadius} 
        outerRadius={props.outerRadius ? props.outerRadius : outerRadius} 
        fill="#8884d8"  
        >
          {
            props.data.map((entry, index) => <Cell key={`cell-${index}`} fill={props.colors[index % props.colors.length]} />)
          }  
        </Pie> 
        // @ts-ignore
        <Tooltip content={<CustomTooltip />} />
      </PieChart>
    </div>
  );
}
