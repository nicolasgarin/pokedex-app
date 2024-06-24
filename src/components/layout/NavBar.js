import React, { Component } from "react"
import styled from "styled-components";
import logo from "../layout/logo.png"

export default class NavBar extends Component {
    render() {
        return (
            <div>
                <nav className="navbar navbar-expand-md navbar-dark bg-dark fixed-top justify-content-between">
                    <a className="navbar-brand ms-5" href="#">
                        <img src={logo} width="auto" height="40em" alt=""></img>
                    </a>
                    <div className="me-5" style={{
                        color: "white",
                        fontWeight: "bold",
                    }}>
                        Developed by Nicolás Garín
                    </div>
                </nav>
            </div>
        )
    }
}

