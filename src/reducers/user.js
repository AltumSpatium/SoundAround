import {
    GET_USER_REQUEST, GET_USER_SUCCESS, GET_USER_FAIL,
    UPDATE_USER_REQUEST, UPDATE_USER_SUCCESS, UPDATE_USER_FAIL,
    DELETE_USER_REQUEST, DELETE_USER_SUCCESS, DELETE_USER_FAIL
} from '../constants/user';
import {
    CREATE_PLAYLIST_SUCCESS, DELETE_PLAYLIST_SUCCESS, ADD_PLAYLIST
} from '../constants/playlist';
import {
    CREATE_ROOM_SUCCESS, USER_ENTERED_ROOM, USER_EXITED_ROOM,
    KICK_USER
} from '../constants/room';
import {
    ADD_TRACK, DELETE_TRACK_SUCCESS, UPLOAD_TRACK_SUCCESS
} from '../constants/music';

const initialState = {
    isFetching: false,
    currentUser: null
};

const user = (state=initialState, action) => {
    switch (action.type) {
        case GET_USER_REQUEST:
        case UPDATE_USER_REQUEST:
        case DELETE_USER_REQUEST:
            return { ...state, isFetching: true };
        case GET_USER_SUCCESS:
        case UPDATE_USER_SUCCESS:
            return { ...state, isFetching: false, currentUser: action.payload };
        case DELETE_USER_SUCCESS:
            return { ...state, isFetching: false, currentUser: null };
        case GET_USER_FAIL:
        case UPDATE_USER_FAIL:
        case DELETE_USER_FAIL:
            return { ...state, isFetching: false };
        case CREATE_PLAYLIST_SUCCESS: {
            const currentUser = { ...state.currentUser };
            currentUser.playlists.push(action.payload);
            return { ...state, currentUser };
        }
        case UPLOAD_TRACK_SUCCESS: {
            const currentUser = { ...state.currentUser };
            currentUser.tracks.push(action.payload);
            return { ...state, currentUser };
        }
        case DELETE_PLAYLIST_SUCCESS: {
            const currentUser = { ...state.currentUser };
            const deletedPlaylistIndex = currentUser.playlists.indexOf(action.payload);
            currentUser.playlists.splice(deletedPlaylistIndex, 1);
            return { ...state, currentUser };
        }
        case CREATE_ROOM_SUCCESS: {
            const currentUser = { ...state.currentUser };
            currentUser.rooms.push(action.payload);
            return { ...state, currentUser };
        }
        case DELETE_TRACK_SUCCESS: {
            const currentUser = { ...state.currentUser };
            currentUser.tracks.splice(currentUser.tracks.indexOf(action.payload), 1);
            return { ...state, currentUser };
        }
        case USER_ENTERED_ROOM: {
            const currentUser = { ...state.currentUser };
            currentUser.currentRoom = action.payload.roomId;
            return { ...state, currentUser };
        }
        case USER_EXITED_ROOM: {
            const currentUser = { ...state.currentUser };
            currentUser.currentRoom = null;
            return { ...state, currentUser };
        }
        case KICK_USER: {
            const currentUser = { ...state.currentUser };
            if (currentUser.username !== action.payload) return state;
            currentUser.currentRoom = null;
            return { ...state, currentUser };
        }
        case ADD_TRACK: {
            const currentUser = { ...state.currentUser };
            currentUser.tracks.push(action.payload);
            return { ...state, currentUser };
        }
        case ADD_PLAYLIST: {
            const currentUser = { ...state.currentUser };
            currentUser.playlists.push(action.payload);
            return { ...state, currentUser };
        }
        default:
            return state;
    }
};

export default user;
