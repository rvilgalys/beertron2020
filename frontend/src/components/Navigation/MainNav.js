import React from "react";
import { NavLink } from "react-router-dom";

import "./MainNav.css";

const mainNav = props => (
  <header className="main-nav-header">
    <div>
      <h1>BEERTRON2020</h1>
    </div>
    <nav className="main-nav-list">
      <ul>
        <li>
          <NavLink to="/auth">User</NavLink>
        </li>
        <li>
          <NavLink to="/beerDB">Database</NavLink>
        </li>
        <li>
          <NavLink to="/drafts">Drafts</NavLink>
        </li>
      </ul>
    </nav>
  </header>
);

export default mainNav;
