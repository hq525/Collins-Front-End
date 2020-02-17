import React, { useEffect, useState } from "react";
import "./App.css";
import { BrowserRouter, Route } from "react-router-dom";
import Login from "./auth/Login";
import Main from './Productivity/Main';
import Schedule from './Productivity/Schedule';
import Data from './Productivity/Data';
import Edit from './Productivity/Edit';
import ProfileEdit from "./Productivity/ProfileEdit";
import Metrics from "./Productivity/Metrics";
import Roster from "./Productivity/Roster";
import RosterEdit from "./Productivity/RosterEdit";
import Board from "./flipboard/Board";
import RangeEdit from "./Productivity/RangeEdit";
import { userStore } from "./index";
import { observer } from "mobx-react";
import { Snackbar, CircularProgress } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import API from './utils/API';
import { ENDPOINT } from "./utils/config";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if(localStorage.jwtToken) {
      let api = new API();
      api
      .post(`${ENDPOINT}/authentication/JWT`, {
        JWT: localStorage.jwtToken
      })
      .then((data) => {
        userStore.setUser(data.user);
        userStore.setAuthenticated(true);
        setLoading(false);
      })
      .catch((error) => {
        userStore.setAuthenticated(false);
        setLoading(false);
      })
    } else {
      setLoading(false);
    }
  }, [])


  const [errorBarOpen, setErrorBarOpen] = React.useState(false);
  const [errorText, setErrorText] = React.useState('');

  const setError = (text) => {
    setErrorText(text);
    setErrorBarOpen(true);
  }

  const closeError = () => {
    setErrorBarOpen(false);
  }

  if(loading) {
    return (
      <div className="App">
        <div style={{display: "flex", justifyContent: "center", height: "100%"}}>
          <div style={{width: "100%", height: "100%", display: "flex", justifyContent: "center", alignItems: "center"}}>
            <CircularProgress size={200} />
          </div>  
        </div>
      </div>
    )
  } else {
    if(!userStore.isAuthenticated) {
      return (
        <div className="App">
          <Login />
        </div>
      )
    } else {
      return (
        <div className="App">
          <BrowserRouter>
            <Route path="/" render={() => <Board setError={setError} />} exact />
            <Route path="/Productivity" render={() => <Main setError={setError} />} exact />
            <Route path="/schedule/:machineID" render={(props) => <Schedule {...props} setError={setError} />} exact />
            <Route path="/schedule" render={(props) => <Schedule {...props} setError={setError} />} exact />
            <Route path="/data" render={() => <Data setError={setError} />} exact />
            <Route path="/edit" render={() => <Edit setError={setError} />} exact />
            <Route path="/profile/edit" render={() => <ProfileEdit setError={setError} />} exact />
            <Route path="/metrics/:machineID" render={(props) => <Metrics {...props} setError={setError} />} exact />
            <Route path="/metrics" render={(props) => <Metrics {...props} setError={setError} />} exact />
            <Route path="/roster" render={() => <Roster setError={setError} />} exact />
            <Route path="/roster/edit" render={() => <RosterEdit setError={setError} />} exact />
            <Route path="/range/edit" render={() => <RangeEdit setError={setError} />} exact />
          </BrowserRouter>
          <Snackbar 
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'center',
          }}
          open={errorBarOpen}
          autoHideDuration={6000}
          onClose={closeError}
          message={errorText}
          action={
            <React.Fragment>
              <IconButton size="small" aria-label="close" color="inherit" onClick={closeError}>
                <CloseIcon fontSize="small" />
              </IconButton>
            </React.Fragment>
          }
          />
        </div>
      );
    }
  }  
}

export default observer(App);
