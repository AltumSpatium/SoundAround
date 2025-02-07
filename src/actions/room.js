import {
    GET_ROOMS_REQUEST, GET_ROOMS_SUCCESS, GET_ROOMS_FAIL,
    GET_ROOM_REQUEST, GET_ROOM_SUCCESS, GET_ROOM_FAIL,
    CREATE_ROOM_REQUEST, CREATE_ROOM_SUCCESS, CREATE_ROOM_FAIL,
    UPDATE_ROOM,
    DELETE_ROOM_REQUEST, DELETE_ROOM_SUCCESS, DELETE_ROOM_FAIL,
    GET_ROOM_PLAYLIST_REQUEST, GET_ROOM_PLAYLIST_SUCCESS, GET_ROOM_PLAYLIST_FAIL,
    CLEAR_ROOMS, SET_ROOM_NOW_PLAYING,
    USER_ENTERED_ROOM, USER_EXITED_ROOM, RECEIVE_MESSAGE, KICK_USER
} from '../constants/room';
import {
    request, success, fail, callAPI, createAction
} from './default';
import { toastr } from 'react-redux-toastr';

const getRoomsRequest = request(GET_ROOMS_REQUEST);
const getRoomsSuccess = success(GET_ROOMS_SUCCESS);
const getRoomsFail = fail(GET_ROOMS_FAIL);

export const getRooms = (page, pageSize, search) => {
    return callAPI({
        url: `/api/rooms/list?page=${page}&pageSize=${pageSize}${search ? `&search=${search}`: ''}`,
        params: {
            headers: {
                'x-access-token': localStorage.getItem('sa_token')
            }
        },
        requestAction: getRoomsRequest,
        successAction: getRoomsSuccess,
        failAction: getRoomsFail
    });
};

const getRoomRequest = request(GET_ROOM_REQUEST);
const getRoomSuccess = success(GET_ROOM_SUCCESS);
const getRoomFail = fail(GET_ROOM_FAIL);

export const getRoom = roomId => {
    return callAPI({
        url: `/api/rooms/list/${roomId}`,
        params: {
            headers: {
                'x-access-token': localStorage.getItem('sa_token')
            }
        },
        requestAction: getRoomRequest,
        successAction: getRoomSuccess,
        failAction: getRoomFail
    });
};

const createRoomRequest = request(CREATE_ROOM_REQUEST);
const createRoomSuccess = success(CREATE_ROOM_SUCCESS);
const createRoomFail = fail(CREATE_ROOM_FAIL);

export const createRoom = (username, roomData) => {
    return callAPI({
        url: `/api/rooms/${username}`,
        params: {
            headers: {
                'x-access-token': localStorage.getItem('sa_token'),
                'Content-type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(roomData)
        },
        requestAction: createRoomRequest,
        successAction: successObj => createRoomSuccess(successObj.roomId),
        failAction: createRoomFail,
        onFail: error => toastr.error('Error', error.message)
    });
};

const deleteRoomRequest = request(DELETE_ROOM_REQUEST);
const deleteRoomSuccess = success(DELETE_ROOM_SUCCESS);
const deleteRoomFail = fail(DELETE_ROOM_FAIL);

export const deleteRoom = roomId => {
    return callAPI({
        url: `/api/rooms/list/${roomId}`,
        params: {
            headers: {
                'x-access-token': localStorage.getItem('sa_token')
            },
            method: 'DELETE',
        },
        requestAction: deleteRoomRequest,
        successAction: successObj => deleteRoomSuccess(successObj.roomId),
        failAction: deleteRoomFail
    });
};

const getRoomPlaylistRequest = request(GET_ROOM_PLAYLIST_REQUEST);
const getRoomPlaylistSuccess = success(GET_ROOM_PLAYLIST_SUCCESS);
const getRoomPlaylistFail = fail(GET_ROOM_PLAYLIST_FAIL);

export const getRoomPlaylist = (roomId, playlistId, userId) => {
    return callAPI({
        url: `/api/rooms/list/${roomId}/playlist/${playlistId}/${userId}`,
        params: {
            headers: {
                'x-access-token': localStorage.getItem('sa_token')
            }
        },
        requestAction: getRoomPlaylistRequest,
        successAction: getRoomPlaylistSuccess,
        failAction: getRoomPlaylistFail
    });
};

const clearRoomsRequest = request(CLEAR_ROOMS);
export const clearRooms = createAction(clearRoomsRequest);

const userEnteredRoomSuccess = success(USER_ENTERED_ROOM);
export const enterRoom = createAction(userEnteredRoomSuccess, ['username', 'roomId']);

const userExitedRoomSuccess = success(USER_EXITED_ROOM);
export const exitRoom = createAction(userExitedRoomSuccess, ['username', 'roomId']);

const receiveMessageSuccess = success(RECEIVE_MESSAGE);
export const receiveMessage = createAction(receiveMessageSuccess);

const kickUserSuccess = success(KICK_USER);
export const kickUser = createAction(kickUserSuccess);

const updateRoomSuccess = success(UPDATE_ROOM);
export const updateRoom = createAction(updateRoomSuccess);

const setRoomNowPlayingSuccess = success(SET_ROOM_NOW_PLAYING);
export const setRoomNowPlaying = createAction(setRoomNowPlayingSuccess);
