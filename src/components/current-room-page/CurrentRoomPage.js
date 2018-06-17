import React, { Component } from 'react';
import { connect } from 'react-redux';
import openSocket from 'socket.io-client';
import { Spin } from 'antd';
import { Link } from 'react-router-dom';
import RoomAside from './RoomAside';
import RoomMain from './RoomMain';
import {
    getRoom, clearRooms, getRoomPlaylist, enterRoom,
    exitRoom, receiveMessage
} from '../../actions/room';
import {
    getPlaylist, clearPlaylist
} from '../../actions/playlist';
import { showMessage } from '../../util/toastrUtil';

import '../../styles/CurrentRoomPage.css';

class CurrentRoomPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            userEntered: false,
            messages: []
        };

        this.roomId = props.location.pathname.split('/')[2];

        this.enterRoom = this.enterRoom.bind(this);
        this.exitRoom = this.exitRoom.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
    }

    componentWillUnmount() {
        this.props.clearPlaylist();
        this.props.clearRooms();
    }

    componentDidMount() {
        const { getRoom } = this.props;
        getRoom(this.roomId);

        this.io = openSocket();
        this.io.on('enterRoom', ({ username, roomId }) => this.props.enterRoom(username, roomId));
        this.io.on('exitRoom', ({ username, roomId }) => {
            const { currentUser } = this.props;
            if (username !== currentUser.username) this.props.exitRoom(username, roomId);
        });
        this.io.on('message', message => this.props.receiveMessage(message));
        this.io.on('deleteRoom', () => {
            showMessage('The room was deleted!', null, 'warning');
            this.props.history.push('/rooms');
        });
    }

    exitRoom() {
        const { room, currentUser } = this.props;
        this.io.emit('exitRoom', { roomId: room._id, username: currentUser.username });
        this.props.history.push('/rooms');
    }

    enterRoom() {
        const { room, currentUser } = this.props;
        if (room && currentUser) {
            this.io.emit('enterRoom', { roomId: room._id, username: currentUser.username });
            this.setState({ userEntered: true });
        }
    }

    sendMessage(message) {
        const { room, currentUser } = this.props;
        this.io.emit('message', { roomId: room._id, username: currentUser.username, message });
        this.props.receiveMessage({ user: currentUser.username, ...message });
    }

    componentWillReceiveProps(nextProps) {
        const { userEntered } = this.state;

        if (!this.props.room && nextProps.room) {
            const room = nextProps.room;
            this.props.getPlaylist(room.currentPlaylist);
        }

        if (!this.props.roomPlaylist && nextProps.roomPlaylist) {
            const playlist = nextProps.roomPlaylist;
            const { room, currentUser } = this.props;
            this.props.getRoomPlaylist(room._id, playlist._id, currentUser._id);
        }

        if (!userEntered) this.enterRoom();
    }

    render() {
        const {
            room, enteringRoom, roomPlaylist, loadingPlaylist,
            playlistTracks
        } = this.props;
        if (!room) {
            if (enteringRoom) {
                return (
                    <div className='croom-page__entering-room'>
                        <span>Entering room...</span><br />
                        <Spin size='default' />
                    </div>
                );
            } else {
                return (
                    <div className='playlist-page__not-found'>
                        <span>Room not found</span><br/>
                        <Link to='/rooms'>To rooms page</Link>
                    </div>
                );
            }
        }

        return (
            <div className="current-room-page">
                <RoomMain
                    room={room} onExitClick={this.exitRoom} sendMessage={this.sendMessage} />
                <RoomAside
                    playlist={roomPlaylist} loading={loadingPlaylist} room={room}
                    playlistTracks={playlistTracks} />
            </div>
        );
    }
}

const mapStateToProps = state => ({
    currentUser: state.user.currentUser,
    room: state.room.room,
    enteringRoom: state.room.enteringRoom,
    roomPlaylist: state.playlist.playlist,
    loadingPlaylist: state.playlist.loadingPlaylist,
    playlistTracks: state.room.roomPlaylistTracks,
    playlistTracksLoading: state.room.loadingRoomPlaylistTracks
});

const mapDispatchToProps = dispatch => ({
    getRoom: roomId => dispatch(getRoom(roomId)),
    clearRooms: () => dispatch(clearRooms()),
    getPlaylist: playlistId => dispatch(getPlaylist(playlistId)),
    clearPlaylist: () => dispatch(clearPlaylist()),
    getRoomPlaylist: (roomId, playlistId, userId) => dispatch(getRoomPlaylist(roomId, playlistId, userId)),
    enterRoom: (username, roomId) => dispatch(enterRoom(username, roomId)),
    exitRoom: (username, roomId) => dispatch(exitRoom(username, roomId)),
    receiveMessage: message => dispatch(receiveMessage(message))
});

export default connect(mapStateToProps, mapDispatchToProps)(CurrentRoomPage);
