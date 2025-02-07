import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import AuthPanel from '../auth/AuthPanel';
import { register } from '../../actions/auth';
import { authenticate } from '../../util/authenticate';

import '../../styles/RegisterPage.css';

class RegisterPage extends Component {
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
        this.props.register(this.state).then(error => {
            if (!error) {
                this.props.getUser().then(() => this.props.history.push('/'));
            }
        });
    }

    render() {
        const options = {
            fields: ['username', 'password'],
            confirmPassword: true
        };

        return (
            <div className="register-page">
                <AuthPanel
                    headerContent='Sign Up' submitText='Sign Up'
                    footerContent={<span>Already have an account? <Link to='/login'>Login</Link></span>}
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
    register: userData => dispatch(register(userData)),
    getUser: () => dispatch(authenticate())
});

export default connect(mapStateToProps, mapDispatchToProps)(RegisterPage);
