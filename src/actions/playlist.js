import {
    GET_PLAYLIST_REQUEST, GET_PLAYLIST_SUCCESS, GET_PLAYLIST_FAIL,
    GET_PLAYLISTS_REQUEST, GET_PLAYLISTS_SUCCESS, GET_PLAYLISTS_FAIL,
    GET_PLAYLIST_PAGE_REQUEST, GET_PLAYLIST_PAGE_SUCCESS, GET_PLAYLIST_PAGE_FAIL,
    CREATE_PLAYLIST_REQUEST, CREATE_PLAYLIST_SUCCESS, CREATE_PLAYLIST_FAIL,
    UPDATE_PLAYLIST_REQUEST, UPDATE_PLAYLIST_SUCCESS, UPDATE_PLAYLIST_FAIL,
    DELETE_PLAYLIST_REQUEST, DELETE_PLAYLIST_SUCCESS, DELETE_PLAYLIST_FAIL,
    CLEAR_PLAYLIST, SET_PLAYLIST_TRACKLIST
} from '../constants/playlist';
import {
    request, success, fail, callAPI
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
        successAction: createPlaylistSuccess,
        failAction: createPlaylistFail,
        onFail: error => toastr.error('Error', error.message)
    });
};

const updatePlaylistRequest = request(UPDATE_PLAYLIST_REQUEST);
const updatePlaylistSuccess = request(UPDATE_PLAYLIST_SUCCESS);
const updatePlaylistFail = request(UPDATE_PLAYLIST_FAIL);

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

const clearPlaylistRequest = request(CLEAR_PLAYLIST);

export const clearPlaylist = () => async dispatch => {
    return dispatch(clearPlaylistRequest());
};

const setPlaylistTracklistSuccess = success(SET_PLAYLIST_TRACKLIST);

export const setPlaylistTracklist = tracklist => dispatch => {
    return dispatch(setPlaylistTracklistSuccess(tracklist));
};
