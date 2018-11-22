import React from 'react'
import classes from './Input.css'

function isInvalid({valid, touched, shouldValidate}){
	return !valid && shouldValidate && touched
}

const Input = props =>{

	const inputType = props.type || 'text'
	const cls = [classes.Input]
	const htmlForm = `${inputType}-${Math.random()}`

	if(isInvalid(props)){
		cls.push(classes.invalid)
	}

	return(
		<div className={cls.join(' ')}>
			<label htmlform={htmlForm}>{props.label}</label>
			<input 
				type={inputType}
				id={htmlForm}
				value={props.value}
				onChange={props.onChange}
			/>
			{
				isInvalid(props)
				? <span>{props.errorMessage || 'Введите верное значение'}</span>
				: null
			}
		</div>
	)
}

export default Input