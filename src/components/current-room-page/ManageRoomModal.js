import React, { Component } from 'react';
import { Button, Modal, Input, Select, Checkbox } from 'antd';
import { createPicture } from '../../util/trackUtil';
import { defaultPlaylistPicture } from '../../constants/playlist';

class ManageRoomModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            changeModal: false,
            changeModalContent: null,
            changeModalTitle: '',

            changedField: '',
            changedValue: null
        };

        this.setModalContent = this.setModalContent.bind(this);
        this.openChangeModal = this.openChangeModal.bind(this);
        this.cancelChange = this.cancelChange.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onOkClick = this.onOkClick.bind(this);
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

    onChange({ target: { name, value } }) {
        this.setState({ changedField: name, changedValue: value });
    }

    setModalContent(contentType) {
        let content;
        switch (contentType) {
            case 'name':
                content = value => (
                    <div className="manage-room__name">
                        <Input
                            value={value} onChange={this.onChange}
                            name='name' />
                    </div>
                );
                break;
            case 'description':
                content = value => (
                    <div className="manage-room__description">
                        <Input.TextArea
                            value={value} onChange={this.onChange}
                            name='description' />
                    </div>
                );
                break;
            case 'playlist':
                const createOptions = playlists => playlists.map(playlist => (
                    <Select.Option key={playlist._id} value={playlist._id}>
                        <div className='create-playlist-select-option'>
                            {createPicture(playlist.playlistPicture, defaultPlaylistPicture)}
                            <span>{playlist.title}</span>
                        </div>
                    </Select.Option>
                ));
                content = value => {
                    const { playlists } = this.props;

                    return (
                        <div className="manage-room__playlist">
                            <Select
                                name='roomPlaylist' value={value}
                                onChange={value => this.onChange({ target: { name: 'roomPlaylist', value } })}>
                                {createOptions(playlists)}
                            </Select>
                        </div>
                    );
                };
                break;
            case 'privacy':
                content = value => {
                    const { isPrivate, password } = value;
                    return (
                        <div className="manage-room__privacy">
                            <Checkbox
                                name='isPrivate' checked={isPrivate}
                                onChange={e => this.onChange({
                                    target: { name: 'privacy', value: { isPrivate: e.target.checked, password } }
                                })}>
                                Private
                            </Checkbox>
                            {isPrivate && (
                                <div className="create-room-password">
                                    <Input
                                        name='privacy' onChange={e => this.onChange({
                                            target: { name: e.target.name, value: { isPrivate, password: e.target.value } }
                                        })}
                                        value={password} addonBefore='Password' />
                                </div>
                            )}
                        </div>
                    );
                };
                break;
        }

        this.setState({ changeModalContent: content });
    }

    onOkClick() {
        const { changedField, changedValue } = this.state;
        this.props.updateRoom(changedField, changedValue);
        this.hideModal('changeModal');
    }

    openChangeModal(contentType) {
        const { room } = this.props;
        let changedValue;
        let changeModalTitle;

        switch (contentType) {
            case 'name':
                changedValue = room.name;
                changeModalTitle = 'Change room name';
                break;
            case 'description':
                changedValue = room.description;
                changeModalTitle = 'Change room description';
                break;
            case 'playlist':
                changedValue = room.currentPlaylist;
                changeModalTitle = 'Change room playlist';
                break;
            case 'privacy':
                changedValue = { isPrivate: !room.public, password: room.password };
                changeModalTitle = 'Change room privacy';
                break;
        }
        this.setState({ changedValue, changeModalTitle });

        this.setModalContent(contentType);
        this.showModal('changeModal');
    }

    cancelChange() {
        this.hideModal('changeModal', this.setState({ changeModalContent: null, changedField: '', changedValue: null }));
    }

    render() {
        const {
            changeModal, changeModalContent, changedValue,
            changeModalTitle
        } = this.state;
        const {
            isVisible, onCloseClick, room, updateRoom
        } = this.props;
        if (!room) return null;

        return (
            <Modal
                wrapClassName='manage-room-modal'
                title={'Manage room'}
                style={{ top: 20 }}
                width={400}
                onCancel={onCloseClick}
                visible={isVisible}
                footer={null}>
                <div className="manage-room-modal__main">
                    <Button onClick={() => this.openChangeModal('name')}>Change name</Button>
                    <Button onClick={() => this.openChangeModal('description')}>Change description</Button>
                    <Button onClick={() => this.openChangeModal('playlist')}>Change playlist</Button>
                    <Button onClick={() => this.openChangeModal('privacy')}>Change privacy</Button>
                    <Button onClick={() => updateRoom('messages', [])}>Clear message history</Button>
                </div>

                <Modal
                    visible={changeModal}
                    title={changeModalTitle}
                    onCancel={this.cancelChange}
                    onOk={this.onOkClick}>
                    {changeModalContent && changeModalContent(changedValue)}
                </Modal>
            </Modal>
        );
    }
}

export default ManageRoomModal;
