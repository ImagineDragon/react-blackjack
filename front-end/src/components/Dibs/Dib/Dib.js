import React from 'react'
import './Dib.css'

const Dib = props =>{
    const cls = ["Dib"]
    let classView = props.dib.classView
    switch(classView){
        case 'blue':
            cls.push("blue")
            break;
        case 'yellow':
            cls.push("yellow")
            break;
        default:
            cls.push("red")
    }
    return(
        <li className={cls.join(' ')}
            id={props.dib.id}
            onClick={()=>props.onDibCLick(props.dib.value)}
        >
            {props.dib.value}
        </li>
    )
}

export default Dib