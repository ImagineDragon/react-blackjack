import React from 'react'
import './PlayButton.css'

const PlayButton = props =>(
    <div className="BetButton">
        {props.isBet && props.enemyId !== -1 ?
            <div>
                <button className="btn"
                    disabled={props.disabledFold}
                    onClick={()=> props.onFold()}
                >Fold</button>
                <button className="btn"
                    disabled={props.disabledCheck}
                    onClick={()=>props.onCheck()}
                >Check</button>
                <button className="btn"
                    disabled={props.disabledRaise}
                    onClick={()=>props.onRaise()}
                >Raise</button> 
            </div> : 
            <div>
                {props.enemyId === -1 ?
                <button className="btn"
                    disabled={props.disabledPlay}
                    onClick={()=> props.onPlay()}
                >Play</button> : null}
                <button className="btn"
                    disabled={props.enemyId === -1 ? props.disabledEnough : !props.enableBet}
                    onClick={()=>props.onEnough()}
                >Enough</button>
                <button className="btn"
                    disabled={props.enemyId === -1 ? props.disabledMore : !props.enableBet}
                    onClick={()=>props.onMore()}
                >More</button>
            </div>
        }
    </div>
)

export default PlayButton