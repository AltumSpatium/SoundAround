import React, { Component } from 'react';
import { Icon } from 'antd';
import moment from 'moment';
import TrackPiece from '../shared/TrackPiece';
import { createPicture } from '../../util/trackUtil';
import { defaultPlaylistPicture } from '../../constants/playlist';

class ChatMessage extends Component {
    render() {
        const { msg, currentUser, addTrack, addPlaylist } = this.props;
        if (!msg) return null;

        const formatDate = date => {
            let formattedDate;
            const currentDate = moment();
            date = moment(date)

            if (currentDate.date() === date.date()) {
                const addZero = val => val < 10 ? `0${val}` : val;
                formattedDate = `${addZero(date.hours())}:${addZero(date.minutes())}`;
            } else formattedDate = date.format('DD.MM.YYYY');
            return formattedDate;
        };

        const MessageContainer = props => {
            const { content, currentUser, user, date } = props;

            return (
                <div className={`msg ${currentUser.username === user ? 'msg-active' : ''}`}>
                    <div className="msg-info">
                        <span>{user}</span><span>{formatDate(date)}</span>
                    </div>
                    {content}
                </div>
            );
        };

        const checkAddedTrack = track => {
            return currentUser.tracks.includes(track._id);
        };

        const checkAddedPlaylist = playlist => {
            return currentUser.playlists.includes(playlist._id);
        };

        const { user, content: { contentType, data }, date } = msg;
        let message;
        switch (contentType) {
            case 'track':
                message = (
                    <MessageContainer
                        content={
                            <div className="msg-tp-wrapper">
                                <TrackPiece track={data} />
                                <span className='msg-add-attachment-tp' onClick={() => addTrack(data)}>
                                    {checkAddedTrack(data) ? <Icon type='check' /> : <Icon type='plus' />}
                                </span>
                            </div>
                        } currentUser={currentUser} user={user} date={date} />
                );
                break;
            case 'playlist':
                if (!this.playlistPicture)
                    this.playlistPicture = createPicture(data.playlistPicture, defaultPlaylistPicture);
                message = (
                    <MessageContainer
                        content={
                            <div className="msg-pl-wrapper">
                                <div className='create-playlist-select-option'>
                                    {this.playlistPicture}
                                    <span>{data.title}</span>
                                    <span className='msg-add-attachment-pl' onClick={() => addPlaylist(data)}>
                                        {checkAddedPlaylist(data) ? <Icon type='check' /> : <Icon type='plus' />}
                                    </span>
                                </div>
                            </div>
                        } currentUser={currentUser} user={user} date={date} />
                );
                break;
            case 'text':
            default:
                message = (
                    <MessageContainer
                        content={
                            <div className="msg-text">{data}</div>
                        } currentUser={currentUser} user={user} date={date} />
                );
                break;
        }

        return message;
    }
}

export default ChatMessage;
