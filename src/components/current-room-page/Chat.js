import React, { Component } from 'react';
import ChatMessage from './ChatMessage';
import { connect } from 'react-redux';
import { Input, Icon, Popover, Modal, Select } from 'antd';
import { createPicture } from '../../util/trackUtil';
import { defaultPlaylistPicture } from '../../constants/playlist';

class Chat extends Component {
    constructor(props) {
        super(props);

        this.state = {
            messageText: '',

            attachModal: false,
            attachModalContent: null,
            attachModalTitle: '',

            attachVisible: false,

            attachType: '',
            attachValue: null
        };

        this.onChange = this.onChange.bind(this);
        this.onSendClick = this.onSendClick.bind(this);
        this.toggleAttach = this.toggleAttach.bind(this);
        this.setModalContent = this.setModalContent.bind(this);
        this.openAttachModal = this.openAttachModal.bind(this);
        this.cancelAttach = this.cancelAttach.bind(this);
        this.attach = this.attach.bind(this);
        this.onChangeAttach = this.onChangeAttach.bind(this);
    }

    hideModal = (modalName, cb, timeout=0) => {
        const hide = () => this.setState({ [modalName]: false }, cb ? cb : () => {});
        if (timeout > 0) {
            setTimeout(() => {
                hide();
            }, timeout);
        } else hide();
    }
    showModal = (modalName, cb) => this.setState({ [modalName]: true }, cb ? cb : () => {})

    onChangeAttach({ target: { name, value } }) {
        this.setState({ attachType: name, attachValue: value });
    }

    onChange(e) {
        const { target: { name, value } } = e;
        this.setState({ [name]: value });
    }

    onSendClick() {
        const { messageText } = this.state;
        if (!messageText) return;
        
        const message = {
            content: { contentType: 'text', data: messageText },
            date: new Date()
        };
        this.props.sendMessage(message);
        this.setState({ messageText: '' });
    }

    toggleAttach() {
        const { attachVisible } = this.state;
        this.setState({ attachVisible: !attachVisible });
    }

    setModalContent(attachType) {
        const createOptions = (arr, createContent) => arr.map(item => (
            <Select.Option key={item._id} value={item._id}>
                <div className='create-playlist-select-option'>
                    {createContent(item)}
                </div>
            </Select.Option>
        ));
        let content;
        let createContent;
        switch (attachType) {
            case 'track':
                createContent = track => (
                    <div className='track-select-content'>
                        <span>{track.artist}</span> - <span>{track.title}</span>
                    </div>
                );
                content = value => {
                    const { tracks } = this.props;
                    return (
                        <div className="manage-room__playlist">
                            <Select
                                name='track' value={value}
                                onChange={value => this.onChangeAttach({ target: { name: 'track', value } })}>
                                {createOptions(tracks, createContent)}
                            </Select>
                        </div>
                    );
                };
                break;
            case 'playlist':
                createContent = playlist => (
                    <div className='playlist-select-content'>
                        {createPicture(playlist.playlistPicture, defaultPlaylistPicture)}
                        <span>{playlist.title}</span>
                    </div>
                );
                content = value => {
                    const { playlists } = this.props;
                    return (
                        <div className="manage-room__playlist">
                            <Select
                                    name='playlist' value={value}
                                onChange={value => this.onChangeAttach({ target: { name: 'playlist', value } })}>
                                {createOptions(playlists, createContent)}
                            </Select>
                        </div>
                    );
                };
                break;
        }
        this.setState({ attachModalContent: content });
    }

    openAttachModal(attachType) {
        let attachModalTitle;
        switch (attachType) {
            case 'track':
                attachModalTitle = 'Attach track';
                break;
            case 'playlist':
                attachModalTitle = 'Attach playlist';
                break;
        }
        this.setState({ attachModalTitle });

        this.setModalContent(attachType);
        this.showModal('attachModal');
    }

    cancelAttach() {
        this.hideModal('attachModal', this.setState({ attachType: '', attachValue: null }));
    }

    attach() {
        const { attachType, attachValue } = this.state;
        let data;
        switch (attachType) {
            case 'playlist':
                const playlist = this.props.playlists.filter(p => p._id === attachValue)[0]
                data = {
                    _id: playlist._id,
                    authorId: playlist.authorId,
                    title: playlist.title
                };
                break;
            case 'track':
            default:
                const track = this.props.tracks.filter(t => t._id === attachValue)[0];
                data = {
                    _id: track._id,
                    trackId: track.trackId,
                    duration: track.duration,
                    title: track.title,
                    artist: track.artist,
                    album: track.album,
                };
                break;
        }
        const message = {
            content: { contentType: attachType, data },
            date: new Date()
        };
        this.props.sendMessage(message);
        this.hideModal('attachModal');
        this.setState({ attachType: '', attachValue: null });
    }

    render() {
        const { room: { messages }, currentUser, addTrack, addPlaylist } = this.props;
        const {
            messageText, attachVisible, attachModal, attachValue,
            attachModalContent, attachModalTitle
        } = this.state;
        const reversedMessages = messages ? messages.slice().reverse() : [];

        return (
            <div>
                <div className="chat-window">
                    {reversedMessages.map((msg, index) => (
                        <ChatMessage
                            key={index} msg={msg} currentUser={currentUser}
                            addTrack={addTrack} addPlaylist={addPlaylist} />
                    ))}
                </div>
                <div className="chat-input">
                    <Popover
                        content={
                            <div className='chat-input__attachment'>
                                <div onClick={() => this.openAttachModal('track')}>Attach track</div>
                                <div onClick={() => this.openAttachModal('playlist')}>Attach playlist</div>
                            </div>
                        } trigger='click' overlayClassName='chat-input__attachment-overlay'
                        visible={attachVisible} onVisibleChange={attachVisible => this.setState({ attachVisible })}>
                        <div
                            className='chat__attach-btn'>
                            <Icon type='plus' />
                        </div>
                    </Popover>
                    <Input
                        value={messageText} onChange={this.onChange} name='messageText'
                        onPressEnter={this.onSendClick} />
                    
                    <button onClick={this.onSendClick}>Send</button>
                </div>

                <Modal
                    visible={attachModal}
                    title={attachModalTitle}
                    onCancel={this.cancelAttach}
                    onOk={this.attach}>
                    {attachModalContent && attachModalContent(attachValue)}
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    currentUser: state.user.currentUser,
    playlists: state.playlist.playlists,
    tracks: state.music.tracks,
    room: state.room.room
});

export default connect(mapStateToProps)(Chat);
