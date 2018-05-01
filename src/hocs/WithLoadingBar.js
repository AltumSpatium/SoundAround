import { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { showLoading, hideLoading } from 'react-redux-loading-bar';

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
        console.log(this.props);
        return this.props.children;
    }
}

const mapDispatchToProps = dispatch => ({
    showBar: () => dispatch(showLoading()),
    hideBar: () => dispatch(hideLoading())
});

export default withRouter(connect(() => ({}), mapDispatchToProps)(WithLoadingBar));
