import React, {Component} from 'react'
import classes from './Chat.css'

class Chat extends Component{
    state ={
        message: ''
    }

    componentDidMount(){
        var chat = document.getElementById('chat');
        chat.classList.add(classes.hideChat);
    }

    handleChange = (e) =>{
        this.setState({ message: e.target.value });
    }
  
    keyPress = (e) =>{
        if(e.key === 'Enter' && this.state.message !== '' && this.state.message.match(/^ *$/) === null){
            this.props.onSend(this.state.message);
            this.setState({
                message: ''
            });
            setTimeout(() => {
                scrollDown();
            }, 1);
        }
    }

    showChat = () =>{
        var chat = document.getElementById('chat');
        chat.classList.replace(classes.hideChat, classes.showChat);
    }

    hideChat = (e) =>{
        e.target.value = '';
        var chat = document.getElementById('chat');        
        chat.classList.replace(classes.showChat, classes.hideChat);
        scrollDown();
    }

    render(){
        return(
            <div id='chat' className={classes.Chat}> 
                <div id='messages' className={classes.Message}>
                    {this.props.Messages.map((message, id) =>{
                        return(
                            <p key={id}>{message.userName == this.props.UserName ? <b>{message.userName}:</b> : <span>{message.userName}:</span>} {message.message}</p>
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

export default Chat