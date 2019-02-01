import React from 'react'
import Button from '../Button/Button'
import classes from './UsersList.css'

const Users = props =>{
    return(
        <div>
            Users online: {props.Count}
            <div className={classes.UsersList}>                                
                {props.Users.map((user) =>{
                        if(user.id === parseInt(localStorage.getItem('userId'))){
                            return(<div key = {user.id} > <b>{user.name}</b> </div>);
                        } else {
                            return(
                                <div key = {user.id} > 
                                    {user.name} 
                                    {user.ready ? <Button type='success' id={user.id} onClick={props.onClick}>Играть</Button> : null}
                                </div>);
                        }
                    })
                }
            </div>
        </div> 
    ) 
}

export default Users;