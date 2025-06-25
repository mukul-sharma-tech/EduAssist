import React, { Component } from "react";
import Video from "./Video";
import Home from "./Home";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

class App extends Component {
  render() {
    // Global Home button style
    const homeButtonStyle = {
      position: "fixed",
      top: 16,
      left: 16,
      zIndex: 10000,
      background: "#fff",
      border: "1px solid #1976d2",
      borderRadius: 8,
      boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
      padding: "6px 18px",
      color: "#1976d2",
      fontWeight: "bold",
      fontSize: 18,
      cursor: "pointer",
      transition: "background 0.2s",
    };
    return (
      <div>
        <button
          style={homeButtonStyle}
          onClick={() => {
            window.location.href = "https://edu-assist-alpha.vercel.app/";
          }}
        >
          Home
        </button>
        <Router>
          <Switch>
            <Route path="/" exact component={Home} />
            <Route path="/:url" component={Video} />
          </Switch>
        </Router>
      </div>
    );
  }
}

export default App;
