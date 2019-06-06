import React from 'react'
import './Enemy.css'

const Rate = props => (
    <div className="EnemyRate">
        <p>Противник, <br/><strong id="user">{props.name}</strong></p>
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