import React, { Component } from 'react';
import { Icon } from 'antd';
import PropTypes from 'prop-types';

class Room extends Component {
    render() {
        const { room, onDeleteClick, isRoomAuthor, onRoomClick, isActive } = this.props;

        return (
            <div className={`room-card ${isActive ? 'room-card-active' : ''}`} onClick={onRoomClick}>
                <div className="room-name">{room.name} {!room.public && <Icon type='lock' />}</div>
                <div className="room-users">
                    Users online: {room.usersOnline.length}
                </div>
                {isRoomAuthor && (
                    <span onClick={onDeleteClick} className="room-card-delete">
                        <Icon type='delete' />
                    </span>
                )}
            </div>
        );
    }
}

Room.propTypes = {
    room: PropTypes.object.isRequired,
    isRoomAuthor: PropTypes.bool.isRequired,
    isActive: PropTypes.bool.isRequired,
    onRoomClick: PropTypes.func.isRequired,
    onDeleteClick: PropTypes.func.isRequired
};

export default Room;
