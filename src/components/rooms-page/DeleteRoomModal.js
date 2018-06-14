import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Button } from 'antd';

const DeleteRoomModal = props => {
    const { isVisible, onCancelDelete } = props;
    const room = props.room || {};

    const onConfirmDelete = () => {
        props.onConfirmDelete(room._id);
    };

    return (
        <Modal
            title='Delete room'
            visible={isVisible}
            onCancel={onCancelDelete}
            onOk={onConfirmDelete}
            width={450}
            footer={[
                <div className='music-page__modal-btns' key='footer'>
                    <Button className='sa-btn sa-btn-success' onClick={onCancelDelete}>Cancel</Button>
                    <Button className='sa-btn sa-btn-error' onClick={onConfirmDelete}>Delete</Button>
                </div>
            ]}>
            <div className='music-page__delete-warning-text'>
                <p>Are you sure you want to delete room <span>{room.name}</span> ?</p>
            </div>
        </Modal>
    );
}

DeleteRoomModal.propTypes = {
    room: PropTypes.object,
    isVisible: PropTypes.bool.isRequired,
    onCancelDelete: PropTypes.func.isRequired,
    onConfirmDelete: PropTypes.func.isRequired
};

export default DeleteRoomModal;
