import React from 'react'
import classes from './Card.css'

const Card = props => {
    const img = `../../images/cards/${props.card.suit}/${props.card.name}.jpg`;
    return(
        <img src={require(`../../images/cards/${props.card.suit}/${props.card.name}.jpg`)} alt="Card" className={classes.Card} />
    )
}

export default Card