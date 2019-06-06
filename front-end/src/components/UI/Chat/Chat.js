import React, {Component} from 'react'
import './Chat.css'
import {connect} from 'react-redux'

import {onMessage} from '../../../store/actions/playTable'

class Chat extends Component{
    state ={
        message: ''
    }

    componentDidMount(){
        var chat = document.getElementById('chat');
        chat.classList.add("hideChat");
    }

    handleChange = (e) =>{
        this.setState({ message: e.target.value });
    }
  
    keyPress = async (e) =>{
        if(e.key === 'Enter' && this.state.message !== '' && this.state.message.match(/^ *$/) === null){
            this.props.onSend(this.state.message);
            await this.props.onMessage({userName: this.props.UserName, message: this.state.message});
            this.setState({
                message: ''
            });
            scrollDown();
        }
    }

    showChat = () =>{
        var chat = document.getElementById('chat');
        chat.classList.replace("hideChat", "showChat");
    }

    hideChat = (e) =>{
        e.target.value = '';
        var chat = document.getElementById('chat');        
        chat.classList.replace("showChat", "hideChat");
        scrollDown();
    }

    render(){
        return(
            <div id='chat' className="Chat"> 
                <div id='messages' className="Message">
                    {this.props.Messages.map((message, id) =>{
                        return(
                            <p key={id}>{message.userName === this.props.UserName ? <b>{message.userName}:</b> : <span>{message.userName}:</span>} {message.message}</p>
                        )
                    })}
                </div>                
                <input placeholder='Your message...' onFocus={this.showChat} onBlur={this.hideChat} value={this.state.message} onKeyPress={this.keyPress} onChange={this.handleChange}></input>
            </div>
        )
    }
}

export function scrollDown(){
    var el = document.getElementById('messages');
    el.scrollTop = el.scrollHeight;
}

function mapDispatchToProps(dispatch){
    return{
        onMessage: (message) => dispatch(onMessage(message))
    }
}

export default connect(null, mapDispatchToProps)(Chat)