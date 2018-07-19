import {
    GET_USER_REQUEST, GET_USER_SUCCESS, GET_USER_FAIL
} from '../constants/user';
import {
    request, success, fail, callAPI
} from './default';

const getUserRequest = request(GET_USER_REQUEST);
const getUserSuccess = success(GET_USER_SUCCESS);
const getUserFail = fail(GET_USER_FAIL);

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
