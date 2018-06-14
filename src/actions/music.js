import {
    GET_MUSIC_PAGE_REQUEST, GET_MUSIC_PAGE_SUCCESS, GET_MUSIC_PAGE_FAIL,
    GET_TRACK_REQUEST, GET_TRACK_SUCCESS, GET_TRACK_FAIL,
    UPLOAD_TRACK_REQUEST, UPLOAD_TRACK_SUCCESS, UPLOAD_TRACK_FAIL,
    UPDATE_TRACK_REQUEST, UPDATE_TRACK_SUCCESS, UPDATE_TRACK_FAIL,
    DELETE_TRACK_REQUEST, DELETE_TRACK_SUCCESS, DELETE_TRACK_FAIL,
    CLEAR_MUSIC_LIST, SET_MUSIC_TRACKLIST
} from '../constants/music';
import {
    request, success, fail, callAPI
} from './default';
import { toastr } from 'react-redux-toastr';

const getMusicPageRequest = request(GET_MUSIC_PAGE_REQUEST);
const getMusicPageSuccess = success(GET_MUSIC_PAGE_SUCCESS);
const getMusicPageFail = fail(GET_MUSIC_PAGE_FAIL);

export const getMusicPage = (username, page, pageSize, orderBy, orderType) => {
    return callAPI({
        url: `/api/music/list/${username}?` + 
            `pageSize=${pageSize}&page=${page}&orderBy=${orderBy}&orderType=${orderType}`,
        params: {
            headers: {
                'x-access-token': localStorage.getItem('sa_token')
            }
        },
        requestAction: getMusicPageRequest,
        successAction: getMusicPageSuccess,
        failAction: getMusicPageFail
    });
};

const getTrackRequest = request(GET_TRACK_REQUEST);
const getTrackSuccess = success(GET_TRACK_SUCCESS);
const getTrackFail = fail(GET_TRACK_FAIL);

export const getTrack = (trackId, onlyInfo) => {
    return callAPI({
        url: `/api/music/track/${trackId}?onlyInfo=${+onlyInfo}`,
        params: {
            headers: {
                'x-access-token': localStorage.getItem('sa_token')
            }
        },
        requestAction: getTrackRequest,
        successAction: getTrackSuccess,
        failAction: getTrackFail
    });
};

const clearMusicListRequest = request(CLEAR_MUSIC_LIST);

export const clearMusicList = () => async dispatch => {
    return await dispatch(clearMusicListRequest());
};

const uploadTrackRequest = request(UPLOAD_TRACK_REQUEST);
const uploadTrackSuccess = success(UPLOAD_TRACK_SUCCESS);
const uploadTrackFail = fail(UPLOAD_TRACK_FAIL);

export const uploadTrack = (username, track) => {
    const formData = new FormData();
    formData.append('audio', track);
    return callAPI({
        url: `/api/music/list/${username}`,
        params: {
            method: 'POST',
            headers: {
                'x-access-token': localStorage.getItem('sa_token')
            },
            body: formData
        },
        requestAction: uploadTrackRequest,
        successAction: uploadTrackSuccess,
        failAction: uploadTrackFail,
        onSuccess: json => toastr.success('Success', json.message),
        onFail: error => toastr.error('Error', error.message)
    });
};

const updateTrackRequest = request(UPDATE_TRACK_REQUEST);
const updateTrackSuccess = success(UPDATE_TRACK_SUCCESS);
const updateTrackFail = fail(UPDATE_TRACK_FAIL);

export const updateTrack = (trackId, trackData, username) => {
    return callAPI({
        url: `/api/music/${username}/${trackId}`,
        params: {
            method: 'PUT',
            headers: {
                'x-access-token': localStorage.getItem('sa_token'),
                'Content-type': 'application/json'
            },
            body: JSON.stringify(trackData)
        },
        requestAction: updateTrackRequest,
        successAction: successObj => updateTrackSuccess(successObj.updatedTrack),
        failAction: updateTrackFail,
        onSuccess: json => toastr.success('Success', json.message),
        onFail: error => toastr.error('Error', error.message)
    });
};

const deleteTrackRequest = request(DELETE_TRACK_REQUEST);
const deleteTrackSuccess = success(DELETE_TRACK_SUCCESS);
const deleteTrackFail = fail(DELETE_TRACK_FAIL);

export const deleteTrack = (trackId, username) => {
    return callAPI({
        url: `/api/music/${username}/${trackId}`,
        params: {
            method: 'DELETE',
            headers: {
                'x-access-token': localStorage.getItem('sa_token'),
            }
        },
        requestAction: deleteTrackRequest,
        successAction: successObj => deleteTrackSuccess(successObj.trackId),
        failAction: deleteTrackFail,
        onSuccess: json => toastr.success('Success', json.message),
        onFail: error => toastr.error('Error', error.message)
    });
};

const setMusicTracklistSuccess = success(SET_MUSIC_TRACKLIST);

export const setMusicTracklist = tracklist => dispatch => {
    return dispatch(setMusicTracklistSuccess(tracklist));
};
