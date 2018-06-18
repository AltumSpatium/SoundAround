import {
    GET_ROOMS_REQUEST, GET_ROOMS_SUCCESS, GET_ROOMS_FAIL,
    GET_ROOM_REQUEST, GET_ROOM_SUCCESS, GET_ROOM_FAIL,
    CREATE_ROOM_REQUEST, CREATE_ROOM_SUCCESS, CREATE_ROOM_FAIL,
    UPDATE_ROOM,
    DELETE_ROOM_REQUEST, DELETE_ROOM_SUCCESS, DELETE_ROOM_FAIL,
    GET_ROOM_PLAYLIST_REQUEST, GET_ROOM_PLAYLIST_SUCCESS, GET_ROOM_PLAYLIST_FAIL,
    CLEAR_ROOMS,
    USER_ENTERED_ROOM, USER_EXITED_ROOM, RECEIVE_MESSAGE,
    KICK_USER
} from '../constants/room';
import {
    CLEAR_PLAYLIST
} from '../constants/playlist';

const initialState = {
    rooms: [],
    hasMore: true,
    loading: false,

    creatingRoom: false,

    room: null,
    enteringRoom: false,

    roomPlaylistTracks: [],
    loadingRoomPlaylistTracks: false
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
        case GET_ROOM_REQUEST:
            return { ...state, enteringRoom: true };
        case GET_ROOM_SUCCESS:
            return { ...state, enteringRoom: false, room: action.payload };
        case GET_ROOM_FAIL:
        return { ...state, enteringRoom: false };
        case CREATE_ROOM_REQUEST:
            return { ...state, creatingRoom: true };
        case CREATE_ROOM_SUCCESS:
            return { ...state, creatingRoom: false };
        case CREATE_ROOM_FAIL:
            return { ...state, creatingRoom: false };
        case DELETE_ROOM_REQUEST:
            return state;
        case DELETE_ROOM_SUCCESS:
            const roomsDelete = state.rooms.slice();
            const roomIndex = roomsDelete.map(room => room._id).indexOf(action.payload);
            roomsDelete.splice(roomIndex, 1);
            return { ...state, rooms: roomsDelete };
        case DELETE_ROOM_FAIL:
            return state;
        case CLEAR_ROOMS:
            return initialState;
        case GET_ROOM_PLAYLIST_REQUEST:
            return { ...state, loadingRoomPlaylistTracks: true };
        case GET_ROOM_PLAYLIST_SUCCESS:
            return { ...state, loadingRoomPlaylistTracks: false, roomPlaylistTracks: action.payload };
        case GET_ROOM_PLAYLIST_FAIL:
            return { ...state, loadingRoomPlaylistTracks: false };
        case USER_ENTERED_ROOM:
            const roomEnter = { ...state.room };
            if (roomEnter.usersOnline) roomEnter.usersOnline.push(action.payload.username);
            return { ...state, room: roomEnter };
        case USER_EXITED_ROOM:
            if (!state.room) return state;
            const roomExit = { ...state.room };
            if (roomExit.usersOnline) roomExit.usersOnline.splice(roomExit.usersOnline.indexOf(action.payload.username), 1);
            return { ...state, room: roomExit };
        case RECEIVE_MESSAGE:
            const roomMsg = { ...state.room };
            roomMsg.messages.push(action.payload);
            return { ...state, room: roomMsg };
        case KICK_USER:
            const roomKick = { ...state.room };
            roomKick.usersOnline.splice(roomKick.usersOnline.indexOf(action.payload), 1);
            return { ...state, room: roomKick };
        case UPDATE_ROOM:
            return { ...state, room: action.payload };
        case CLEAR_PLAYLIST:
            return { ...state, roomPlaylistTracks: [], loadingRoomPlaylistTracks: false };
        default:
            return state;
    }
}

export default room;
