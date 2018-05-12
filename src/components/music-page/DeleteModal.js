import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Button } from 'antd';

const DeleteModal = props => {
    const { isVisible, onCancelDelete } = props;
    const track = props.track || {};

    const onConfirmDelete = () => {
        props.onConfirmDelete(track._id);
    };

    return (
        <Modal
            title='Delete track'
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
                    <p>Are you sure you want to delete <span>{track.artist} - {track.title}</span> ?</p>
                </div>
            </Modal>
    );
}

DeleteModal.propTypes = {
    track: PropTypes.object,
    isVisible: PropTypes.bool.isRequired,
    onCancelDelete: PropTypes.func.isRequired,
    onConfirmDelete: PropTypes.func.isRequired
};

export default DeleteModal;
