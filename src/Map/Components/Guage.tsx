import React, { useRef } from "react";
import { Stage, Layer, Rect, Text, Line, Wedge } from 'react-konva';


export default function Guage(props) {
    const stageRef = useRef(null);
    return(
                <Stage ref={stageRef} width={props.stageWidth} height={props.stageHeight}>
                    <Layer>
                        {
                            props.customSegmentStops.map((value, index) => {
                                    if(index === 0) {
                                        return (
                                            <Rect 
                                            x={props.stageWidth / 2  - props.width / 2}
                                            y={props.stageHeight / 2 + props.height * 0.5 - props.height * props.customSegmentStops[index+1]}
                                            width={props.width / 2}
                                            height={props.customSegmentStops[index + 1] * props.height}
                                            fill={props.segmentColors[index]}
                                            />
                                        )
                                    } else {
                                        return (
                                            <Rect 
                                            x={props.stageWidth / 2  - props.width / 2}
                                            y={props.stageHeight / 2 + props.height * 0.5 - props.height * props.customSegmentStops[index+1]}
                                            width={props.width / 2}
                                            height={(props.customSegmentStops[index + 1] - props.customSegmentStops[index]) * props.height}
                                            fill={props.segmentColors[index]}
                                            />
                                        )
                                    }
                                }
                            )
                        }
                        <Text 
                        x={props.stageWidth / 2 - props.width / 2}
                        y={props.stageHeight / 2 + props.height * 0.5 + 10}
                        text={props.currentValue}
                        fontSize={30}
                        fontFamily={'Calibri'}
                        fontStyle={'bold'}
                        fill={'black'}
                        width={props.width}
                        align={'center'}
                        />
                        <Wedge
                        x={props.stageWidth / 2}
                        y={props.stageHeight / 2 + props.height * 0.5 - props.height * props.value}
                        radius= {props.width / 2}
                        angle= {10}
                        fill = {'black'}
                        rotation={-5}
                        />
                        {
                            props.customSegmentStops.map(value => 
                                <Line 
                                points={[props.stageWidth / 2 - props.width / 2, props.stageHeight / 2 + props.height / 2 - props.height * value, props.stageWidth / 2 - props.width / 2 - 10, props.stageHeight / 2 + props.height / 2 - props.height * value]}
                                stroke={'black'}
                                strokeWidth={1}
                                />   
                            )
                        }
                        {
                            props.customSegmentStops.map(value =>
                                <Text 
                                x={props.stageWidth / 2 - props.width / 2 - 50}
                                y={props.stageHeight / 2 + props.height / 2 - props.height * value - 10}
                                text={`${value}`}
                                fontSize={20}
                                fontFamily={'Calibri'}
                                fill={'black'}
                                width={40}
                                align={'center'}
                                />    
                            )
                        }
                    </Layer>
                </Stage>
    )
}