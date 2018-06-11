import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, Button, Icon } from 'antd';
import { createPicture } from '../../util/trackUtil';
import { defaultPlaylistPicture } from '../../constants/playlist';

class Playlist extends Component {
    constructor(props) {
        super(props);

        if (!this.playlistPicture) {
            this.playlistPicture = createPicture(props.playlist.playlistPicture, defaultPlaylistPicture);
        }
    }

    render() {
        const { playlist, onOpenClick, onDeleteClick, onEditClick, userId } = this.props;

        return (
            <div className="playlist-card">
                <Card
                    cover={this.playlistPicture}>
                    <div className='playlist-card__playlist-title'>{playlist.title}</div>
                </Card>
                <div className="blackout"></div>
                <Button className='sa-btn' onClick={onOpenClick}>Open</Button>
                {playlist.authorId === userId && (
                    <button className='sa-btn' onClick={onEditClick}><Icon type='edit' /></button>
                )}
                <button className='sa-btn' onClick={onDeleteClick}><Icon type='delete' /></button>
            </div>
        );
    }
}

Playlist.propTypes = {
    playlist: PropTypes.object.isRequired
};

export default Playlist;
