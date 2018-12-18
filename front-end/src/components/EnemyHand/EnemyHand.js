import React from 'react'
import classes from './EnemyHand.css'
import CardFace from '../CardFace/CardFace';

const EnemyHand = props =>{
    var cards = [];
    for (let i = 0; i < props.enemyHand; i++) {
        cards.push(<CardFace key={i}/>);   
    }
    return(
        <div className={classes.EnemyHand}>
            {
                cards
            }
        </div>
    )
}

export default EnemyHand