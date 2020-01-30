import React, { useRef, useState, useEffect } from "react";
import { Stage, Layer, Wedge, Text, Line, Rect, Circle } from 'react-konva';
import _ from "lodash";

const stageWidth = 1375
const stageHeight= 972
const radius = 100
const rectWidth = 150
const rectHeight = 40

export default function Clock(props) {
    const stageRef = useRef(null);
    const [amber, setAmber] = useState("#ffbf80");
    const [amberText, setAmberText] = useState("white");
    useEffect(() => {
        setTimeout(() => {
            if(amber === "#ffbf80") {
                setAmber("white");
                setAmberText("black")
            } else {
                setAmber("#ffbf80");
                setAmberText("white");
            }
        }, 1000);
    }, [amber]);
    const Color = {
        "FLASHING": amber,
        "EXCEED": "#ff9999",
        "EXCEED2": "#ff9999",
        "MAINTENANCE": "#ffbf80",
        "MAINTENANCE2": "#ffbf80",
        "HEALTHY": "#66ff66",
        "BREAKDOWN": "#cc3300",
        "BREAKDOWN2": "#cc3300"
    }
    return (
        <div className="App">
            <div style={{display: "flex", justifyContent: "center"}}>
                <Stage ref={stageRef} width={props.stageWidth} height={props.stageHeight}>
                    <Layer>
                        {
                            _.range(-3, 9).map(value => 
                                <Line 
                                points={[props.stageWidth / 2, props.stageHeight / 2, props.stageWidth / 2 + (props.radius + 20) * Math.cos((Math.PI/6)*(value + 0.5)), props.stageHeight / 2 + (props.radius + 20) * Math.sin((Math.PI/6)*(value + 0.5))]}
                                stroke={'blue'}
                                strokeWidth={2}
                                />    
                            )
                        }
                        {
                            _.range(-3, 9).map(value => 
                                <Wedge
                                x={props.stageWidth / 2}
                                y={props.stageHeight / 2}
                                radius= {props.radius}
                                angle= {30}
                                fill = {'green'}
                                rotation={value * 30}
                                />
                            )
                        }
                        {
                            _.range(-3, 3).map(value => 
                                <Rect 
                                x={props.stageWidth / 2 + (props.radius + 20) * Math.cos((Math.PI/6)*(value + 0.5))}
                                y={props.stageHeight / 2 + (props.radius + 20) * Math.sin((Math.PI/6)*(value + 0.5)) + (transform([-1, 1], [-1, 0],  Math.pow(transform([-3, 2], [-1, 1], value),3))) * (rectHeight)}
                                width={props.rectWidth}
                                height={props.rectHeight}
                                fill={"green"}
                                />
                            )
                        }
                        {
                            _.range(3, 9).map(value => 
                                <Rect 
                                x={props.stageWidth / 2 + (props.radius + 20) * Math.cos((Math.PI/6)*(value + 0.5))-props.rectWidth}
                                y={props.stageHeight / 2 + (props.radius + 20) * Math.sin((Math.PI/6)*(value + 0.5))+ (transform([-1, 1], [0, -1],  Math.pow(transform([3, 8], [-1, 1], value),3))) * (rectHeight)}
                                width={props.rectWidth}
                                height={rectHeight}
                                fill={"green"}
                                />
                            )
                        }
                        {
                            _.range(-3, 3).map(value => 
                            <Text 
                            x={props.stageWidth / 2 + (props.radius + 20) * Math.cos((Math.PI/6)*(value + 0.5))}
                            y={props.stageHeight / 2 + (props.radius + 20) * Math.sin((Math.PI/6)*(value + 0.5)) + (transform([-1, 1], [-1, 0],  Math.pow(transform([-3, 2], [-1, 1], value),3))) * (rectHeight)}
                            text="test"
                            fontSize={18}
                            fontFamily={'Calibri'}
                            fill={'white'}
                            width={props.rectWidth}
                            padding={0.25*rectHeight}
                            align={'center'}
                            />)
                        }
                        {
                            _.range(3, 9).map(value => {
                                const text = "test"
                                return (<Text 
                                x={props.stageWidth / 2 + (props.radius + 20) * Math.cos((Math.PI/6)*(value + 0.5))-props.rectWidth}
                                y={props.stageHeight / 2 + (props.radius + 20) * Math.sin((Math.PI/6)*(value + 0.5))+ (transform([-1, 1], [0, -1],  Math.pow(transform([3, 8], [-1, 1], value),3))) * (rectHeight)}
                                text={text}
                                fontSize={18}
                                fontFamily={'Calibri'}
                                fill={'white'}
                                width={props.rectWidth}
                                padding={0.25*rectHeight}
                                align={'center'}
                                />)
                            })
                        }
                        <Circle 
                        x={props.stageWidth / 2}
                        y={props.stageHeight / 2}
                        radius={0.8*props.radius}
                        fill={'white'}
                        />
                        <Circle 
                        x={props.stageWidth / 2}
                        y={props.stageHeight / 2}
                        radius={0.6*props.radius}
                        fill={Color[props.status]}
                        />
                        {
                            (props.status === "HEALTHY") ? (
                                <Text 
                                x={props.stageWidth / 2 - props.radius * 0.6}
                                y={props.stageHeight / 2 - 10}
                                text={"Healthy"}
                                fontSize={30}
                                fontFamily={'Calibri'}
                                fill={'white'}
                                width={1.2*props.radius}
                                align={'center'}
                                />
                            ) : (null)
                        }
                        {
                            (props.status === "MAINTENANCE" || props.status === "MAINTENANCE2") ? (
                                <Text 
                                x={props.stageWidth / 2 - props.radius * 0.6}
                                y={props.stageHeight / 2 - 7}
                                text={"Maintenance"}
                                fontSize={21}
                                fontFamily={'Calibri'}
                                fill={'white'}
                                width={1.2*props.radius}
                                align={'center'}
                                />
                            ) : (null)
                        }
                        {
                            (props.status === "BREAKDOWN" || props.status === "BREAKDOWN2") ? (
                                <Text 
                                x={props.stageWidth / 2 - props.radius * 0.6}
                                y={props.stageHeight / 2 - 7}
                                text={"Breakdown"}
                                fontSize={21}
                                fontFamily={'Calibri'}
                                fill={'white'}
                                width={1.2*props.radius}
                                align={'center'}
                                />
                            ) : (null)
                        }
                        {
                            (props.status === "FLASHING") ? (
                                <Text 
                                x={props.stageWidth / 2 - props.radius * 0.6}
                                y={props.stageHeight / 2 - 20}
                                text={"Awaiting"}
                                fontSize={20}
                                fontFamily={'Calibri'}
                                fill={amberText}
                                width={1.2*props.radius}
                                align={'center'}
                                />
                            ) : (
                                null
                            )
                        }
                        {
                            (props.status === "FLASHING") ? (
                                <Text 
                                x={props.stageWidth / 2 - props.radius * 0.6}
                                y={props.stageHeight / 2 + 9}
                                text={"Maintenance"}
                                fontSize={20}
                                fontFamily={'Calibri'}
                                fill={amberText}
                                width={1.2*props.radius}
                                align={'center'}
                                />
                            ) : (
                                null
                            )
                        }
                        {
                            (props.status === "EXCEED" || props.status === "EXCEED2") ? (
                                <Text 
                                x={props.stageWidth / 2 - props.radius * 0.6}
                                y={props.stageHeight / 2 - 15}
                                text={"Maintenance"}
                                fontSize={20}
                                fontFamily={'Calibri'}
                                fill={"white"}
                                width={1.2*props.radius}
                                align={'center'}
                                />
                            ) : (null)
                        }
                        {
                            (props.status === "EXCEED" || props.status === "EXCEED2") ? (
                                <Text 
                                x={props.stageWidth / 2 - props.radius * 0.6}
                                y={props.stageHeight / 2 + 10}
                                text={"Exceeded"}
                                fontSize={20}
                                fontFamily={'Calibri'}
                                fill={"white"}
                                width={1.2*props.radius}
                                align={'center'}
                                />
                            ) : (null)
                        }
                    </Layer>
                </Stage>
            </div>
        </div>
    )
}

function transform(range1, range2, number) {
    let a = range1[0];
    let b = range1[1];
    let c = range2[0];
    let d = range2[1];
    return ((number - a)*(d - c)/(b-a)) + c
}