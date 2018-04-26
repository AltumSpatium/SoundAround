import React, { Component } from 'react';
import { Redirect } from 'react-router';

const Authorization = allowedRoles => WrappedComponent => {
    return class AuthorizationWrapper extends Component {
        render() {
            const token = localStorage.getItem('sa_token');
            const role = token ? 'user' : 'guest';

            if (allowedRoles.includes(role)) {
                return <WrappedComponent {...this.props} />
            } else if (role === 'user') {
                return <Redirect to='/' />
            } else if (role === 'guest') {
                return <Redirect to='/login' />
            }
        }
    }
};

export default Authorization;
