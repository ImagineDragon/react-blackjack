import React from 'react'
import classes from './Dib.css'

const Dib = props =>{
    const cls = [classes.Dib]
    let classView = props.dib.classView
    switch(classView){
        case 'blue':
            cls.push(classes.blue)
            break;
        case 'yellow':
            cls.push(classes.yellow)
            break;
        default:
            cls.push(classes.red)
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