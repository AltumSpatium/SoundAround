import React, { Component } from 'react';
import { Icon } from 'antd';
import LoadingBar from 'react-redux-loading-bar';
import PropTypes from 'prop-types';
import AppHeader from './AppHeader';
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

        window.addEventListener('scroll', this.showArrowOnScroll);
    }

    componentWillUnmount() {
        window.removeEventListener('scroll', this.showArrowOnScroll);
    }

    onLogoutClick() {
        this.props.logout().then(() => {
            this.context.router.history.push('/login');
        });
    }

    showArrowOnScroll() {
        const arrow = document.querySelector('.up-arrow');
        if (window.scrollY >= 400) arrow.classList.remove('hide');
        else arrow.classList.add('hide');
    }

    render() {
        const isActive = pagePath =>
            this.context.router.history.location.pathname === pagePath ? 'page-active' : '';

        return (
            <div className="app">
                <LoadingBar style={{ height: '2px', backgroundColor: 'red' }} />
                <AppHeader onLogoutClick={this.onLogoutClick} isActive={isActive} />
                <section className='page-main-content'>
                    {this.props.children}
                </section>
                <div className="up-arrow hide" onClick={() => window.scrollTo(0, 0)}>
                    <Icon type='up' />
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    currentUser: state.user.currentUser
});
const mapDispatchToProps = dispatch => ({
    logout: () => dispatch(logout())
});

export default connect(mapStateToProps, mapDispatchToProps)(App);
