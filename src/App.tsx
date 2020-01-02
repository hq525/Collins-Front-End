import React from "react";
import "./App.css";
import { BrowserRouter, Route } from "react-router-dom";
import Login from "./auth/Login";
import Dashboard from './dashboard/Dashboard'
import Board from './flipboard/Board';
import TATOTD from './storyboard/TATOTD';
import WIPBoard from './storyboard/WIPBoard';
import DERBoard from './storyboard/DERBoard';
import ProductivityBoard from './storyboard/ProductivityBoard';
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Route path="/" component={Board} exact />
        <Route path="/OTD" component={TATOTD} exact />
        <Route path="/WIP" component={WIPBoard} exact />
        <Route path="/DER" component={DERBoard} exact />
        <Route path="/Productivity" component={ProductivityBoard} exact />
      </BrowserRouter>
    </div>
  );
}

export default App;
