import React from 'react'
import './Rate.css'

const Rate = props => (
    <div className="Rate">
        <p>Сделайте ставку, <br/><strong id="user">{props.name}</strong></p>
        <div className="bet">
          <label>Банк:</label>
          <p>{props.cash}</p>
        </div>
        <div className="cash">
          <label>Ставка:</label>
          <p>{props.bet}</p>
        </div>        
    </div>
)

export default Rate