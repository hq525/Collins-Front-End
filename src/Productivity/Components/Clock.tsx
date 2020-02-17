import React, { useRef, useState, useEffect } from "react";
import { Stage, Layer, Wedge, Text, Line, Rect, Circle } from 'react-konva';
import _ from "lodash";
import { ENDPOINT } from "../../utils/config";
import API from "../../utils/API";

const rectHeight = 40

export default function Clock(props) {
    const stageRef = useRef(null);
    const [amber, setAmber] = useState("#ff9900");
    const [amberText, setAmberText] = useState("white");
    const [rightComponents, setRightComponents] = useState([]);
    const [leftComponents, setLeftComponents] = useState([]);
    useEffect(() => {
        let api = new API();
        api
        .get(`${ENDPOINT}/component/machine/ranking?machineID=${props.machineID}`)
        .then((data) => {
            var components = data.components;
            if(components.length > 6) {
                let tempRightComponents = [];
                for(let i = 0; i < 6; i++) {
                    tempRightComponents.push({name: components[i].name, color: components[i].color});
                }
                setRightComponents(tempRightComponents);
                let tempLeftComponents = [];
                if(components.length > 12) {
                    for(let i = 6; i < 12; i++) {
                        tempLeftComponents.push({name: components[i].name, color: components[i].color});
                    }
                } else {
                    for(let i = 6; i < components.length; i++) {
                        tempLeftComponents.push({name: components[i].name, color: components[i].color});
                    }
                    if(tempLeftComponents.length < 6) {
                        for(let i = tempLeftComponents.length; i < 6; i++) {
                            tempLeftComponents.push({name: "", color: "#f2f2f2"});
                        }
                    }
                }
                setLeftComponents(tempLeftComponents);
            } else {
                let tempLeftComponents = [];
                for(let i = 0; i < 6; i++) {
                    tempLeftComponents.push({name: "", color: "#f2f2f2"});
                }
                setLeftComponents(tempLeftComponents);
                let tempRightComponents = [];
                components.forEach((component) => {
                    tempRightComponents.push({name: component.name, color: component.color});
                })
                if(tempRightComponents.length < 6) {
                    for(let i = tempRightComponents.length; i < 6; i++) {
                        tempRightComponents.push({name: "", color: "#f2f2f2"});
                    }
                }
                setRightComponents(tempRightComponents);
            }
        })
        .catch((error) => {
            if(error.data && error.data.message) {
                props.setError(error.data.message);
            } else {
                props.setError("An error occurred");
            }
        })
    }, []);
    useEffect(() => {
        setTimeout(() => {
            if(amber === "#ff9900") {
                setAmber("white");
                setAmberText("black")
            } else {
                setAmber("#ff9900");
                setAmberText("white");
            }
        }, 1000);
    }, [amber]);
    const Color = {
        "FLASHING": amber,
        "EXCEED": "#ff0000",
        "EXCEED2": "#ff0000",
        "MAINTENANCE": "#ff9900",
        "MAINTENANCE2": "#ff9900",
        "HEALTHY": "#00ff00",
        "BREAKDOWN": "#ff0000",
        "BREAKDOWN2": "#ff0000"
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
                            rightComponents.map((component, index) => 
                                <Wedge
                                x={props.stageWidth / 2}
                                y={props.stageHeight / 2}
                                radius= {props.radius}
                                angle= {30}
                                fill = {component.color}
                                rotation={(index - 3) * 30}
                                />
                            )
                        }
                        {
                            leftComponents.map((component, index) => 
                                <Wedge
                                x={props.stageWidth / 2}
                                y={props.stageHeight / 2}
                                radius= {props.radius}
                                angle= {30}
                                fill = {component.color}
                                rotation={(index + 3) * 30}
                                />
                            )
                        }
                        {
                            rightComponents.map((component, index) => 
                                <Rect 
                                x={props.stageWidth / 2 + (props.radius + 20) * Math.cos((Math.PI/6)*((index - 3) + 0.5))}
                                y={props.stageHeight / 2 + (props.radius + 20) * Math.sin((Math.PI/6)*((index - 3) + 0.5)) + (transform([-1, 1], [-1, 0],  Math.pow(transform([-3, 2], [-1, 1], (index - 3)),3))) * (rectHeight)}
                                width={props.rectWidth}
                                height={props.rectHeight}
                                fill={component.color}
                                />
                            )
                        }
                        {
                            leftComponents.map((component, index) => 
                                <Rect 
                                x={props.stageWidth / 2 + (props.radius + 20) * Math.cos((Math.PI/6)*((index + 3) + 0.5))-props.rectWidth}
                                y={props.stageHeight / 2 + (props.radius + 20) * Math.sin((Math.PI/6)*((index + 3) + 0.5))+ (transform([-1, 1], [0, -1],  Math.pow(transform([3, 8], [-1, 1], (index + 3)),3))) * (rectHeight)}
                                width={props.rectWidth}
                                height={rectHeight}
                                fill={component.color}
                                />
                            )
                        }
                        {
                            rightComponents.map((component, index) => 
                                <Text 
                                x={props.stageWidth / 2 + (props.radius + 20) * Math.cos((Math.PI/6)*((index - 3) + 0.5))}
                                y={props.stageHeight / 2 + (props.radius + 20) * Math.sin((Math.PI/6)*((index - 3) + 0.5)) + (transform([-1, 1], [-1, 0],  Math.pow(transform([-3, 2], [-1, 1], (index - 3)),3))) * (rectHeight)}
                                text={component.name}
                                fontSize={18}
                                fontFamily={'Calibri'}
                                fill={'white'}
                                width={props.rectWidth}
                                padding={0.25*rectHeight}
                                align={'center'}
                                />
                            )
                        }
                        {
                            leftComponents.map((component, index) => 
                                <Text 
                                x={props.stageWidth / 2 + (props.radius + 20) * Math.cos((Math.PI/6)*((index + 3) + 0.5))-props.rectWidth}
                                y={props.stageHeight / 2 + (props.radius + 20) * Math.sin((Math.PI/6)*((index + 3) + 0.5))+ (transform([-1, 1], [0, -1],  Math.pow(transform([3, 8], [-1, 1], (index + 3)),3))) * (rectHeight)}
                                text={component.name}
                                fontSize={18}
                                fontFamily={'Calibri'}
                                fill={'white'}
                                width={props.rectWidth}
                                padding={0.25*rectHeight}
                                align={'center'}
                                />
                            )
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