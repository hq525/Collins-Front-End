import React, { useState, useEffect } from "react";
import './SliderInput.css'
import { InputNumber } from 'antd';
import 'antd/dist/antd.css';

const sortValues = (a, b) => { return a-b; }

export default function SliderInput(props) {
    const [state, setState] = useState({
        limits: [props.limits[0], props.limits[1]],
        size: Math.abs(props.limits[1]-props.limits[0]),
        values: [props.values[0], props.values[1]],
        lock: props.lock,
        reverse: props.reverse,
        isSelDown: false,
        indexSelDown: 0,
        moveStartValue: 0,
        moveCurrentValue: 0,
        moveStartX: 0,
        moveCurrentX: 0,
        boxWidth:0, 
        formatFunc: props.formatFunc, 
        onChange: props.onChange,
        rangeColor: props.colors[1]
    })
    const [displayValues, setDisplayValues] = useState([0,100]);
    const [displayLimits, setDisplayLimits] = useState([0,100]);
    const [leftPos, setLeftPos] = useState([0,100]);
    const [crossLinePos, setCrossLinePos] = useState([0,100])
    const [styleCrossline, setStyleCrossline] = useState({
        left:'0%',
        right:'100%',
        backgroundColor:props.colors[1]
    })
    const [styleLeftline, setStyleLeftline] = useState({
      left:'0%',
      right:'100%'
  })
    const [styleSelector0, setStyleSelector0] = useState({
        left:'0%',
        display: props.lock[0] === false ? 'block' : 'none'
      })

    const [styleSelector1, setStyleSelector1] = useState({
        left:'100%',
        display: props.lock[1] === false ? 'block' : 'none'
    })

    const [styleValueRange, setStyleValueRange] = useState({
        backgroundColor:props.colors[1]
      })

    useEffect(() => {
        setDisplayValues(getDisplayValues());
        setDisplayLimits(getDisplayLimits());
        setLeftPos(getLeftPositions());
        let crossLinePos = getLeftPositions().slice();
        crossLinePos.sort(sortValues);
        crossLinePos[1] = 100-crossLinePos[1];
        setCrossLinePos(crossLinePos);
        setStyleCrossline({
            ...styleCrossline,
            left:crossLinePos[0]+'%',
            right:crossLinePos[1]+'%'
        })
        setStyleLeftline({
          ...styleLeftline,
          right:(100 - crossLinePos[0])+'%'
      })
        setStyleSelector0({
            ...styleSelector0,
            left:getLeftPositions()[0]+'%'
        })
        setStyleSelector1({
            ...styleSelector1,
            left:getLeftPositions()[1]+'%'
        })
    }, [state]);

    useEffect(() => {
        let limits = props.limits.slice().sort(sortValues);
        let values = props.values.slice().sort(sortValues);
        let size = Math.abs(limits[1]-limits[0]);

        values[0] = values[0]<limits[0] ? limits[0] : values[0]>limits[1] ? limits[1] : values[0];
        values[1] = values[1]>limits[1] ? limits[1] : values[1]<limits[0] ? limits[0] : values[1];
        
        setState({
            ...state,
            limits,
            values,
            size
        })
        setDisplayValues(getDisplayValues());
        setDisplayLimits(getDisplayLimits());
        setLeftPos(getLeftPositions());
        let crossLinePos = getLeftPositions().slice();
        crossLinePos.sort(sortValues);
        crossLinePos[1] = 100-crossLinePos[1];
        setCrossLinePos(crossLinePos);
        setStyleCrossline({
            ...styleCrossline,
            left:crossLinePos[0]+'%',
            right:crossLinePos[1]+'%',
            backgroundColor:props.colors[1]
        })
        setStyleLeftline({
          ...styleLeftline,
          right:(100 - crossLinePos[0])+'%'
      })
        setStyleSelector0({
            ...styleSelector0,
            left:getLeftPositions()[0]+'%',
            display: props.lock[0] === false ? 'block' : 'none'
        })
        setStyleSelector1({
            ...styleSelector1,
            left:getLeftPositions()[1]+'%',
            display: props.lock[1] === false ? 'block' : 'none'
        })
        setStyleValueRange({
            ...styleValueRange,
            backgroundColor: props.colors[1]
        })
    }, [props]);

    const startToMoveMouse = (event, index) => {
        setState({
            ...state,
            isSelDown:true,
            indexSelDown: index,
            moveStartValue: state.values[index],
            moveCurrentValue: state.values[index],
            moveStartX: event.clientX,
            moveCurrentX: event.clientX,
            boxWidth:event.currentTarget.parentElement.offsetWidth
        });
        event.stopPropagation();
      }

      const startToMoveTouch = (event, index) => {
        setState({
            ...state,
            isSelDown:true,
            indexSelDown: index,
            moveStartValue: state.values[index],
            moveCurrentValue: state.values[index],
            moveStartX: event.touches[0].clientX,
            moveCurrentX: event.touches[0].clientX,
            boxWidth:event.currentTarget.parentElement.offsetWidth
        });
        event.stopPropagation();
      }

      const onMouseDown0 = (event) => {
        startToMoveMouse(event, 0);
      }

      const onMouseDown1 = (event) => {
        startToMoveMouse(event, 1);
      }

      const onTouchStart0 = (event) => {
        startToMoveTouch(event, 0);
      }

      const onTouchStart1 = (event) => {
        startToMoveTouch(event, 1);
      }

      const onTouchMove = (event) => {
        touchMove(event);
      }

      const onTouchEnd = (event) => {
        stopToMove(event);
      }

      const onMouseMove = (event) => {
        mouseMove(event)
      }

      const mouseMove = (event) => {
        if(state.isSelDown) {
          setState({
              ...state,
              moveCurrentX: event.clientX,
              moveCurrentValue: getMoveCurrentValue(event.clientX)
          });
          onChange();
        }
      }

      const touchMove = (event) => {
        if(state.isSelDown) {
          setState({
              ...state,
              moveCurrentX: event.touches[0].clientX,
              moveCurrentValue: getMoveCurrentValue(event.touches[0].clientX)
          });
          onChange();
        }
      }

      const getMoveCurrentValue = (moveCurrentX) => {
        let moveBoxProportion = (moveCurrentX-state.moveStartX)/state.boxWidth;
        if(state.reverse) {
          moveBoxProportion = moveBoxProportion*-1;
        }
        const moveIntoLimit = state.size * moveBoxProportion;
        let moveCurrentValue = state.moveStartValue+moveIntoLimit;
        moveCurrentValue = moveCurrentValue<state.limits[0]?state.limits[0]:moveCurrentValue;
        moveCurrentValue = moveCurrentValue>state.limits[1]?state.limits[1]:moveCurrentValue;
    
        return moveCurrentValue;
      }

      const formatOutput = () => {
        const values = getValues();
        return [state.formatFunc(values[0]), state.formatFunc(values[1])];
      }

      const stopToMove = (event) => {
        if(state.isSelDown) {
          let values = getValues();
          setState({
              ...state,
              values,
              isSelDown: false
          });
        }
        event.stopPropagation();
      }

      const onMouseLeave = (event) => {
        stopToMove(event);
      }

      const onMouseUp = (event) => {
        stopToMove(event);
      }

      const getLimits = () => {
        return state.limits.slice();
      }

      const getDisplayLimits = () => {
        let limits = getLimits();
        if(state.reverse) {
          limits.reverse();
        }
        return [state.formatFunc(limits[0]), state.formatFunc(limits[1])];
      }

      const getValues = () => {
        let values = state.values.slice();
        if(state.isSelDown) {
          values[state.indexSelDown] = state.moveCurrentValue;
        }
        return values;
      }

      const getDisplayValues = () => {
        let values = formatOutput().sort(sortValues);
        values = state.reverse ? values.reverse(): values;
        return values;
      }

      const getLeftPositions = () => {

        const values = getValues();
    
        const limits = getLimits();
    
        const size = state.size;
    
        const left = [values[0]-limits[0], values[1]-limits[0]];
        const leftPos = [left[0]/size*100, left[1]/size*100];
    
        if(state.reverse) {
          return [100-leftPos[0], 100-leftPos[1]];
        }
        return leftPos;
      }

      const onChange = () => {
        props.onChange(formatOutput().sort(sortValues));
      }

    return(
      <div
      className="component"
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onMouseUp={onMouseUp}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      >
        <div className="values">
          <div className="limit" style={{textAlign: "left"}}>{props.labelFormatter(displayLimits[0])}</div>
          <div className="limit">{props.endLabelFormatter ? <InputNumber style={{color: "red", borderColor: "red"}} min={props.values[1]} value={props.limits[1]} step={1} onChange={(number) => {props.onEndLabelChange(number)}} /> : props.labelFormatter(displayLimits[1])}</div>
        </div>
        <div className="sliders">
          <div className="line" style={{backgroundColor: props.colors[2]}}>
            <div className="leftLine" style={{left: styleLeftline.left, right: styleLeftline.right, backgroundColor: props.colors[0]}}>
            </div>
            <div className="crossLine" style={styleCrossline}>
            </div>
          </div>
          <div 
            className="selector selector0" 
            style={styleSelector0}
            onMouseDown={onMouseDown0}
            onTouchStart={onTouchStart0}
            >
            <div></div>
          </div>
          <div
            className="selector selector1" 
            style={styleSelector1}
            onMouseDown={onMouseDown1}
            onTouchStart={onTouchStart1}
            >
            <div></div>
          </div>
        </div>
        <div className="sliders" style={{height: "auto"}}>
          <div className="selector selector0" style={{left: styleSelector0.left, display: styleSelector0.display, height: "auto"}}>{props.labelFormatter(displayValues[0])}</div>
          <div className="selector selector1" style={{left: styleSelector1.left, display: styleSelector1.display, height: "auto"}}>{props.labelFormatter(displayValues[1]) }</div>
        </div>
      </div>
    )
}