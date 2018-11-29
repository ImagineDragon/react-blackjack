import React, { Component } from 'react';
import {Route, Switch} from 'react-router-dom'
import Auth from './containers/Auth/Auth'
import Registration from './containers/Registration/Registration'
import Profile from './containers/Profile/Profile'
import PlayTable from './containers/PlayTable/PlayTable'

class App extends Component {
  // state = {
  //   userId: ''
  // } 

  // componentDidMount (){
  //   const userId = localStorage.getItem('userId');
  //   this.setState({
  //     userId
  //   })
  // }
  render() {
   
    // if(this.state.userId){
      return (
        <Switch>          
          <Route path="/registration" component={Registration} />
          <Route path="/profile" component={Profile} />
          <Route path="/play" component={PlayTable} />
          <Route path="/" exact component={Auth} />
        </Switch>
      ); 
    // }else{
    //   return (
    //     <Switch>
    //       <Route path="/registration" component={Registration} /> 
    //       <Route path="/" exact component={Auth} />
          
    //       <Redirect to="/" />         
    //     </Switch>
    //   ); 
    // }
    
  }
}

export default App;
