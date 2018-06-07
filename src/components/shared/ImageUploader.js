import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Upload, Icon } from 'antd';

function getBase64(imgFile, callback) {
    const fileReader = new FileReader();
    fileReader.onload = () => callback(fileReader.result);
    fileReader.readAsDataURL(imgFile);
}

class ImageUploader extends Component {
    constructor(props) {
        super(props);

        let imageUrl = '';
        if (props.image && props.image.data) {
            const rawImage = new Buffer(props.image.data.data);
            imageUrl = `data:image/jpeg;base64,${rawImage.toString('base64')}`;
        }

        this.state = {
            imageUrl
        };

        this.onChange = this.onChange.bind(this);
        this.deleteImage = this.deleteImage.bind(this);
    }

    onChange(info) {
        getBase64(info.file, imageUrl => {
            this.setState({imageUrl})
            this.props.onImageUpload(info.file);
        });
    }

    deleteImage(e) {
        e.stopPropagation();
        this.setState({ imageUrl: '' });
        this.props.onImageUpload(null);
    }

    render() {
        const {
            name, className, listType, alt, uploaderText
        } = this.props;

        const imageUrl = this.state.imageUrl;
        const uploadButton = (
            <div>
                <Icon type='plus' />
                <div className='ant-upload-text'>{uploaderText}</div>
            </div>
        );

        return (
            <Upload
                name={name}
                listType={listType}
                className={className}
                beforeUpload={() => false}
                showUploadList={false}
                onChange={this.onChange}>
                {imageUrl ? 
                    <div>
                        <img src={imageUrl} alt={alt} />
                        <span onClick={this.deleteImage} className='ant-upload-cross'>❌</span>
                    </div> : uploadButton}
            </Upload>
        );
    }
}

ImageUploader.propTypes = {
    name: PropTypes.string,
    image: PropTypes.object,
    className: PropTypes.string,
    listType: PropTypes.string,
    alt: PropTypes.string,
    uploaderText: PropTypes.string,
    onImageUpload: PropTypes.func.isRequired
};

export default ImageUploader;
