import {
    LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAIL,
    REGISTER_REQUEST, REGISTER_SUCCESS, REGISTER_FAIL,
    LOGOUT
} from '../constants/auth';

const initialState = {
    isFetching: false,
    isAuthorized: !!localStorage.getItem('sa_token')
};

const auth = (state=initialState, action) => {
    switch (action.type) {
        case LOGIN_REQUEST:
        case REGISTER_REQUEST:
            return { ...state, isFetching: true };
        case REGISTER_SUCCESS:
        case LOGIN_SUCCESS:
            return { ...state, isFetching: false, isAuthorized: true };
        case REGISTER_FAIL:
        case LOGIN_FAIL:
            return { ...state, isFetching: false };
        case LOGOUT:
            return { ...state, isAuthorized: false };
        default:
            return state;
    }
};

export default auth;
