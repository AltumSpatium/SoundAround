import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Button } from 'antd';

const DeletePlaylistModal = props => {
    const { isVisible, onCancelDelete } = props;
    const playlist = props.playlist || {};

    const onConfirmDelete = () => {
        props.onConfirmDelete(playlist._id);
    };

    return (
        <Modal
            title='Delete playlist'
                visible={isVisible}
                onCancel={onCancelDelete}
                onOk={onConfirmDelete}
                width={400}
                footer={[
                    <div className='music-page__modal-btns' key='footer'>
                        <Button className='sa-btn sa-btn-success' onClick={onCancelDelete}>Cancel</Button>
                        <Button className='sa-btn sa-btn-error' onClick={onConfirmDelete}>Delete</Button>
                    </div>
                ]}>
                <div className='music-page__delete-warning-text'>
                    <p>Are you sure you want to delete <span>{playlist.title}</span> ?</p>
                </div>
            </Modal>
    );
}

DeletePlaylistModal.propTypes = {
    playlist: PropTypes.object,
    isVisible: PropTypes.bool.isRequired,
    onCancelDelete: PropTypes.func.isRequired,
    onConfirmDelete: PropTypes.func.isRequired
};

export default DeletePlaylistModal;
