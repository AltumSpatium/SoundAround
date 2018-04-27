import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { reducer as toastrReducer } from 'react-redux-toastr';
import { loadingBarReducer } from 'react-redux-loading-bar';
import auth from './auth';
import user from './user';

export default combineReducers({
    auth,
    user,
    routing: routerReducer,
    toastr: toastrReducer,
    loadingBar: loadingBarReducer
});
