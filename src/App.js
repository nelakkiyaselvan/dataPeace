import React, { Component } from 'react';
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom'
import Home from "./Home"
import UserDetail from "./UserDetail"
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: {},
      startFrom: 0,
      endFrom: 5
    }
  }
  setUserData = (data, startFrom, endFrom) => {
    console.log("data gdv", data)
    this.setState({userData: data, startFrom: startFrom, endFrom: endFrom});
  }
 
  render() {

    return (
      <Router>
        <Switch>
          <Route key="Home" exact={true} path="/" render={(props) => <Home {...props} setUserData={this.setUserData} startFrom={this.state.startFrom} endFrom={this.state.endFrom}/>} />
          <Route key="UserDetail" path="/user/:id" render={(props) => <UserDetail {...props} userData={this.state.userData}/>} />
        </Switch>
      </Router>
    );
  }
}
export default App;
