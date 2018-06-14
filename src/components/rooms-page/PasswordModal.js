import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, Input } from 'antd';
import { showMessage } from '../../util/toastrUtil';

class PasswordModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            password: ''
        };

        this.onChange = this.onChange.bind(this);
        this.onCancelClick = this.onCancelClick.bind(this);
        this.onEnterClick = this.onEnterClick.bind(this);
    }

    onChange(e) {
        const { target: { name, value } } = e;
        this.setState({ [name]: value });
    }

    onCancelClick() {
        this.setState({ password: '' });
        this.props.onCancelClick();
    }

    onEnterClick() {
        const { room } = this.props;
        if (!room) return;

        const { password } = this.state;
        if (!password) {
            showMessage('You must enter password!', null, 'error');
            const element = document.querySelector('.rooms-page__password-input');
            element.classList.add('has-error');
            setTimeout(() => element.classList.remove('has-error'), 500);
            return;
        }

        if (password === room.password) {
            this.props.onEnterClick(room);
            this.setState({ password: '' });
        } else showMessage('Invalid password', null, 'error');
    }

    render() {
        const { password } = this.state;
        const { isVisible } = this.props;

        return (
            <Modal
                title='Enter password'
                visible={isVisible}
                onCancel={this.onCancelClick}
                onOk={this.onEnterClick}
                width={450}
                footer={[
                    <div className='music-page__modal-btns' key='footer'>
                        <Button className='sa-btn' onClick={this.onCancelClick}>Cancel</Button>
                        <Button className='sa-btn' onClick={this.onEnterClick}>Enter</Button>
                </div>
                ]}>
                <div className="rooms-page__password-input">
                    <Input
                        type='password' onChange={this.onChange} value={password}
                        addonBefore='Password' name='password' onPressEnter={this.onEnterClick} />
                </div>
        </Modal>
        );
    }
}

PasswordModal.propTypes = {
    room: PropTypes.object,
    isVisible: PropTypes.bool.isRequired,
    onCancelClick: PropTypes.func.isRequired,
    onEnterClick: PropTypes.func.isRequired
};

export default PasswordModal;
