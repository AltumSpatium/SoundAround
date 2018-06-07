import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Input } from 'antd';
import MdMusicNote from 'react-icons/lib/md/music-note';
import MdAccessTime from 'react-icons/lib/md/access-time';
import ImageUploader from '../shared/ImageUploader';
import { beautifyDuration } from '../../util/trackUtil';

const PlaylistHeader = props => {
    const {
        pageHeader, tracksCount, totalDuration, onImageUpload,
        onTitleChange, onCancelClick, onSaveClick, title,
        playlistPicture, saving
    } = props;

    const beautifiedTotalDuration = beautifyDuration(totalDuration);

    return (
        <header className="playlist-page__playlist-header row">
            <h3>{pageHeader}</h3>
            <div className="playlist-page__playlist-header__image-container col-sm-2">
                <ImageUploader
                    name='playlistPicture' alt='Playlist picture'
                    listType='picture-card' className='playlist-picture-upload'
                    uploaderText='Upload' image={playlistPicture}
                    onImageUpload={onImageUpload} />
            </div>
            <div className="playlist-page__playlist-header__title-container col-md-9">
                <div className="playlist-page__playlist-title">
                    <Input
                        addonBefore='Playlist title' onChange={onTitleChange} value={title}
                        name='title' />
                </div>
                <div className="playlist-page__playlist-info">
                    {
                        <span title={`Tracks count: ${tracksCount}`}>
                            <MdMusicNote /> {tracksCount}
                        </span>
                    }
                    {
                        <span title={`Total duration: ${beautifiedTotalDuration} min.`}>
                            <MdAccessTime /> {beautifiedTotalDuration}
                        </span>
                    }
                </div>
                <div className="playlist-page__controls">
                    <Button className='sa-btn sa-btn-error' onClick={onCancelClick}>Cancel</Button>
                    <Button className='sa-btn sa-btn-success' loading={saving} onClick={onSaveClick}>
                        Save
                    </Button>
                </div>
            </div>
        </header>
    );
};

PlaylistHeader.propTypes = {
    pageHeader: PropTypes.string.isRequired,
    tracksCount: PropTypes.number.isRequired,
    totalDuration: PropTypes.number.isRequired,
    title: PropTypes.string.isRequired,
    saving: PropTypes.bool,
    playlistPicture: PropTypes.object,
    onTitleChange: PropTypes.func.isRequired,
    onCancelClick: PropTypes.func.isRequired,
    onSaveClick: PropTypes.func.isRequired,
    onImageUpload: PropTypes.func
};

export default PlaylistHeader;
