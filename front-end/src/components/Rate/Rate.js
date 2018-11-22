import React from 'react'
import classes from './Rate.css'

const Rate = props => (
    <div className={classes.Rate}>
        <p>Сделайте ставку, <br/><strong id="user">{props.name}</strong></p>
        <div className={classes.bet}>
          <label>Банк:</label>
          <p>{props.cash}</p>
        </div>
        <div className={classes.cash}>
          <label>Ставка:</label>
          <p>{props.bet}</p>
        </div>        
    </div>
)

export default Rate