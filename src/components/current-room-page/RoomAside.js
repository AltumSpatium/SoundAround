import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Spin } from 'antd';
import TrackPiece from '../shared/TrackPiece';
import Tracklist from './Tracklist';
import * as FaBan from 'react-icons/lib/fa/ban';
import {
    setRoomNowPlaying
} from '../../actions/room';

class RoomAside extends Component {
    componentWillReceiveProps(nextProps) {
        if (this.props.track && !nextProps.track) {
            this.props.setRoomNowPlaying(null);
        }
    }

    render() {
        const {
            playlist, loading, room, playlistTracks, isAdmin, kickUser,
            currentUser, nowPlaying, playTrack
        } = this.props;
        const trackId = room.nowPlaying;
        let track;
        let trackIndex;
        if (playlistTracks.length && trackId && playlist.tracks.includes(trackId)) {
            track = playlistTracks.filter(track => track._id === trackId)[0];
            trackIndex = playlistTracks.indexOf(track);
        }

        return (
            <div className="room-aside">
                {playlist && track && (
                    <div className="croom__now-playing">
                        <span>Now playing:</span>
                        <div className='croom__now-playing-wrap'>
                            <TrackPiece track={track} />
                        </div>
                    </div>
                )}
                {!playlist && loading && (
                    <div>Loading playlist... <Spin size='small' /></div>
                )}
                {!playlist && !loading && (
                    <div className="tracklist__no-playlist">No playlist selected</div>
                )}
                {playlist && !loading && (
                    <Tracklist
                        playlist={playlist} tracks={playlistTracks} playingTrackIndex={trackIndex}
                        playTrack={playTrack} />
                )}
                <div className="users-online">
                    <div>Users online:</div>
                    {room.usersOnline && room.usersOnline.map(username => (
                        <div key={username}>
                            <span>{username}</span>
                            {currentUser && isAdmin() && currentUser.username !== username && (
                                <span className='users-online__btn-ban' onClick={() => kickUser(username)}><FaBan /></span>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    room: state.room.room,
    track: state.player.track
});

const mapDispatchToProps = dispatch => ({
    setRoomNowPlaying: trackId => dispatch(setRoomNowPlaying(trackId))
});

export default connect(mapStateToProps, mapDispatchToProps)(RoomAside);
