import React from 'react'
import './Button.css'

const Button = props =>{
    const cls = [
        "Button",
        props.type
    ]
    return(
        <button
           id={props.id}
           onClick={props.onClick}
           className={cls.join(' ')}
           disabled={props.disabled} 
        >
            {props.children}
        </button>
    )
}

export default Button