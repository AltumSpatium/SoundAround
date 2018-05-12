import React from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Progress, Upload } from 'antd';

const UploadModal = props => {
    const {
        isVisible, onCancelUpload, onClickUpload,
        onChangeUploadedFile, fileList,
        percent, isUploading
    } = props;

    return (
        <Modal
            title='Upload track'
            visible={isVisible}
            onCancel={onCancelUpload}
            onOk={onClickUpload}
            footer={[
                <div className='music-page__modal-btns' key='footer'>
                    <Button onClick={onCancelUpload}>Cancel</Button>
                    <Button className='sa-btn' onClick={onClickUpload}>
                        Upload
                    </Button>
                </div>
            ]}>
            <div>
                <ul className="upload-restrictions">
                    <li>Supported formats: MP3, WAV, AAC, FLAC, OGG.</li>
                    <li>The file size must not exceed 50 MB.</li>
                    <li>The audio file must not violate copyrights and related rights.</li>
                </ul>
            </div>
            <Upload.Dragger
                fileList={fileList} onChange={onChangeUploadedFile}
                name='audio' showUploadList={false} beforeUpload={() => false}>
                {fileList && fileList.length ? 
                    <p className='upload-audiofile'>{fileList[0].name}</p> :
                    <p className='ant-upload-text'>Click or drag audio file to this area to upload</p>
                }
            </Upload.Dragger>
            {(isUploading || percent === 100) && (
                <div className='music-page__upload-progress'><Progress percent={percent} /></div>
            )}
        </Modal>
    );
}

UploadModal.propTypes = {
    isVisible: PropTypes.bool.isRequired,
    isUploading: PropTypes.bool.isRequired,
    percent: PropTypes.number.isRequired,
    fileList: PropTypes.array,
    onCancelUpload: PropTypes.func.isRequired,
    onClickUpload: PropTypes.func.isRequired,
    onChangeUploadedFile: PropTypes.func.isRequired
};

export default UploadModal;
