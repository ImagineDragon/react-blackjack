import React from 'react'
import classes from './PlayButton.css'

const PlayButton = props =>(
    <div className={classes.PlayButton}>
		{props.onPlay != null ?
			<button className={classes.btn}
				disabled={props.disabledPlay}
				onClick={()=> props.onPlay()}
			>Play</button> : null
		}
		<button className={classes.btn}
			disabled={props.disabledEnough}
			onClick={()=>props.onEnough()}
		>Enough</button>
		<button className={classes.btn}
			disabled={props.disabledMore}
			onClick={()=>props.onMore()}
		>More</button>          
    </div>
)

export default PlayButton