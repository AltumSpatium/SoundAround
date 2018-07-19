import {
    LOGIN_REQUEST, LOGIN_SUCCESS, LOGIN_FAIL,
    REGISTER_REQUEST, REGISTER_SUCCESS, REGISTER_FAIL,
    LOGOUT
} from '../constants/auth';
import {
    request, success, fail, callAPI
} from './default';
import { toastr } from 'react-redux-toastr';

const createParams = body => ({
    headers: {
        'Content-type': 'application/json; charset=UTF-8'
    },
    method: 'POST',
    body: JSON.stringify(body)
});

const fetchAuth = (url, userData, requestAction, successAction, failAction) => {
    return callAPI({
        url,
        params: createParams(userData),
        requestAction,
        successAction,
        failAction,
        onSuccess: json => localStorage.setItem('sa_token', json.token),
        onFail: error => toastr.error('Error', error.message)
    });
}

const loginRequest = request(LOGIN_REQUEST);
const loginSuccess = success(LOGIN_SUCCESS)
const loginFail = fail(LOGIN_FAIL);

const registerRequest = request(REGISTER_REQUEST);
const registerSuccess = success(REGISTER_SUCCESS)
const registerFail = fail(REGISTER_FAIL);

const logoutRequest = request(LOGOUT);

export const login = userData =>
    fetchAuth('/api/auth/login', userData, loginRequest, loginSuccess, loginFail);

export const register = userData =>
    fetchAuth('/api/auth/signup', userData, registerRequest, registerSuccess, registerFail);

export const logout = () => async dispatch => {
    localStorage.removeItem('sa_token');
    return dispatch(logoutRequest());
};
