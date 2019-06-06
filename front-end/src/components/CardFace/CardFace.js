import React from 'react'
import './CardFace.css'

const CardFace = props => {
    const img = `../../images/cards/face.png`;
    return(
        <img src={require(`../../images/cards/face.png`)} alt="Card" className="Card" />
    )
}

export default CardFace