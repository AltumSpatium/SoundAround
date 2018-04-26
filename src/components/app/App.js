import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { logout } from '../../actions/auth';

import '../../styles/App.css';

class App extends Component {
    static contextTypes = {
        router: PropTypes.object.isRequired
    }

    constructor(props) {
        super(props);

        this.onLogoutClick = this.onLogoutClick.bind(this);
    }

    onLogoutClick() {
        this.props.logout().then(() => {
            this.context.router.history.push('/login');
        });
    }

    render() {
        return (
            <div className="app">
                Appbar <button onClick={this.onLogoutClick}>Logout</button>

                {this.props.children}
            </div>
        );
    }
}

const mapStateToProps = state => ({});
const mapDispatchToProps = dispatch => ({
    logout: () => dispatch(logout())
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
