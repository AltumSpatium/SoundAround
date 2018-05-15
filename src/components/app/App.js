import React, { Component } from 'react';
import { Icon } from 'antd';
import LoadingBar from 'react-redux-loading-bar';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { logout } from '../../actions/auth';
import { pages } from '../../constants/default';

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
                <header className='app-header'>
                    <div className="app-logo">
                        <Link to=''>
                            <span>Sound Around</span>
                        </Link>
                    </div>
                    <div className="header-links-container">
                        {pages.map(page => (
                            <div key={page.path} className={`header-link ${isActive(page.path)}`}>
                                <Link to={page.path}><span>{page.title}</span></Link>
                            </div>
                        ))}
                    </div>
                    <button onClick={this.onLogoutClick} className='btn-logout'>Logout</button>
                </header>
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
