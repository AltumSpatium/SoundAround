import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import ReduxToastr from 'react-redux-toastr';
import jwt from 'jsonwebtoken';
import { getUser } from './actions/user';
import configureStore from './store/configureStore';
import routes from './routes';

import 'antd/dist/antd.css';
import './styles/bootstrap.min.css';
import './styles/index.css';

const authenticate = () => {
    const token = localStorage.getItem('sa_token');
    if (!token) return;
    const payload = jwt.decode(token);
    return getUser(payload.sub);
};

const store = configureStore();

const authAction = authenticate();
if (authAction) store.dispatch(authAction);

render(
    <Provider store={store}>
        <div>
            <Router>
                {routes}
            </Router>

            <ReduxToastr
                timeOut={5000}
                newestOnTop={false}
                transitionIn='fadeIn'
                transitionOut='fadeOut'
                progressBar />
        </div>
    </Provider>,
    document.getElementById('root')
);
