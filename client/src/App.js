import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Client from './components/client';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">React Employee App</h1>
        </header>
        <Client />
      </div>
    );
  }
}

export default App;
