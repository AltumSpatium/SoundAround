import React, { Component } from 'react';
import LoadingBar from 'react-redux-loading-bar';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
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
                <header>
                    <LoadingBar style={{ height: '2px', backgroundColor: 'red' }} />
                    Appbar <button onClick={this.onLogoutClick}>Logout</button>
                    <div>
                        <Link to='/music'>Music</Link> | <Link to='/rooms'>Rooms</Link> | <Link to='/playlists'>Playlists</Link>
                    </div>
                </header>

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
