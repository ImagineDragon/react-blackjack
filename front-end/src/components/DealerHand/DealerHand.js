import React from 'react'
import classes from './DealerHand.css'
import Card from '../Card/Card'

const DealerHand = props =>(
    <div className={classes.DealerHand}>
        {
            props.dealerHandSum === 0 ? null : <p>{props.dealerHandSum}</p>
        }
        {
            props.dealerHand.map((card, index)=>{
                return(
                    <Card 
                        key={index}
                        card={card}
                    />
                )
            })
        }
    </div>
)

export default DealerHand