import React from 'react';
import { List, ListItem } from '@material-ui/core';


export default function Legend(props) {
    return (
        <div style={{maxHeight: props.maxHeight, overflow: 'auto', width: "100%"}}>
            <List>
                {
                    props.data.map((entry, index) => {
                        return(
                            <ListItem alignItems="center" button >
                                <div style={{width: "100%", display: "flex", justifyContent: "space-between"}}>
                                        <span style={{display: "flex", alignItems: "center"}}>
                                            <svg width={28} height={28} viewBox={"0 0 32 32"} version={"1.1"} style={{display: "inline-block", verticalAlign: "middle", marginRight: "10px"}}>
                                                <path stroke={"none"} fill={`${entry.color}`} d={"M0,4h32v24h-32z"}></path>
                                            </svg>
                                            <span style={{fontSize: props.fontSize}}>{entry.name}</span>
                                        </span>
                                            <span style={{fontSize: props.fontSize, display: "flex", alignItems: "center"}}>{entry.value}</span>
                                </div>
                            </ListItem>
                    )})
                }
            </List>
        </div>
    )
}