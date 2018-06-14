import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getPlaylists, clearPlaylist } from '../../actions/playlist';
import { createRoom } from '../../actions/room';
import { createPicture } from '../../util/trackUtil';
import { showMessage } from '../../util/toastrUtil';
import { Modal, Button, Input, Select, Checkbox } from 'antd';
import { defaultPlaylistPicture } from '../../constants/playlist';

class CreateRoomModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: '',
            description: '',
            roomPlaylist: null,
            isPrivate: false,
            password: ''
        };

        this.onChange = this.onChange.bind(this);
        this.onClickCreate = this.onClickCreate.bind(this);
        this.onCancelCreate = this.onCancelCreate.bind(this);
        this.loadPlaylists = this.loadPlaylists.bind(this);
        this.clearModal = this.clearModal.bind(this);
        this.highlightError = this.highlightError.bind(this);
    }

    onChange(e) {
        const target = e.target;
        const { name, value } = target;
        this.setState({ [name]: value });
    }

    onCancelCreate() {
        this.props.onCancelCreate();
    }

    highlightError(selector) {
        const element = document.querySelector(selector);
        element.classList.add('has-error');
        setTimeout(() => element.classList.remove('has-error'), 500);
    }

    onClickCreate() {
        const { name, description, isPrivate, password, roomPlaylist } = this.state;
        if (!name) {
            showMessage('Enter room name!', null, 'error');
            this.highlightError('.create-room-name');
            return;
        }

        if (isPrivate && !password) {
            showMessage('You must specify a password for private room!', null, 'error');
            this.highlightError('.create-room-password');
            return;
        }
        
        const { currentUser, createRoom } = this.props;
        const roomData = {
            name, description, password,
            public: !isPrivate,
            currentPlaylist: roomPlaylist,
            nowPlaying: '5b212cb259f04c11c8e9fdce'
        };

        createRoom(currentUser.username, roomData)
            .then(error => {
                if (!error) this.props.onClickCreate();
        });
    }

    componentWillReceiveProps(nextProps) {
        if (!this.props.isVisible && nextProps.isVisible) {
            this.loadPlaylists();
        }
    }

    loadPlaylists() {
        const { currentUser, getPlaylists } = this.props;
        if (!currentUser) return;
        getPlaylists(currentUser.username);
    }

    clearModal() {
        this.props.clearPlaylist();
        this.setState({ name: '', description: '', roomPlaylist: null });
    }

    render() {
        const { isVisible, playlists, creatingRoom } = this.props;
        const { name, description, roomPlaylist, isPrivate, password } = this.state;

        const createOptions = playlists => playlists.map(playlist => (
            <Select.Option key={playlist._id} value={playlist._id}>
                <div className='create-playlist-select-option'>
                    {createPicture(playlist.playlistPicture, defaultPlaylistPicture)}
                    <span>{playlist.title}</span>
                </div>
            </Select.Option>
        ));

        return (
            <Modal
                style={{top: '20px'}}
                title='Create room'
                visible={isVisible}
                afterClose={this.clearModal}
                onCancel={this.onCancelCreate}
                onOk={this.onClickCreate}
                footer={[
                    <div className='music-page__modal-btns' key='footer'>
                        <Button className='sa-btn sa-btn-error' onClick={this.onCancelCreate}>Cancel</Button>
                        <Button
                            className='sa-btn sa-btn-success' loading={creatingRoom}
                            onClick={this.onClickCreate}>
                            Create
                        </Button>
                    </div>
                ]}>
                <div className="music-page__edit-fields">
                    <div className="create-room-name">
                        <Input addonBefore='Name' name='name' value={name} onChange={this.onChange} />
                    </div>
                    <div className="create-room-description">
                        <span>Description:</span>
                        <Input.TextArea
                            name='description' onChange={this.onChange}
                            value={description} rows={8} autosize={false} />
                    </div>
                    <Select
                        name='roomPlaylist' value={roomPlaylist}
                        onChange={value => this.onChange({ target: { name: 'roomPlaylist', value } })}>
                        {createOptions(playlists)}
                    </Select>
                    <Checkbox
                        name='isPrivate' value={isPrivate}
                        onChange={e => this.onChange({ target: { name: 'isPrivate', value: e.target.checked } })}>
                        Private
                    </Checkbox>
                    {isPrivate && (
                        <div className="create-room-password">
                            <Input
                                name='password' onChange={this.onChange}
                                value={password} addonBefore='Password' />
                        </div>
                    )}
                </div>
            </Modal>
        );
    }
}

CreateRoomModal.propTypes = {
    isVisible: PropTypes.bool.isRequired,
    onCancelCreate: PropTypes.func.isRequired,
    onClickCreate: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    currentUser: state.user.currentUser,
    playlists: state.playlist.playlists,
    creatingRoom: state.room.creatingRoom
});

const mapDispatchToProps = dispatch => ({
    getPlaylists: username => dispatch(getPlaylists(username)),
    clearPlaylist: () => dispatch(clearPlaylist()),
    createRoom: (username, roomData) => dispatch(createRoom(username, roomData))
});

export default connect(mapStateToProps, mapDispatchToProps)(CreateRoomModal);
