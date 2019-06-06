import React from 'react'
import './Dibs.css'
import Dib from './Dib/Dib'

const Dibs = props =>(
   
    <ul className="Dibs">
        {
            props.dibs.map((dib, index)=>{
                return(
                    <Dib 
                        key={index}
                        dib={dib}
                        onDibCLick={props.onDibCLick}                        
                    />
                )
            })
        }        
    </ul>
)

export default Dibs