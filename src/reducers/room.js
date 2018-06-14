import {
    GET_ROOMS_REQUEST, GET_ROOMS_SUCCESS, GET_ROOMS_FAIL,
    CREATE_ROOM_REQUEST, CREATE_ROOM_SUCCESS, CREATE_ROOM_FAIL,
    UPDATE_ROOM_REQUEST, UPDATE_ROOM_SUCCESS, UPDATE_ROOM_FAIL,
    DELETE_ROOM_REQUEST, DELETE_ROOM_SUCCESS, DELETE_ROOM_FAIL,
    CLEAR_ROOMS
} from '../constants/room';

const initialState = {
    rooms: [],
    hasMore: true,
    loading: false,

    creatingRoom: false
};

const room = (state=initialState, action) => {
    switch (action.type) {
        case GET_ROOMS_REQUEST:
            return { ...state, loading: true };
        case GET_ROOMS_SUCCESS:
            const roomsPage = action.payload;
            const rooms = state.rooms.slice().concat(roomsPage);
            return { ...state, loading: false, rooms, hasMore: !!roomsPage.length };
        case GET_ROOMS_FAIL:
            return { ...state, loading: false, hasMore: false };
        case CREATE_ROOM_REQUEST:
            return { ...state, creatingRoom: true };
        case CREATE_ROOM_SUCCESS:
            return { ...state, creatingRoom: false };
        case CREATE_ROOM_FAIL:
            return { ...state, creatingRoom: false };
        case CLEAR_ROOMS:
            return initialState;
        default:
            return state;
    }
}

export default room;
