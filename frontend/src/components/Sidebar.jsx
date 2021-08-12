import React from 'react'
import sidebarLinks from './sidebarlinks';
import { Link } from 'react-router-dom';
import "../index.css";
import logo from "../images/logo.png"
export default function Sidebar() {
    return (
        <div className="m-sidebar">
           <img src={logo} alt="Company logo" className="sidebar-logo" />
              {
                  sidebarLinks.map((link)=>(
                     <Link to={`/dashboard${link.path}`}  key={link.id}>
                           <div className="sidebar-links" >
                          <ul>
                          <li>{link.icon}</li>
                          <li className="sidebar-label">{link.label}</li>
                          </ul>
                      </div>
                     </Link>
                  ))
              }
            
        </div>
    )
}
