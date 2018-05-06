import {
    GET_MUSIC_PAGE_REQUEST, GET_MUSIC_PAGE_SUCCESS, GET_MUSIC_PAGE_FAIL,
    CLEAR_MUSIC_LIST
} from '../constants/music';
import {
    request, success, fail
} from './default';

const getMusicPageRequest = request(GET_MUSIC_PAGE_REQUEST);
const getMusicPageSuccess = success(GET_MUSIC_PAGE_SUCCESS);
const getMusicPageFail = fail(GET_MUSIC_PAGE_FAIL);

export const getMusicPage = (username, page, pageSize, orderBy, orderType) => dispatch => {
    dispatch(getMusicPageRequest());
    const url = `/api/music/list/${username}?` + 
        `pageSize=${pageSize}&page=${page}&orderBy=${orderBy}&orderType=${orderType}`;
    return fetch(url, {
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
        .then(json => dispatch(getMusicPageSuccess(json)))
        .catch(error => dispatch(getMusicPageFail(error)))
};

const clearMusicListRequest = request(CLEAR_MUSIC_LIST);

export const clearMusicList = () => dispatch => {
    dispatch(clearMusicListRequest());
};
