import React, { Component } from 'react';

class ChatMessage extends Component {
    render() {
        const { msg } = this.props;
        if (!msg) return null;

        return (
            <div className="msg">
                <div className="msg-author">{msg.user}</div>
                <div className="msg-text">{msg.text}</div>
            </div>
        );
    }
}

export default ChatMessage;
