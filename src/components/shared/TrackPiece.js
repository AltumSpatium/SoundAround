import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createPicture, beautifyDuration } from '../../util/trackUtil';

class TrackPiece extends Component {
    constructor(props) {
        super(props);

        if (!this.albumCover) {
            this.albumCover = createPicture(props.track.picture);
        }
    }

    render() {
        const { track } = this.props;

        return (
            <div className="track-piece">
                <div className="track-piece__picture">
                    {this.albumCover}
                </div>
                <div className="track-piece__info">
                    <div className='track-piece__info-title'>
                        <span>{track.title}</span>
                    </div>
                    <div className='track-piece__info-album'>
                        <span>{track.album}</span>
                    </div>
                    <div className='track-piece__info-artist'>
                        <span>{track.artist}</span>
                    </div>
                    <div className='track-piece__info-duration'>
                        <span>{beautifyDuration(track.duration)}</span>
                    </div>
                </div>
            </div>
        );
    }
}

TrackPiece.propTypes = {
    track: PropTypes.object.isRequired
};

export default TrackPiece;
