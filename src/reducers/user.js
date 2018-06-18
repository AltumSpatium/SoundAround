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
        case CREATE_PLAYLIST_SUCCESS:
            const userCreatedPlaylist = { ...state.currentUser };
            userCreatedPlaylist.playlists.push(action.payload);
            return { ...state, currentUser: userCreatedPlaylist };
        case UPLOAD_TRACK_SUCCESS:
            const userUploadedTrack = { ...state.currentUser };
            userUploadedTrack.tracks.push(action.payload);
            return { ...state, currentUser: userUploadedTrack };
        case DELETE_PLAYLIST_SUCCESS:
            const userDeletedPlaylist = { ...state.currentUser };
            const deletedPlaylistIndex = userDeletedPlaylist.playlists.indexOf(action.payload);
            userDeletedPlaylist.playlists.splice(deletedPlaylistIndex, 1);
            return { ...state, currentUser: userDeletedPlaylist };
        case CREATE_ROOM_SUCCESS:
            const userCreatedRoom = { ...state.currentUser };
            userCreatedRoom.rooms.push(action.payload);
            return { ...state, currentUser: userCreatedRoom };
        case DELETE_TRACK_SUCCESS:
            const userDeletedTrack = { ...state.currentUser };
            userDeletedTrack.tracks.splice(userDeletedTrack.tracks.indexOf(action.payload), 1);
            return { ...state, currentUser: userDeletedTrack };
        case USER_ENTERED_ROOM:
            const userEnteredRoom = { ...state.currentUser };
            userEnteredRoom.currentRoom = action.payload.roomId;
            return { ...state, currentUser: userEnteredRoom };
        case USER_EXITED_ROOM:
            const userExitedRoom = { ...state.currentUser };
            userExitedRoom.currentRoom = null;
            return { ...state, currentUser: userExitedRoom };
        case KICK_USER:
            const userKick = { ...state.currentUser };
            if (userKick.username !== action.payload) return state;
            userKick.currentRoom = null;
            return { ...state, currentUser: userKick };
        case ADD_TRACK:
            const userAddTrack = { ...state.currentUser };
            userAddTrack.tracks.push(action.payload);
            return { ...state, currentUser: userAddTrack };
        case ADD_PLAYLIST:
            const userAddPlaylist = { ...state.currentUser };
            userAddPlaylist.playlists.push(action.payload);
            return { ...state, currentUser: userAddPlaylist };
        default:
            return state;
    }
};

export default user;
