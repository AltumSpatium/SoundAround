import React, { Component } from 'react';
import { List, Icon } from 'antd';
import { beautifyDuration, createPicture } from '../../util/trackUtil';

class Track extends Component {
    constructor(props) {
        super(props);

        this.state = {
            lyricsVisible: false
        };

        this.albumCover = createPicture(props.track.picture);

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

export default Track;
