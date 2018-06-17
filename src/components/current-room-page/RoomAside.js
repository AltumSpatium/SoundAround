import React, { Component } from 'react';
import { Spin } from 'antd';
import TrackPiece from '../shared/TrackPiece';
import Tracklist from './Tracklist';

class RoomAside extends Component {
    render() {
        const { playlist, loading, room, playlistTracks } = this.props;
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
                        <div>{username}</div>
                    ))}
                </div>
            </div>
        );
    }
}

export default RoomAside;
