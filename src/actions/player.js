import {
    SET_PLAYER_PLAYLIST, SET_VISIBILITY, CLEAR_PLAYER_PLAYLIST,
    SET_NOW_PLAYING, CLEAR_PLAYER_TRACK,
    GET_PLAYER_TRACK_REQUEST, GET_PLAYER_TRACK_SUCCESS, GET_PLAYER_TRACK_FAIL,
    SEND_COMMAND, RECEIVE_COMMAND
} from '../constants/player';
import {
    request, success, fail, callAPI, createAction
} from './default';

const setVisibilitySuccess = success(SET_VISIBILITY);
export const setVisibility = createAction(setVisibilitySuccess);

const setPlayerPlaylistSuccess = success(SET_PLAYER_PLAYLIST);
export const setPlayerPlaylist = createAction(setPlayerPlaylistSuccess);

const clearPlayerPlaylistRequest = request(CLEAR_PLAYER_PLAYLIST);
export const clearPlayerPlaylist = createAction(clearPlayerPlaylistRequest);

const setNowPlayingSuccess = success(SET_NOW_PLAYING);
export const setNowPlaying = createAction(setNowPlayingSuccess);

const getPlayerTrackRequest = request(GET_PLAYER_TRACK_REQUEST);
const getPlayerTrackSuccess = success(GET_PLAYER_TRACK_SUCCESS);
const getPlayerTrackFail = fail(GET_PLAYER_TRACK_FAIL);

export const getPlayerTrack = trackId => {
    return callAPI({
        url: `/api/music/track/${trackId}`,
        params: {
            headers: {
                'x-access-token': localStorage.getItem('sa_token')
            }
        },
        requestAction: getPlayerTrackRequest,
        successAction: getPlayerTrackSuccess,
        failAction: getPlayerTrackFail
    });
};

const clearPlayerRequest = request(CLEAR_PLAYER_TRACK);
export const clearPlayerTrack = createAction(clearPlayerRequest);

const sendCommandSuccess = success(SEND_COMMAND);
export const sendCommand = createAction(sendCommandSuccess);

const receiveCommandRequest = request(RECEIVE_COMMAND);
export const receiveCommand = createAction(receiveCommandRequest);
