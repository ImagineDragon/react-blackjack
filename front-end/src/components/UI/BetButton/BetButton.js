import React from 'react'
import classes from './BetButton.css'

const PlayButton = props =>(
    <div className={classes.BetButton}> 
          <button className={classes.btn}
            disabled={props.disabledFold}
            onClick={()=> props.onFold()}
          >Fold</button>
          <button className={classes.btn}
            disabled={props.disabledCheck}
            onClick={()=>props.onCheck()}
          >Check</button>
          <button className={classes.btn}
            disabled={props.disabledRaise}
            onClick={()=>props.onRaise()}
          >Raise</button>
    </div>
)

export default PlayButton