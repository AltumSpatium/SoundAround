import React, { Component } from 'react';
import { Spin } from 'antd';
import TrackPiece from '../shared/TrackPiece';
import Tracklist from './Tracklist';
import * as FaBan from 'react-icons/lib/fa/ban';

class RoomAside extends Component {
    render() {
        const {
            playlist, loading, room, playlistTracks, isAdmin, kickUser,
            currentUser
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
                    <Tracklist playlist={playlist} tracks={playlistTracks} playingTrackIndex={trackIndex} />
                )}
                <div className="users-online">
                    <div>Users online:</div>
                    {room.usersOnline.map(username => (
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

export default RoomAside;
