import React from 'react'
import classes from './DibsBet.css'

const DibsBet = props =>(   
    <div>
        {
            props.userDibsBet.map((bet, index)=>{
                switch(bet){
                    case 200: 
                        return(
                            <div key={index} className={classes.dib + ' ' + classes.user_dib_200}>
                                {bet}
                            </div>
                        )
                    case 100: 
                        return(
                            <div key={index} className={classes.dib + ' ' + classes.user_dib_100}>
                                {bet}
                            </div>
                        )
                    case 50: 
                        return(
                            <div key={index} className={classes.dib + ' ' + classes.user_dib_50}>
                                {bet}
                            </div>
                        )
                    case 25: 
                        return(
                            <div key={index} className={classes.dib + ' ' + classes.user_dib_25}>
                                {bet}
                            </div>
                        )
                    case 5: 
                        return(
                            <div key={index} className={classes.dib + ' ' + classes.user_dib_5}>
                                {bet}
                            </div>
                        )
                    default: 
                        return(
                            <div key={index} className={classes.dib + ' ' + classes.user_dib_1}>
                                {bet}
                            </div>
                        )
                }
            })
        }
        {
            props.enemyDibsBet.map((bet, index)=>{
                switch(bet){
                    case 200: 
                        return(
                            <div key={index} className={classes.dib + ' ' + classes.enemy_dib_200}>
                                {bet}
                            </div>
                        )
                    case 100: 
                        return(
                            <div key={index} className={classes.dib + ' ' + classes.enemy_dib_100}>
                                {bet}
                            </div>
                        )
                    case 50: 
                        return(
                            <div key={index} className={classes.dib + ' ' + classes.enemy_dib_50}>
                                {bet}
                            </div>
                        )
                    case 25: 
                        return(
                            <div key={index} className={classes.dib + ' ' + classes.enemy_dib_25}>
                                {bet}
                            </div>
                        )
                    case 5: 
                        return(
                            <div key={index} className={classes.dib + ' ' + classes.enemy_dib_5}>
                                {bet}
                            </div>
                        )
                    default: 
                        return(
                            <div key={index} className={classes.dib + ' ' + classes.enemy_dib_1}>
                                {bet}
                            </div>
                        )
                }
            })
        }
    </div>
)

export default DibsBet