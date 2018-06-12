import { combineReducers } from 'redux';
import { routerReducer } from 'react-router-redux';
import { reducer as toastrReducer } from 'react-redux-toastr';
import { loadingBarReducer } from 'react-redux-loading-bar';
import auth from './auth';
import user from './user';
import music from './music';
import playlist from './playlist';
import room from './room';

export default combineReducers({
    auth,
    user,
    music,
    playlist,
    room,
    routing: routerReducer,
    toastr: toastrReducer,
    loadingBar: loadingBarReducer
});
