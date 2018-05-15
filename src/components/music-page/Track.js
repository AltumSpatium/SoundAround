import React, { Component } from 'react';
import { List, Icon } from 'antd';
import * as TiNotes from 'react-icons/lib/ti/notes';

const beautifyDuration = duration => {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration) - minutes * 60;
    return `${minutes}:${seconds}`;
};

const createAlbumCover = picture => {
    if (!picture) return <div className='default-album-cover'><TiNotes /></div>;

    const rawPicture = new Buffer(picture.data.data);
    return (
        <img src={`data:image/jpeg;base64,${rawPicture.toString('base64')}`} alt='Album cover' />
    );
};

class Track extends Component {
    constructor(props) {
        super(props);

        this.state = {
            lyricsVisible: false
        };

        this.toggleLyrics = this.toggleLyrics.bind(this);
    }

    toggleLyrics() {
        const lyricsVisible = !this.state.lyricsVisible;
        this.setState({ lyricsVisible });
    }

    render() {
        const { track, onEditClick, onDeleteClick } = this.props;
        const { lyricsVisible } = this.state;

        return (
            <div>
                <List.Item key={track._id}>
                    <div className="track-item">
                        <div className="track-item__picture">
                            {createAlbumCover(track.picture)}
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

export default Track;
