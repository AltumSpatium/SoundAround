import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import AuthPanel from '../auth/AuthPanel';

import '../../styles/RegisterPage.css';

class RegisterPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            email: '',
            username: '',
            password: ''
        };

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
    }

    onChange({ target }) {
        this.setState({[target.name]: target.value});
    }

    onSubmit() {

    }

    render() {
        const options = {
            fields: ['email', 'username', 'password'],
            confirmPassword: true
        };

        return (
            <div className="register-page">
                <AuthPanel
                    headerContent='Sign Up' submitText='Sign Up'
                    footerContent={<span>Already have an account? <Link to='/login'>Login</Link></span>}
                    onChange={this.onChange} onSubmit={this.onSubmit}
                    options={options} />
            </div>
        );
    }
}

const mapStateToProps = state => ({});
const mapDispatchToProps = dispatch => ({});

export default connect(mapStateToProps, mapDispatchToProps)(RegisterPage);
