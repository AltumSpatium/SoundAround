import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Input, Button } from 'antd';

import '../../styles/AuthPanel.css';

class AuthPanel extends Component {
    constructor(props) {
        super(props);

        this.createForm = this.createForm.bind(this);
        this.processField = this.processField.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    createForm(fieldNames, confirmPassword) {
        const { form: { getFieldDecorator } } = this.props;

        const fields = [];
        fieldNames.forEach(fieldName => {
            const { Field, config } = this.processField(fieldName);
            if (fieldName === 'password' && confirmPassword) {
                const checkConfirmPassword = (rule, value, callback) => {
                    const form = this.props.form;
                    if (value) {
                        form.validateFields(['confirmPassword'], { force: true });
                        callback();
                    } else callback();
                };
                config.rules.push({ validator: checkConfirmPassword });
            }

            fields.push(
                <Form.Item key={fieldName}>
                    {getFieldDecorator(fieldName, config)(Field)}
                </Form.Item>
            );
        });

        if (confirmPassword) {
            const checkPassword = (rule, value, callback) => {
                const form = this.props.form;
                if (value && value !== form.getFieldValue('password')) {
                    callback('Passwords don\'t match!');
                } else callback();
            };

            const confirmPasswordField = (
                <Form.Item key='confirmPassword'>
                    {getFieldDecorator('confirmPassword', {
                        rules: [
                            { required: true, message: 'Please, confirm password!' },
                            { validator: checkPassword }
                        ]
                    })(<Input type='password' placeholder='Confirm password...' />)}
                </Form.Item>
            );

            fields.push(confirmPasswordField);
        }

        return fields;
    }

    processField(fieldName) {
        const { onChange } = this.props;
        let type, placeholder, config;

        switch (fieldName) {
            case 'email':
                type = 'email';
                placeholder = 'Enter email...';
                config = {
                    rules: [
                        // { required: true, message: 'Please, enter email!' },
                        { 
                            pattern: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                            message: 'Please, enter a valid email address!' 
                        }
                    ]
                };
                break;
            case 'username':
                type = 'text';
                placeholder = 'Enter username...';
                config = {
                    rules: [
                        { required: true, message: 'Please, enter username!' },
                        { max: 15, message: 'Username must be less than 15 symbols long!'},
                        { pattern: /^\w*$/, message: 'Username can only contain Latin letters, numbers and underlines!'}
                    ]
                };
                break;
            case 'password':
                type = 'password';
                placeholder = 'Enter password...';
                config = {
                    rules: [
                        { required: true, message: 'Please, enter password!' },
                        { min: 8, message: 'Passwords length must be above 8 symbols!' }
                    ]
                };
                break;
            default:
                return null;
        }

        return {
            Field: <Input onChange={onChange} name={fieldName} type={type} placeholder={placeholder} />,
            config
        };
    }

    onSubmit() {
        const { form, options: { fields, confirmPassword } } = this.props;

        form.validateFields(
            confirmPassword ? fields.concat(['confirmPassword']) : fields, {},
            (errors, values) => {
                if (!errors) {
                    this.props.onSubmit();
            }
        });
    }

    render() {
        const {
            headerContent, footerContent, submitText, isFetching,
            options: { fields, confirmPassword }, onSubmit
        } = this.props;

        const onKeyDown = e => {
            if (e.key === 'Enter') {
                e.preventDefault();
                this.onSubmit();
            }
        };

        return (
            <div className="auth-panel">
                <h3 className="auth-panel__header">{headerContent}</h3>
                    <div className="auth-panel__main">
                        <Form onSubmit={onSubmit} onKeyDown={onKeyDown}>
                            {this.createForm(fields, confirmPassword)}
                            <Form.Item>
                                <Button
                                    type='submit' onClick={this.onSubmit} loading={isFetching}>
                                    {submitText}
                                </Button>
                            </Form.Item>
                        </Form>
                </div>
                <p className="auth-panel__footer">{footerContent}</p>
            </div>
        );
    }
}

AuthPanel.propTypes = {
    headerContent: PropTypes.object,
    footerContent: PropTypes.object,
    submitText: PropTypes.string,
    options: PropTypes.shape({
        fields: PropTypes.arrayOf(PropTypes.string)
    }),
    isFetching: PropTypes.bool,
    onSubmit: PropTypes.func,
    onChange: PropTypes.func
};

export default Form.create()(AuthPanel);
