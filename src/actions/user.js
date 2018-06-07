import {
    GET_USER_REQUEST, GET_USER_SUCCESS, GET_USER_FAIL,
    UPDATE_USER_REQUEST, UPDATE_USER_SUCCESS, UPDATE_USER_FAIL,
    DELETE_USER_REQUEST, DELETE_USER_SUCCESS, DELETE_USER_FAIL
} from '../constants/user';
import {
    request, success, fail, callAPI
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

export const getUser = username => {
    return callAPI({
        url: `/api/user/${username}`,
        params: {
            headers: {
                'x-access-token': localStorage.getItem('sa_token')
            }
        },
        requestAction: getUserRequest,
        successAction: getUserSuccess,
        failAction: getUserFail
    });
};

export const updateUser = () => dispatch => {

};

export const deleteUser = () => dispatch => {

};
