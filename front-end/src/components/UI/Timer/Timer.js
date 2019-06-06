import React from 'react'
import './Timer.css'

const Timer = props =>{
    if(props.time > 0){
        return(
            <div className="Timer">
                {props.enableBet ? <span>Time to bet </span> : <span>Enemy time </span>}
                {props.time}
            </div>
        )
    } else {
        return(null)
    }
}

export default Timer