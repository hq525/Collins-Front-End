import React from 'react';
import ReactSpeedometer from "react-d3-speedometer"

export default function Speedometer(props) {
    return (
        <div>
            {props.title && <h3>{props.title}</h3>}
            <ReactSpeedometer
                customSegmentStops={props.segmentStops}
                segmentColors={props.segmentColors}
                value={props.value}
                height={props.height? props.height : 200}
                width={props.width ? props.width : 300}
                minValue={props.minValue}
                maxValue={props.maxValue}
                currentValueText={props.currentValue}
            />
        </div>
    )
}