import React, { Component } from 'react';
import {Router, Route} from 'react-router-dom'
import {history} from './store/history'
import Auth from './containers/Auth/Auth'
import Registration from './containers/Registration/Registration'
import Profile from './containers/Profile/Profile'
import PlayTable from './containers/PlayTable/PlayTable'

class App extends Component {
  render() {
      return (
        <Router history={history}>
          <div>
            <Route path="/registration" component={Registration} />
            <Route path="/profile" component={Profile} />
            <Route path="/play" component={PlayTable} />
            <Route path="/" exact component={Auth} />
          </div>
        </Router>
      );    
  }
}

export default App;
