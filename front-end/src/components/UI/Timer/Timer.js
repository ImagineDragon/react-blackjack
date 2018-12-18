import React from 'react'
import classes from './Timer.css'

const Timer = props =>{
    if(props.timer){
        return(
            <div className={classes.Timer}>
                Time to bet {props.time}
            </div>
        )
    } else {
        return(null)
    }
}

export default Timer