import React from 'react';
import { List, ListItem, ListItemText } from '@material-ui/core';


export default function Legend(props) {
    return (
        <div style={{maxHeight: props.maxHeight, overflow: 'auto', width: "100%"}}>
            <List>
                {
                    props.data.map((entry, index) => {
                        return(
                            <ListItem button >
                                <svg width={14} height={14} viewBox={"0 0 32 32"} version={"1.1"} style={{display: "inline-block", verticalAlign: "middle", marginRight: "4px"}}>
                                    <path stroke={"none"} fill={props.colors[index % props.colors.length]} d={"M0,4h32v24h-32z"}></path>
                                </svg>
                                <ListItemText primary={`${entry.name}`} />
                            </ListItem>
                    )})
                }
            </List>
        </div>
    )
}