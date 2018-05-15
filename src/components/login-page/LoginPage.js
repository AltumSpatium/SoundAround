import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import AuthPanel from '../auth/AuthPanel';
import { login } from '../../actions/auth';
import { authenticate } from '../../util/authenticate';

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
        this.props.login(this.state).then(error => {
            if (!error) {
                this.props.getUser().then(() => this.props.history.push('/'));
            }
        });
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
                    options={options} isFetching={this.props.isFetching} />
            </div>
        );
    }
}

const mapStateToProps = state => ({
    isFetching: state.auth.isFetching
});

const mapDispatchToProps = dispatch => ({
    login: userData => dispatch(login(userData)),
    getUser: () => dispatch(authenticate())
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginPage);
