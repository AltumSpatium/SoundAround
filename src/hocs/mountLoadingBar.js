import { Component } from 'react';
import { connect } from 'react-redux';
import { showLoading, hideLoading } from 'react-redux-loading-bar';

const mountLoadingBar = children => {
    class WithLoadingBar extends Component {
        componentWillReceiveProps(nextProps) {
            if (this.props.location.pathname === nextProps.location.pathname) return;
            else {
                this.props.showBar();
            }
        }

        shouldComponentUpdate(nextProps) {
            return this.props.location.pathname !== nextProps.location.pathname;
        }

        componentDidUpdate() {
            this.props.hideBar();
        }

        render() {
            return children;
        }
    }

    const mapDispatchToProps = dispatch => ({
        showBar: () => dispatch(showLoading()),
        hideBar: () => dispatch(hideLoading())
    });

    return connect(() => ({}), mapDispatchToProps)(WithLoadingBar);
};

export default mountLoadingBar;
