import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Input } from 'antd';

class EditModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            artist: '',
            title: '',
            lyrics: '',
            album: '',

            lyricsVisible: false
        };

        this.onChange = this.onChange.bind(this);
        this.toggleLyrics = this.toggleLyrics.bind(this);
        this.onCancelEdit = this.onCancelEdit.bind(this);
        this.onConfirmEdit = this.onConfirmEdit.bind(this);
    }

    onChange(e) {
        const target = e.target;
        const { name, value } = target;
        this.setState({ [name]: value });
    }

    toggleLyrics() {
        const lyricsVisible = !this.state.lyricsVisible;
        this.setState({ lyricsVisible });
    }

    onCancelEdit() {
        this.props.onCancelEdit();
        this.setState({ lyricsVisible: false });
    }

    onConfirmEdit() {
        const { artist, title, lyrics, album } = this.state;
        const { track } = this.props;
        const needUpdate = track.artist !== artist || track.title !== title
            || track.lyrics !== lyrics || track.album !== album;
        this.props.onConfirmEdit({
            artist, title, lyrics, album, trackId: track._id, needUpdate
        });
        this.setState({ lyricsVisible: false });
    }

    componentWillReceiveProps(nextProps) {
        const { artist, title, lyrics, album } = nextProps.track || {};
        this.setState({ artist, title, lyrics, album });
    }

    render() {
        const { isVisible } = this.props;
        const { artist, title, lyrics, album, lyricsVisible } = this.state;

        return (
            <Modal
                title='Edit track'
                visible={isVisible}
                onCancel={this.onCancelEdit}
                onOk={this.onConfirmEdit}
                footer={[
                    <div className='music-page__modal-btns' key='footer'>
                        <Button onClick={this.onCancelEdit}>Cancel</Button>
                        <Button className='sa-btn' onClick={this.onConfirmEdit}>
                            Confirm
                        </Button>
                    </div>
                ]}>
                <div className="music-page__edit-fields">
                    <Input addonBefore='Artist' name='artist' value={artist} onChange={this.onChange} />
                    <Input addonBefore='Album' name='album' value={album} onChange={this.onChange} />
                    <Input addonBefore='Title' name='title' value={title} onChange={this.onChange} />
                    {lyricsVisible ?
                        <div>
                            <div className='toggle-lyrics-btn' onClick={this.toggleLyrics}>Hide lyrics</div>
                            <Input.TextArea
                                name='lyrics' onChange={this.onChange}
                                defaultValue={lyrics} rows={8} autosize={false} />
                        </div>
                        : <div className='toggle-lyrics-btn' onClick={this.toggleLyrics}>Show lyrics</div>
                    }
                </div>
            </Modal>
        );
    }
}

EditModal.propTypes = {
    track: PropTypes.object,
    isVisible: PropTypes.bool.isRequired,
    onCancelEdit: PropTypes.func.isRequired,
    onConfirmEdit: PropTypes.func.isRequired
};

export default EditModal;
