import React from 'react'
import classes from './Timer.css'

const Timer = props =>{
    if(props.time > 0){
        return(
            <div className={classes.Timer}>
                {props.enableBet ? <span>Time to bet </span> : <span>Enemy time </span>}
                {props.time}
            </div>
        )
    } else {
        return(null)
    }
}

export default Timer