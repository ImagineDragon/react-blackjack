import React from 'react'
import classes from './CardFace.css'

const CardFace = props => {
    const img = `../../images/cards/face.png`;
    return(
        <img src={require(`../../images/cards/face.png`)} alt="Card" className={classes.Card} />
    )
}

export default CardFace