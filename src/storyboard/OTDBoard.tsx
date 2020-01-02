import React from 'react';
import Composed from './Components/Composed';
import Table from './Components/Table';

export default function OTDBoard(props) {
    return (
      <div style={{width: "100%", height: "100%"}}>
        <div style={{ display: "flex", alignItems: "center", width: '95%', height: '80%'}}>
          <Composed />
        </div>
        <div>
          <Table />
        </div>
      </div>        
  )
}