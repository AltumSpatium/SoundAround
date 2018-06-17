import React, { Component } from 'react';
import { Spin } from 'antd';
import TrackPiece from '../shared/TrackPiece';

class Tracklist extends Component {
    render() {
        const { playlist, tracks, playingTrackIndex } = this.props;

        return (
            <div className="tracklist">
                Playlist: <span>{playlist.title}</span>
                <div>
                    {playlist.tracks.length && !tracks.length && (
                        <div className="tracklist__loading-tracks"><Spin /></div>
                    )}
                    {tracks.map((track, index) => (
                        <div
                            className={`croom__now-playing-wrap ${index === playingTrackIndex ? 'tracklist-np' : ''}`}
                            key={index}>
                            <TrackPiece track={track} />
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

export default Tracklist;
