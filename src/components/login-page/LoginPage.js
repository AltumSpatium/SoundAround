import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import AuthPanel from '../auth/AuthPanel';

import '../../styles/LoginPage.css';

class LoginPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
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
            fields: ['username', 'password']
        };

        return (
            <div className="login-page">
                <AuthPanel
                    headerContent='Login' submitText='Login'
                    footerContent={<span>Don't have an account? <Link to='/register'>Sign Up</Link></span>}
                    onChange={this.onChange} onSubmit={this.onSubmit}
                    options={options} />
            </div>
        );
    }
}

export default LoginPage;
