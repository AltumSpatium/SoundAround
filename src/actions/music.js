import {
    GET_MUSIC_PAGE_REQUEST, GET_MUSIC_PAGE_SUCCESS, GET_MUSIC_PAGE_FAIL,
    UPLOAD_TRACK_REQUEST, UPLOAD_TRACK_SUCCESS, UPLOAD_TRACK_FAIL,
    UPDATE_TRACK_REQUEST, UPDATE_TRACK_SUCCESS, UPDATE_TRACK_FAIL,
    DELETE_TRACK_REQUEST, DELETE_TRACK_SUCCESS, DELETE_TRACK_FAIL,
    CLEAR_MUSIC_LIST
} from '../constants/music';
import {
    request, success, fail
} from './default';
import { toastr } from 'react-redux-toastr';

const processReponse = async response => {
    const json = await response.json();
    switch (response.status) {
        case 200:
            return json;
        case 400:
        case 401:
        case 403:
        case 404:
        case 409:
        case 500:
            throw json;
        default:
            const defaultError = { message: 'An error occured' };
            throw defaultError;            
    }
};

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
    .then(processReponse)
    .then(json => dispatch(getMusicPageSuccess(json)))
    .catch(error => dispatch(getMusicPageFail(error)))
};

const clearMusicListRequest = request(CLEAR_MUSIC_LIST);

export const clearMusicList = () => async dispatch => {
    return await dispatch(clearMusicListRequest());
};

const uploadTrackRequest = request(UPLOAD_TRACK_REQUEST);
const uploadTrackSuccess = success(UPLOAD_TRACK_SUCCESS);
const uploadTrackFail = fail(UPLOAD_TRACK_FAIL);

export const uploadTrack = (username, track) => async dispatch => {
    dispatch(uploadTrackRequest());
    const formData = new FormData();
    formData.append('audio', track);
    return fetch(`/api/music/list/${username}`, {
        method: 'POST',
        headers: {
            'x-access-token': localStorage.getItem('sa_token')
        },
        body: formData
    })
    .then(processReponse)
    .then(json => {
        toastr.success('Success', json.message);
        dispatch(uploadTrackSuccess(json))
    })
    .catch(error => {
        toastr.error('Error', error.message);
        dispatch(uploadTrackFail(error))
    });
};

// export const uploadTrack = (username, track, onProgress) => async dispatch => {
//     dispatch(uploadTrackRequest());
//     const formData = new FormData();
//     formData.append('audio', track);

//     return axios.post(`/api/music/list/${username}`, formData, {
//         headers: {
//             'x-access-token': localStorage.getItem('sa_token')
//         },
//         onUploadProgress: onProgress
//     })
//     .then(response => {
//         const json = response.data;
//         switch (response.status) {
//             case 200:
//                 return json;
//             case 400:
//             case 401:
//             case 403:
//             case 404:
//             case 409:
//             case 500:
//                 throw json;
//             default:
//                 const defaultError = { message: 'An error occured' };
//                 throw defaultError;
//         }
//     })
//     .then(json => {
//         toastr.success('Success', json.message);
//         dispatch(uploadTrackSuccess(json))
//     })
//     .catch(error => {
//         toastr.error('Error', error.message);
//         dispatch(uploadTrackFail(error))
//     });
// };

const updateTrackRequest = request(UPDATE_TRACK_REQUEST);
const updateTrackSuccess = success(UPDATE_TRACK_SUCCESS);
const updateTrackFail = fail(UPDATE_TRACK_FAIL);

export const updateTrack = (trackId, trackData, username) => async dispatch => {
    dispatch(updateTrackRequest());
    return fetch(`/api/music/${username}/${trackId}`, {
        method: 'PUT',
        headers: {
            'x-access-token': localStorage.getItem('sa_token'),
            'Content-type': 'application/json'
        },
        body: JSON.stringify(trackData)
    })
    .then(processReponse)
    .then(json => {
        toastr.success('Success', json.message);
        dispatch(updateTrackSuccess(json.updatedTrack));
    })
    .catch(error => {
        toastr.error('Error', error.message);
        dispatch(updateTrackFail(error));
    });
};

const deleteTrackRequest = request(DELETE_TRACK_REQUEST);
const deleteTrackSuccess = success(DELETE_TRACK_SUCCESS);
const deleteTrackFail = fail(DELETE_TRACK_FAIL);

export const deleteTrack = (trackId, username) => async dispatch => {
    dispatch(deleteTrackRequest());
    return fetch(`/api/music/${username}/${trackId}`, {
        method: 'DELETE',
        headers: {
            'x-access-token': localStorage.getItem('sa_token'),
        }
    })
    .then(processReponse)
    .then(json => {
        toastr.success('Success', json.message);
        dispatch(deleteTrackSuccess(json.trackId));
    })
    .catch(error => {
        toastr.error('Error', error.message);
        dispatch(deleteTrackFail(error));
    });
};
