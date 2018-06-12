import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'antd';

class RoomInfo extends Component {
    render() {
        const { room } = this.props;
        if (!room) return null;

        return (
            <div className="room-info">
                <div className="info-header">
                    <span>{room.name}</span><Button className='sa-btn'>Enter room</Button>
                </div>
                <div className="info-main">
                    <div className="descr">{room.description}</div>
                    <div className="now-playing">
                        Now playing: <span>Crown the Empire - Aftermath</span>
                    </div>
                </div>
                <div style={{clear: 'both'}}></div>
            </div>
        );
    }
}

RoomInfo.propTypes = {
    room: PropTypes.object
};

export default RoomInfo;
