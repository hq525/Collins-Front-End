import React, { useState, useEffect } from "react";
import "./App.css";
import jwtDecode from "jwt-decode";
import { BrowserRouter, Route, Link } from "react-router-dom";
import Login from "./auth/Login";
import Main from './Map/Main';
import Schedule from './Map/Schedule';
import Data from './Map/Data';
import Edit from './Map/Edit';
import CheeseburgerMenu from 'cheeseburger-menu'
import HamburgerMenu from 'react-hamburger-menu'
import { userStore } from "./index";
import { observer } from "mobx-react";
import { Fab, Snackbar } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const openMenu = () => {
    setMenuOpen(true);
  }

  const closeMenu = () => {
    setMenuOpen(false);
  }

  useEffect(() => {
    if(localStorage.jwtToken) {
      var user = jwtDecode(localStorage.jwtToken);
      userStore.setUser(user);
      userStore.setAuthenticated(true);
    }
  }, [])

  const handleLogOut = (e: any) => {
    setMenuOpen(false);
    userStore.setUser(undefined);
    userStore.setAuthenticated(false);
    localStorage.removeItem("jwtToken");
  };

  const [errorBarOpen, setErrorBarOpen] = React.useState(false);
  const [errorText, setErrorText] = React.useState('');

  const setError = (text) => {
    setErrorText(text);
    setErrorBarOpen(true);
  }

  const closeError = () => {
    setErrorBarOpen(false);
  }

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
          <CheeseburgerMenu
            isOpen={menuOpen}
            closeCallback={closeMenu}>
              <div className="menu">
                <div className="menu-item" onClick={closeMenu}><Link to="/">Map</Link></div>
                <div className="menu-item" onClick={closeMenu}>
                  <Link to="/schedule">Schedule</Link>
                </div>
                <div className="menu-item" onClick={closeMenu}>
                  <Link to="/Data">Data</Link>
                </div>
                <p style={{padding: ".5rem 15px"}}>Signed in as {userStore.getUser.username}</p>
                <Fab variant="extended" onClick={handleLogOut}>
                  Logout
                </Fab>
              </div>
          </CheeseburgerMenu>
          <div style={{position: "fixed", top: 20, left: 20, cursor: "pointer"}}>
            <HamburgerMenu
              isOpen={menuOpen}
              menuClicked={openMenu}
              x={10}
              y={10}
              width={32}
              height={24}
              strokeWidth={3}
              rotate={0}
              color='black'
              borderRadius={0}
              animationDuration={0.5}
            />
          </div>
          <Route path="/" render={() => <Main setError={setError} />} exact />
          <Route path="/schedule/:machineID" render={(props) => <Schedule {...props} setError={setError} />} exact />
          <Route path="/schedule" render={(props) => <Schedule {...props} setError={setError} />} exact />
          <Route path="/data" render={() => <Data setError={setError} />} exact />
          <Route path="/edit" render={() => <Edit setError={setError} />} exact />
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

export default observer(App);
