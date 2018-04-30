import {
    GET_USER_REQUEST, GET_USER_SUCCESS, GET_USER_FAIL,
    UPDATE_USER_REQUEST, UPDATE_USER_SUCCESS, UPDATE_USER_FAIL,
    DELETE_USER_REQUEST, DELETE_USER_SUCCESS, DELETE_USER_FAIL
} from '../constants/user';
import {
    request, success, fail
} from './default';

const getUserRequest = request(GET_USER_REQUEST);
const getUserSuccess = success(GET_USER_SUCCESS);
const getUserFail = fail(GET_USER_FAIL);

const updateUserRequest = request(UPDATE_USER_REQUEST);
const updateUserSuccess = success(UPDATE_USER_SUCCESS);
const updateUserFail = fail(UPDATE_USER_FAIL);

const deleteUserRequest = request(DELETE_USER_REQUEST);
const deleteUserSuccess = success(DELETE_USER_SUCCESS);
const deleteUserFail = fail(DELETE_USER_FAIL);

export const getUser = username => dispatch => {
    dispatch(getUserRequest());
    return fetch(`/api/user/${username}`, {
            headers: {
                'x-access-token': localStorage.getItem('sa_token')
            }
        })
        .then(async response => {
            const json = await response.json();
            switch (response.status) {
                case 200:
                    return json;
                case 400:
                case 401:
                case 403:
                case 404:
                case 409:
                    throw json;
                default:
                    const defaultError = { message: 'An error occured' };
                    throw defaultError;
            }
        })
        .then(json => dispatch(getUserSuccess(json)))
        .catch(error => dispatch(getUserFail(error)));
};

export const updateUser = () => dispatch => {

};

export const deleteUser = () => dispatch => {

};
