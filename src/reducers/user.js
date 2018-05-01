import {
    GET_USER_REQUEST, GET_USER_SUCCESS, GET_USER_FAIL,
    UPDATE_USER_REQUEST, UPDATE_USER_SUCCESS, UPDATE_USER_FAIL,
    DELETE_USER_REQUEST, DELETE_USER_SUCCESS, DELETE_USER_FAIL
} from '../constants/user';

const initialState = {
    isFetching: false,
    currentUser: null
};

const user = (state=initialState, action) => {
    switch (action.type) {
        case GET_USER_REQUEST:
        case UPDATE_USER_REQUEST:
        case DELETE_USER_REQUEST:
            return { ...state, isFetching: true };
        case GET_USER_SUCCESS:
        case UPDATE_USER_SUCCESS:
            return { ...state, isFetching: false, currentUser: action.payload };
        case DELETE_USER_SUCCESS:
            return { ...state, isFetching: false, currentUser: null };
        case GET_USER_FAIL:
        case UPDATE_USER_FAIL:
        case DELETE_USER_FAIL:
            return { ...state, isFetching: false };
        default:
            return state;
    }
};

export default user;
