import React, {Component} from 'react'
import classes from './Profile.css'
import {NavLink, Redirect} from 'react-router-dom'
import Button from '../../components/UI/Button/Button'
import axios from 'axios';

class Profile extends Component{
    state = {
        isLogout: false,
        bet: '',
        name: '',
        email: ''
    }

    isLogout = () => {
        localStorage.removeItem('userId');
        this.setState({
            isLogout: true
        });
    }

    componentDidMount(){
        const userId = localStorage.getItem('userId');
        this.getDataUser(userId);

    }

    getDataUser = async (userId)=>{
        const data = {
            userId: userId  
        }
        const respons = await axios.post('http://localhost:3001/profile', data);
        if(respons.data){
            this.setState({
                isLogout: false,
                bet: respons.data.bet,
                name: respons.data.name,
                email: respons.data.email
            })
        } else this.setState({isLogout: true});
    }


    render(){
        if(this.state.isLogout){
            return (<Redirect to='/' />)
        }else{
            return(
                <div className={classes.Profile}>
                    <div>
                        <h1>{this.state.name}</h1>
                        <hr />
                        <p>
                            <b>Почта: </b><em>{this.state.email}</em><br />
                            <b>Счет: </b><em>{this.state.bet}</em><br />
                        </p>
                        <hr />
                        <div className={classes.Buttons}>
                            <NavLink to="/play">
                                <Button 
                                    type="success" 
                                >Играть</Button>
                            </NavLink>                        
                            <Button 
                                type="error"
                                onClick={this.isLogout} 
                            >Выход</Button>
                        </div>                    
                    </div>               
                </div>
            )   
        }
             
    }
}

export default Profile