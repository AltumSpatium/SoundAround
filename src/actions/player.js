import {
    SET_PLAYER_PLAYLIST, SET_VISIBILITY, CLEAR_PLAYER_PLAYLIST,
    SET_NOW_PLAYING, CLEAR_PLAYER_TRACK,
    GET_PLAYER_TRACK_REQUEST, GET_PLAYER_TRACK_SUCCESS, GET_PLAYER_TRACK_FAIL
} from '../constants/player';
import {
    request, success, fail, callAPI
} from './default';

const setVisibilitySuccess = success(SET_VISIBILITY);

export const setVisibility = visible => async dispatch => dispatch(setVisibilitySuccess(visible));

const setPlayerPlaylistSuccess = success(SET_PLAYER_PLAYLIST);

export const setPlayerPlaylist = playlist => async dispatch => dispatch(setPlayerPlaylistSuccess(playlist));

const clearPlayerPlaylistRequest = request(CLEAR_PLAYER_PLAYLIST);

export const clearPlayerPlaylist = () => async dispatch => dispatch(clearPlayerPlaylistRequest());

const setNowPlayingSuccess = success(SET_NOW_PLAYING);

export const setNowPlaying = trackId => async dispatch => dispatch(setNowPlayingSuccess(trackId));

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

export const clearPlayerTrack = () => async dispatch => dispatch(clearPlayerRequest());
