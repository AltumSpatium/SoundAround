import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { pages } from '../../constants/default';

const AppHeader = props => {
    const { onLogoutClick, isActive } = props;
    return (
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
            <button onClick={onLogoutClick} className='btn-logout'>Logout</button>
        </header>
    );
};

AppHeader.propTypes = {
    onLogoutClick: PropTypes.func.isRequired,
    isActive: PropTypes.func.isRequired
};

export default AppHeader;
