import React from 'react';
import { Paper, List, ListItem, ListItemText } from '@material-ui/core';


export default function Legend(props) {
    return (
        <div style={{maxHeight: 150, overflow: 'auto', width: "100%"}}>
            <List>
                {
                    props.data.map((entry, index) => {
                        return(
                            <ListItem button >
                                <svg width={14} height={14} viewBox={"0 0 32 32"} version={"1.1"} style={{display: "inline-block", verticalAlign: "middle", marginRight: "4px"}}>
                                    <path stroke={"none"} fill={"#0088FE"} d={"M0,4h32v24h-32z"}></path>
                                </svg>
                                <ListItemText primary="Inbox" />
                            </ListItem>
                    )})
                }
            </List>
        </div>
    )
}