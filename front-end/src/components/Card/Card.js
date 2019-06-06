import React from 'react'
import './Card.css'

const Card = props => {
    const img = `../../images/cards/${props.card.suit}/${props.card.name}.jpg`;
    return(
        <img src={require(`../../images/cards/${props.card.suit}/${props.card.name}.jpg`)} alt="Card" className="Card" />
    )
}

export default Card