import React, { Component } from 'react';
import { Button } from 'antd';
import * as MdSettings from 'react-icons/lib/md/settings';

import Chat from './Chat';

class RoomMain extends Component {
    render() {
        const {
            room, onExitClick, sendMessage, isAdmin, onSettingClick,
            addTrack, addPlaylist
        } = this.props;

        return (
            <div className="room-main">
                <div className="croom-header">
                    <span>{room.name}</span>
                    {isAdmin() && (
                        <span onClick={onSettingClick} className='croom-header__settings' title='Manage room'>
                            <MdSettings />
                        </span>
                    )}
                    <Button onClick={onExitClick}>Exit</Button>
                    <div style={{clear: 'both'}}></div>
                </div>
                <Chat sendMessage={sendMessage} addPlaylist={addPlaylist} addTrack={addTrack} />
            </div>
        );
    }
}

export default RoomMain;
