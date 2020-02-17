import React, {useState} from "react";
import CheeseburgerMenu from 'cheeseburger-menu'
import HamburgerMenu from 'react-hamburger-menu'
import { userStore } from "../index";
import { Fab } from '@material-ui/core';
import { Link } from "react-router-dom";
import { observer } from "mobx-react";

const ProductivityMenu = (props) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const openMenu = () => {
      setMenuOpen(true);
    }
  
    const closeMenu = () => {
      setMenuOpen(false);
    }

    
    const handleLogOut = (e: any) => {
        setMenuOpen(false);
        userStore.setUser(undefined);
        userStore.setAuthenticated(false);
        localStorage.removeItem("jwtToken");
    };

    return(
        <div>
            <CheeseburgerMenu
            isOpen={menuOpen}
            closeCallback={closeMenu}>
              <div className="menu">
                <div className="menu-item" onClick={closeMenu}><Link to="/Productivity">Map</Link></div>
                <div className="menu-item" onClick={closeMenu}>
                  <Link to="/roster">Roster</Link>
                </div>
                <div className="menu-item" onClick={closeMenu}>
                  <Link to="/schedule">Schedule</Link>
                </div>
                <div className="menu-item" onClick={closeMenu}>
                  <Link to="/data">Edit Data</Link>
                </div>
                <div className="menu-item" onClick={closeMenu}>
                  <Link to="/range/edit">Edit Range</Link>
                </div>
                <div className="menu-item" onClick={closeMenu}>
                  <Link to="/profile/edit">Edit Profile</Link>
                </div>
                <div className="menu-item" onClick={closeMenu}>
                  <Link to="/roster/edit">Edit Roster</Link>
                </div>
                <div className="menu-item" onClick={closeMenu}>
                  <Link to="/">Back to main menu</Link>
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
        </div>
    )
}

export default observer(ProductivityMenu);