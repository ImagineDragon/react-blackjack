import React, {Component} from 'react'
import classes from './Auth.css'
import Input from '../../components/UI/Input/Input'
import Button from '../../components/UI/Button/Button'
import {NavLink, Redirect} from 'react-router-dom'
import is from 'is_js'
import axios from 'axios';

class Auth extends Component{
	
	state = {
		isLogin: false,
		isFormValid: false,
		formControls:{
			email:{
				value: '',
				type: 'email',
				label: 'Email',
				errorMessage: 'Введите корректный email',
				valid: false,
				touched: false,
				validation:{
					required: true,
					email: true
				}
			},
			password: {
				value: '',
				type: 'password',
				label: 'Пароль',
				errorMessage: 'Введите корректный пароль',
				valid: false,
				touched: false,
				validation:{
					required: true,
					minLength: 6
				}
			}
		}
	}

	componentDidMount(){
		const userId = localStorage.getItem('userId');
		if(userId != null){
			this.setState({
				isLogin: true
			});
		}
	}

	loginHandler = async () =>{
		const dataAuth = await {
			email: this.state.formControls.email.value,
			password: this.state.formControls.password.value
		};
		
		const respons = await axios.post('http://localhost:3001/',dataAuth);
		if(respons.data){
			localStorage.setItem('userId', respons.data);
			this.setState({
				isLogin: true
			});
		}else{
			alert('Неверный email или пароль');
		}
	}

	

	submitHandler = event =>{
		event.preventDefault();
	}

	validateControl(value, validation){
		if(!validation){
			return true
		}

		let isValid = true;

		if(validation.required){
			isValid = value.trim() !== '' && isValid
		}

		if(validation.email){
			isValid = is.email(value) && isValid
		}

		if(validation.minLength){
			isValid = value.length >= validation.minLength && isValid 
		}

		return isValid
	}

	onChangeHandler = (event, controlName)=>{
		const formControls = {...this.state.formControls}
		const control = {...formControls[controlName]}

		control.value = event.target.value
		control.touched = true
		control.valid = this.validateControl(control.value, control.validation)

		formControls[controlName] = control

		let isFormValid = true;

		Object.keys(formControls).forEach(name=>{
			isFormValid = formControls[name].valid && isFormValid
		})

		this.setState({
			formControls, isFormValid
		})
	}

	renderInputs(){
		return Object.keys(this.state.formControls).map((controlName, index)=>{
			const control = this.state.formControls[controlName]
			return(
				<Input 
					key={controlName+index}
					type={control.type}
					value={control.value}
					valid={control.valid}
					touched={control.touched}
					label={control.label}
					shouldValidate={!!control.validation}
					errorMessage={control.errorMessage}
					onChange={event=>this.onChangeHandler(event, controlName)}
				/>
			)
		})
	}

	
	render(){
		if(this.state.isLogin){
			return (<Redirect to='/profile' path/>);
		}else{
			return(
				<div className={classes.Auth} >
					<div>
						<form onSubmit={this.submitHandler} className={classes.AuthForm}>
							{this.renderInputs()}
							<hr />
							<span id="LogIn"><Button 
								type="success" 
								onClick={this.loginHandler}
								disabled={!this.state.isFormValid}
							>Войти</Button></span>
							<NavLink to='/registration'>
								<Button 
									type="primary" 								
								>Зарегистрироваться</Button>
							</NavLink>
						</form>
					</div>
				</div>
			)
		}
		
	}
}

export default Auth