import React, { Component } from 'react';
import ChatMessage from './ChatMessage';
import { Input, Icon } from 'antd';

class Chat extends Component {
    constructor(props) {
        super(props);

        this.state = {
            messageText: ''
        };

        this.onChange = this.onChange.bind(this);
        this.onSendClick = this.onSendClick.bind(this);
    }

    onChange(e) {
        const { target: { name, value } } = e;
        this.setState({ [name]: value });
    }

    onSendClick() {
        const { messageText } = this.state;
        const message = {
            text: messageText,
            date: new Date()
        };
        this.props.sendMessage(message);
        this.setState({ messageText: '' });
    }

    render() {
        const { messages } = this.props;
        const { messageText } = this.state;
        const reversedMessages = messages.slice().reverse();

        return (
            <div>
                <div className="chat-window">
                    {reversedMessages.map(msg => (
                        <ChatMessage msg={msg} />
                    ))}
                </div>
                <div className="chat-input">
                    <div className='chat__attach-btn'><Icon type='plus' /></div>
                    <Input
                        value={messageText} onChange={this.onChange} name='messageText'
                        onPressEnter={this.onSendClick} />
                    <button onClick={this.onSendClick}>Send</button>
                </div>
            </div>
        );
    }
}

export default Chat;
