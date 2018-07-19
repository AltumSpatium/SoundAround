import React, { Component } from 'react';
import { connect } from 'react-redux';
import openSocket from 'socket.io-client';
import { Spin } from 'antd';
import { Link } from 'react-router-dom';
import RoomAside from './RoomAside';
import RoomMain from './RoomMain';
import ManageRoomModal from './ManageRoomModal';
import {
    getRoom, clearRooms, getRoomPlaylist, enterRoom,
    exitRoom, receiveMessage, kickUser, updateRoom,
    setRoomNowPlaying
} from '../../actions/room';
import {
    getPlaylist, clearPlaylist, getPlaylists, addPlaylist
} from '../../actions/playlist';
import {
    setVisibility, setPlayerPlaylist, clearPlayerPlaylist,
    sendCommand
} from '../../actions/player';
import { clearMusicList, getMusicPage, addTrack } from '../../actions/music';
import { showMessage } from '../../util/toastrUtil';
import { Howl, Howler } from 'howler';

import '../../styles/CurrentRoomPage.css';

class CurrentRoomPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            userEntered: false,
            messages: [],

            manageModal: false
        };

        this.roomId = props.location.pathname.split('/')[2];

        this.enterRoom = this.enterRoom.bind(this);
        this.exitRoom = this.exitRoom.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.kickUser = this.kickUser.bind(this);
        this.updateRoom = this.updateRoom.bind(this);
        this.addPlaylist = this.addPlaylist.bind(this);
        this.addTrack = this.addTrack.bind(this);
        this.playTrack = this.playTrack.bind(this);
    }

    hideModal = (modalName, cb, timeout=0) => {
        const hide = () => this.setState({ [modalName]: false }, cb ? cb : () => {});
        if (timeout > 0) {
            setTimeout(() => {
                hide();
            }, timeout);
        } else hide();
    }
    showModal = (modalName, cb) => this.setState({ [modalName]: true }, cb ? cb : () => {})

    isAdmin = () => {
        const { currentUser, room } = this.props;
        if (!currentUser || !room) return false;
        return currentUser._id === room.authorId;
    }

    componentWillUnmount() {
        this.props.clearPlaylist();
        this.props.clearMusicList();
        this.props.clearRooms();
        this.io.close();
    }

    addTrack(track) {
        const { currentUser } = this.props;
        this.io.emit('addTrack', { username: currentUser.username, trackId: track._id });
    }

    addPlaylist(playlist) {
        const { currentUser } = this.props;
        this.io.emit('addPlaylist', { username: currentUser.username, playlistId: playlist._id });
    }

    componentDidMount() {
        if (!this.props.location.state || this.props.location.state && !this.props.location.state.allowed) return;
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
        this.io.on('kickUser', username => {
            this.props.kickUser(username);
            if (this.props.currentUser.username === username) {
                showMessage('You have been kicked from the room!', null, 'warning');
                this.props.history.push('/rooms');
            }
        });
        this.io.on('updateRoom', updatedRoom => this.props.updateRoom(updatedRoom));
        this.io.on('addTrack', trackId => this.props.addTrack(trackId));
        this.io.on('addPlaylist', playlistId => this.props.addPlaylist(playlistId));
        this.io.on('playTrack', ({ trackId, startIndex }) => {
            const {
                setPlayerPlaylist, setVisibility, setRoomNowPlaying,
                clearPlayerPlaylist, playlistTracks, roomPlaylist,
                sendCommand
            } = this.props;
            clearPlayerPlaylist();
    
            const tracks = playlistTracks.map(t => t._id);
            
            // setVisibility(true);
            const playlist = { id: roomPlaylist._id, tracks, startIndex };
            // setPlayerPlaylist(playlist);
            // sendCommand({
            //     type: 'play',
            //     data: { startIndex, startTrackId: tracks[startIndex] }
            // });
            // setRoomNowPlaying(trackId);
        });        
    }

    exitRoom() {
        const { room, currentUser } = this.props;
        this.io.emit('exitRoom', { roomId: room._id, username: currentUser.username });
        this.props.history.push('/rooms');
    }

    enterRoom() {
        const { currentUser } = this.props;
        if (currentUser) {
            this.io.emit('enterRoom', { roomId: this.roomId, username: currentUser.username });
            this.setState({ userEntered: true });
        }
    }

    sendMessage(message) {
        const { currentUser } = this.props;
        this.io.emit('message', { roomId: this.roomId, username: currentUser.username, message });
        this.props.receiveMessage({ user: currentUser.username, ...message });
    }

    kickUser(username) {
        this.io.emit('kickUser', { roomId: this.roomId, username });
    }

    updateRoom(changedField, changedValue) {
        if (!changedField) return;

        this.io.emit('updateRoom', { roomId: this.roomId, field: changedField, value: changedValue });
    }

    componentWillReceiveProps(nextProps) {
        const { userEntered } = this.state;

        if (!this.props.room && nextProps.room) {
            const { room, currentUser } = nextProps;
            this.props.getPlaylist(room.currentPlaylist);
            this.props.getPlaylists(currentUser.username);
            this.props.getTracks(currentUser.username);
        }

        if (this.props.room && nextProps.room && this.props.room.currentPlaylist !== nextProps.room.currentPlaylist) {
            this.props.clearPlaylist();
            this.props.clearMusicList();
            const { room, currentUser } = nextProps;
            this.props.getPlaylist(room.currentPlaylist);
            this.props.getPlaylists(currentUser.username);
            this.props.getTracks(currentUser.username);
        }

        if (!this.props.roomPlaylist && nextProps.roomPlaylist) {
            const playlist = nextProps.roomPlaylist;
            const { room, currentUser } = this.props;
            this.props.getRoomPlaylist(room._id, playlist._id, currentUser._id);
        }

        if (!userEntered) this.enterRoom();
    }

    playTrack(track) {
        if (!this.isAdmin()) return;

        const {
            setPlayerPlaylist, setVisibility, setRoomNowPlaying,
            clearPlayerPlaylist, playlistTracks, roomPlaylist
        } = this.props;
        clearPlayerPlaylist();

        const tracks = playlistTracks.map(t => t._id);
        const startIndex = tracks.indexOf(track._id);
        
        setVisibility(true);
        const playlist = { id: roomPlaylist._id, tracks, startIndex };
        setPlayerPlaylist(playlist);
        setRoomNowPlaying(track._id);
        this.io.emit('playTrack', { roomId: this.roomId, trackId: track._id, startIndex });
    }

    render() {
        if (!this.props.location.state || this.props.location.state && !this.props.location.state.allowed) {
            return (
                <div>Access denied</div>
            );
        }

        const { manageModal } = this.state;
        const {
            room, enteringRoom, roomPlaylist, loadingPlaylist,
            playlistTracks, currentUser, playlists, nowPlaying
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
                    room={room} onExitClick={this.exitRoom} sendMessage={this.sendMessage}
                    isAdmin={this.isAdmin} onSettingClick={() => this.showModal('manageModal')}
                    addTrack={this.addTrack} addPlaylist={this.addPlaylist} />
                <RoomAside
                    playlist={roomPlaylist} loading={loadingPlaylist}
                    playlistTracks={playlistTracks} isAdmin={this.isAdmin}
                    kickUser={this.kickUser} currentUser={currentUser}
                    playTrack={this.playTrack} nowPlaying={nowPlaying} />

                <ManageRoomModal
                    isVisible={manageModal} onCloseClick={() => this.hideModal('manageModal')}
                    room={room} playlists={playlists} updateRoom={this.updateRoom} />
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
    playlists: state.playlist.playlists,
    playlistTracks: state.room.roomPlaylistTracks,
    playlistTracksLoading: state.room.loadingRoomPlaylistTracks,
    nowPlaying: state.player.nowPlaying
});

const mapDispatchToProps = dispatch => ({
    getRoom: roomId => dispatch(getRoom(roomId)),
    clearRooms: () => dispatch(clearRooms()),
    getPlaylist: playlistId => dispatch(getPlaylist(playlistId)),
    getPlaylists: username => dispatch(getPlaylists(username)),
    clearPlaylist: () => dispatch(clearPlaylist()),
    getRoomPlaylist: (roomId, playlistId, userId) => dispatch(getRoomPlaylist(roomId, playlistId, userId)),
    enterRoom: (username, roomId) => dispatch(enterRoom(username, roomId)),
    exitRoom: (username, roomId) => dispatch(exitRoom(username, roomId)),
    receiveMessage: message => dispatch(receiveMessage(message)),
    kickUser: username => dispatch(kickUser(username)),
    updateRoom: updatedRoom => dispatch(updateRoom(updatedRoom)),
    clearMusicList: () => dispatch(clearMusicList()),
    getTracks: username => dispatch(getMusicPage(username)),
    addTrack: trackId => dispatch(addTrack(trackId)),
    addPlaylist: playlistId => dispatch(addPlaylist(playlistId)),
    setVisibility: visible => dispatch(setVisibility(visible)),
    setPlayerPlaylist: playlist => dispatch(setPlayerPlaylist(playlist)),
    clearPlayerPlaylist: () => dispatch(clearPlayerPlaylist()),
    setRoomNowPlaying: trackId => dispatch(setRoomNowPlaying(trackId)),
    sendCommand: command => dispatch(sendCommand(command))
});

export default connect(mapStateToProps, mapDispatchToProps)(CurrentRoomPage);
