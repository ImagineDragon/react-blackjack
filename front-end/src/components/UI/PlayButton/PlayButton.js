import React from 'react'
import classes from './PlayButton.css'

const PlayButton = props =>(
    <div className={classes.BetButton}>
        {props.isBet && props.enemyId !== -1 ?
            <div>
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
            </div> : 
            <div>
                {props.enemyId === -1 ?
                <button className={classes.btn}
                    disabled={props.disabledPlay}
                    onClick={()=> props.onPlay()}
                >Play</button> : null}
                <button className={classes.btn}
                    disabled={props.enemyId === -1 ? props.disabledEnough : !props.enableBet}
                    onClick={()=>props.onEnough()}
                >Enough</button>
                <button className={classes.btn}
                    disabled={props.enemyId === -1 ? props.disabledMore : !props.enableBet}
                    onClick={()=>props.onMore()}
                >More</button>
            </div>
        }
    </div>
)

export default PlayButton