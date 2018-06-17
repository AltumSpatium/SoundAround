import React, { Component } from 'react';
import { Button } from 'antd';
import Chat from './Chat';

class RoomMain extends Component {
    render() {
        const { room, onExitClick, sendMessage } = this.props;
        const messages = room.messages || [];

        return (
            <div className="room-main">
                <div className="croom-header">
                    <span>{room.name}</span><Button onClick={onExitClick}>Exit</Button>
                    <div style={{clear: 'both'}}></div>
                </div>
                <Chat sendMessage={sendMessage} messages={messages} />
            </div>
        );
    }
}

export default RoomMain;
