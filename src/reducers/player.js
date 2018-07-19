import {
    SET_PLAYER_PLAYLIST, SET_VISIBILITY, CLEAR_PLAYER_PLAYLIST,
    SET_NOW_PLAYING, CLEAR_PLAYER_TRACK,
    GET_PLAYER_TRACK_SUCCESS,
    SEND_COMMAND, RECEIVE_COMMAND
} from '../constants/player';

const initialState = {
    playerPlaylist: null,
    visible: false,
    nowPlaying: null,

    track: null,
    trackFilename: null,

    command: {},
    commandReceived: false,

    disabled: false
};

const player = (state=initialState, action) => {
    switch (action.type) {
        case SET_VISIBILITY:
            return { ...state, visible: action.payload };
        case SET_PLAYER_PLAYLIST:
            return { ...state, playerPlaylist: action.payload };
        case CLEAR_PLAYER_PLAYLIST:
            return { ...state, playerPlaylist: null };
        case SET_NOW_PLAYING:
            return { ...state, nowPlaying: action.payload };
        case GET_PLAYER_TRACK_SUCCESS:
            const { track, trackFilename } = action.payload;
            return { ...state, track, trackFilename };
        case CLEAR_PLAYER_TRACK:
            return { ...state, track: null, trackFilename: null };
        case SEND_COMMAND: {
            const command = action.payload;
            return { ...state, command, commandReceived: true };
        }
        case RECEIVE_COMMAND:
            return { ...state, command: {}, commandReceived: false };
        default:
            return state;
    }
}

export default player;
