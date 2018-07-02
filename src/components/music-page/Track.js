import React, { Component } from 'react';
import { List, Icon } from 'antd';
import { connect } from 'react-redux';
import {
    setVisibility, setPlayerPlaylist, clearPlayerPlaylist
} from '../../actions/player';
import { beautifyDuration, createPicture } from '../../util/trackUtil';

class Track extends Component {
    constructor(props) {
        super(props);

        this.state = {
            lyricsVisible: false
        };

        this.albumCover = createPicture(props.track.picture);

        this.toggleLyrics = this.toggleLyrics.bind(this);
        this.playTrack = this.playTrack.bind(this);
    }

    toggleLyrics() {
        const lyricsVisible = !this.state.lyricsVisible;
        this.setState({ lyricsVisible });
    }

    playTrack() {
        const {
            track, setPlayerPlaylist, setVisibility,
            clearPlayerPlaylist, tracks
        } = this.props;
        clearPlayerPlaylist();

        const playlistTracks = tracks.map(t => t._id);
        const startIndex = playlistTracks.indexOf(track._id);

        setVisibility(true);
        const playlist = { id: 'tracks', tracks: playlistTracks, startIndex };
        setPlayerPlaylist(playlist);
    }

    render() {
        const { track, nowPlaying } = this.props;
        const { lyricsVisible } = this.state;

        const onEditClick = e => {
            e.stopPropagation();
            this.props.onEditClick();
        };

        const onDeleteClick = e => {
            e.stopPropagation();
            this.props.onDeleteClick();
        };

        return (
            <div>
                <List.Item key={track._id}>
                    <div
                        className={`track-item ${nowPlaying === track._id ? 'track-np' : ''}`}
                        onClick={this.playTrack}>
                        <div className="track-item__picture">
                            {this.albumCover}
                        </div>
                        <div className="track-item__info">
                            <div className='track-item__info-title'>
                                <span>{track.title}</span>
                            </div>
                            <div className='track-item__info-album'>
                                <span>{track.album}</span>
                            </div>
                            <div className='track-item__info-artist'>
                                <span>{track.artist}</span>
                            </div>
                            <div className='track-item__info-duration'>
                                <span>{beautifyDuration(track.duration)}</span>
                            </div>
                        </div>
                        <div className="track-item__controls">
                            {!!track.lyrics && (
                                <button onClick={this.toggleLyrics}><Icon type='form' /></button>    
                            )}
                            <button onClick={onEditClick}><Icon type='edit' /></button>
                            <button onClick={onDeleteClick}><Icon type='delete' /></button>
                        </div>
                    </div>
                </List.Item>
                {lyricsVisible && (
                    <div className="track-lyrics">
                        <pre>
                            {track.lyrics}
                        </pre>
                    </div>
                )}
            </div>
        );
    }
}

const mapStateToProps = state => ({
    nowPlaying: state.player.nowPlaying,
    tracks: state.music.tracks
});

const mapDispatchToProps = dispatch => ({
    setVisibility: visible => dispatch(setVisibility(visible)),
    setPlayerPlaylist: playlist => dispatch(setPlayerPlaylist(playlist)),
    clearPlayerPlaylist: () => dispatch(clearPlayerPlaylist())
});

export default connect(mapStateToProps, mapDispatchToProps)(Track);
