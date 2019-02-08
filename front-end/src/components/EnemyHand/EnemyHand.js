import React from 'react'
import classes from './EnemyHand.css'
import CardFace from '../CardFace/CardFace';

import Card from '../Card/Card'

const EnemyHand = props =>{
    var cards = [];
    for (let i = 0; i < props.enemyCardsCount; i++) {
        cards.push(<CardFace key={i}/>);   
    }
    return(
        <div className={classes.EnemyHand}>
            {
                props.enemyHandSum === 0 ? cards : 
                <div>
                    <p>{props.enemyHandSum}</p>
                    {props.enemyHand.map((card, index)=>{
                        return(
                        <Card 
                            key={index}
                            card={card}
                        />)
                    })}
                </div>
            }
        </div>
    )
}

export default EnemyHand