import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, Button, Icon } from 'antd';
import { createPicture } from '../../util/trackUtil';
import * as QueueMusic from 'react-icons/lib/md/queue-music';

class Playlist extends Component {
    constructor(props) {
        super(props);

        if (!this.playlistPicture) {
            const defaultPlaylistIcon = (
                <div className="default-playlist-icon"><QueueMusic /></div>
            );
            this.playlistPicture = createPicture(props.playlist.playlistPicture, defaultPlaylistIcon);
        }
    }

    render() {
        const { playlist, onOpenClick, onDeleteClick, onEditClick } = this.props;

        return (
            <div className="playlist-card">
                <Card
                    cover={this.playlistPicture}>
                    <div className='playlist-card__playlist-title'>{playlist.title}</div>
                </Card>
                <div className="blackout"></div>
                <Button className='sa-btn' onClick={onOpenClick}>Open</Button>
                <button className='sa-btn' onClick={onEditClick}><Icon type='edit' /></button>
                <button className='sa-btn' onClick={onDeleteClick}><Icon type='delete' /></button>
            </div>
        );
    }
}

Playlist.propTypes = {
    playlist: PropTypes.object.isRequired
};

export default Playlist;
