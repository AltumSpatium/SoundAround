import {
    GET_PLAYLIST_REQUEST, GET_PLAYLIST_SUCCESS, GET_PLAYLIST_FAIL,
    GET_PLAYLISTS_REQUEST, GET_PLAYLISTS_SUCCESS, GET_PLAYLISTS_FAIL,
    GET_PLAYLIST_PAGE_REQUEST, GET_PLAYLIST_PAGE_SUCCESS, GET_PLAYLIST_PAGE_FAIL,
    CREATE_PLAYLIST_REQUEST, CREATE_PLAYLIST_SUCCESS, CREATE_PLAYLIST_FAIL,
    UPDATE_PLAYLIST_REQUEST, UPDATE_PLAYLIST_SUCCESS, UPDATE_PLAYLIST_FAIL,
    DELETE_PLAYLIST_REQUEST, DELETE_PLAYLIST_SUCCESS, DELETE_PLAYLIST_FAIL,
    CLEAR_PLAYLIST, CLEAR_PLAYLIST_PAGE, SET_PLAYLIST_TRACKLIST, ADD_PLAYLIST
} from '../constants/playlist';
import {
    request, success, fail, callAPI, createAction
} from './default';
import { toastr } from 'react-redux-toastr';

const getPlaylistRequest = request(GET_PLAYLIST_REQUEST);
const getPlaylistSuccess = success(GET_PLAYLIST_SUCCESS);
const getPlaylistFail = fail(GET_PLAYLIST_FAIL);

export const getPlaylist = playlistId => {
    return callAPI({
        url: `/api/playlists/list/${playlistId}`,
        params: {
            headers: {
                'x-access-token': localStorage.getItem('sa_token')
            }
        },
        requestAction: getPlaylistRequest,
        successAction: getPlaylistSuccess,
        failAction: getPlaylistFail
    });
};

const getPlaylistPageRequest = request(GET_PLAYLIST_PAGE_REQUEST);
const getPlaylistPageSuccess = success(GET_PLAYLIST_PAGE_SUCCESS);
const getPlaylistPageFail = fail(GET_PLAYLIST_PAGE_FAIL);

export const getPlaylistPage = (username, playlistId, page, pageSize) => {
    return callAPI({
        url: `/api/playlists/music/${username}/${playlistId}?page=${page}&pageSize=${pageSize}`,
        params: {
            headers: {
                'x-access-token': localStorage.getItem('sa_token')
            }
        },
        requestAction: getPlaylistPageRequest,
        successAction: getPlaylistPageSuccess,
        failAction: getPlaylistPageFail
    });
};

const getPlaylistsRequest = request(GET_PLAYLISTS_REQUEST);
const getPlaylistsSuccess = success(GET_PLAYLISTS_SUCCESS);
const getPlaylistsFail = fail(GET_PLAYLISTS_FAIL);

export const getPlaylists = (username, page, pageSize, orderBy, orderType) => {
    return callAPI({
        url: `/api/playlists/${username}?page=${page}&pageSize=${pageSize}&` + 
            `orderBy=${orderBy}&orderType=${orderType}`,
        params: {
            headers: {
                'x-access-token': localStorage.getItem('sa_token')
            }
        },
        requestAction: getPlaylistsRequest,
        successAction: getPlaylistsSuccess,
        failAction: getPlaylistsFail
    });
};

const createPlaylistRequest = request(CREATE_PLAYLIST_REQUEST);
const createPlaylistSuccess = success(CREATE_PLAYLIST_SUCCESS);
const createPlaylistFail = fail(CREATE_PLAYLIST_FAIL);

export const createPlaylist = (username, playlistData) => {
    return callAPI({
        url: `/api/playlists/${username}`,
        params: {
            headers: {
                'x-access-token': localStorage.getItem('sa_token'),
                'Content-type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(playlistData)
        },
        requestAction: createPlaylistRequest,
        successAction: successObj => createPlaylistSuccess(successObj.playlistId),
        failAction: createPlaylistFail,
        onFail: error => toastr.error('Error', error.message)
    });
};

const updatePlaylistRequest = request(UPDATE_PLAYLIST_REQUEST);
const updatePlaylistSuccess = success(UPDATE_PLAYLIST_SUCCESS);
const updatePlaylistFail = fail(UPDATE_PLAYLIST_FAIL);

export const updatePlaylist = (playlistId, playlistData) => {
    return callAPI({
        url: `/api/playlists/list/${playlistId}`,
        params: {
            headers: {
                'x-access-token': localStorage.getItem('sa_token'),
                'Content-type': 'application/json'
            },
            method: 'PUT',
            body: JSON.stringify(playlistData)
        },
        requestAction: updatePlaylistRequest,
        successAction: updatePlaylistSuccess,
        failAction: updatePlaylistFail,
        onFail: error => toastr.error('Error', error.message)
    });
};

const deletePlaylistRequest = request(DELETE_PLAYLIST_REQUEST);
const deletePlaylistSuccess = success(DELETE_PLAYLIST_SUCCESS);
const deletePlaylistFail = fail(DELETE_PLAYLIST_FAIL);

export const deletePlaylist = (username, playlistId) => {
    return callAPI({
        url: `/api/playlists/music/${username}/${playlistId}`,
        params: {
            headers: {
                'x-access-token': localStorage.getItem('sa_token')
            },
            method: 'DELETE'
        },
        requestAction: deletePlaylistRequest,
        successAction: successObj => deletePlaylistSuccess(successObj.playlistId),
        failAction: deletePlaylistFail,
        onSuccess: json => toastr.success(json.message),
        onFail: error => toastr.error('Error', error.message)
    });
};

const clearPlaylistRequest = request(CLEAR_PLAYLIST);
export const clearPlaylist = createAction(clearPlaylistRequest);

const clearPlaylistPageRequest = request(CLEAR_PLAYLIST_PAGE);
export const clearPlaylistPage = createAction(clearPlaylistPageRequest);

const setPlaylistTracklistSuccess = success(SET_PLAYLIST_TRACKLIST);
export const setPlaylistTracklist = createAction(setPlaylistTracklistSuccess);

const addPlaylistSuccess = success(ADD_PLAYLIST);
export const addPlaylist = createAction(addPlaylistSuccess);
