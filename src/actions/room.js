import {
    GET_ROOMS_REQUEST, GET_ROOMS_SUCCESS, GET_ROOMS_FAIL,
    CREATE_ROOM_REQUEST, CREATE_ROOM_SUCCESS, CREATE_ROOM_FAIL,
    UPDATE_ROOM_REQUEST, UPDATE_ROOM_SUCCESS, UPDATE_ROOM_FAIL,
    DELETE_ROOM_REQUEST, DELETE_ROOM_SUCCESS, DELETE_ROOM_FAIL,
    CLEAR_ROOMS
} from '../constants/room';
import {
    request, success, fail, callAPI
} from './default';
import { toastr } from 'react-redux-toastr';

const getRoomsRequest = request(GET_ROOMS_REQUEST);
const getRoomsSuccess = success(GET_ROOMS_SUCCESS);
const getRoomsFail = fail(GET_ROOMS_FAIL);

export const getRooms = (page, pageSize) => {
    return callAPI({
        url: `/api/rooms/list?page=${page}&pageSize=${pageSize}`,
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



const clearRoomsRequest = request(CLEAR_ROOMS);

export const clearRooms = () => async dispatch => dispatch(clearRoomsRequest());
