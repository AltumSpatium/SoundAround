import {
    GET_MUSIC_PAGE_REQUEST, GET_MUSIC_PAGE_SUCCESS, GET_MUSIC_PAGE_FAIL,
    GET_TRACK_REQUEST, GET_TRACK_SUCCESS, GET_TRACK_FAIL,
    UPLOAD_TRACK_REQUEST, UPLOAD_TRACK_SUCCESS, UPLOAD_TRACK_FAIL,
    UPDATE_TRACK_REQUEST, UPDATE_TRACK_SUCCESS, UPDATE_TRACK_FAIL,
    DELETE_TRACK_REQUEST, DELETE_TRACK_SUCCESS, DELETE_TRACK_FAIL,
    CLEAR_MUSIC_LIST, SET_MUSIC_TRACKLIST, CLEAR_TRACK
} from '../constants/music';

const initialState = {
    tracks: [],
    isFetching: false,
    hasMore: true,
    isUploadingAudio: false,

    track: null,
    trackFilename: null,
    loadingTrack: false
};

const music = (state=initialState, action) => {
    switch (action.type) {
        case GET_MUSIC_PAGE_REQUEST:
            return { ...state, isFetching: true };
        case GET_MUSIC_PAGE_SUCCESS:
            const tracksPage = action.payload;
            const tracks = state.tracks.concat(tracksPage);
            return { ...state, tracks, isFetching: false, hasMore: !!tracksPage.length };
        case GET_MUSIC_PAGE_FAIL:
            return { ...state, isFetching: false };
        case GET_TRACK_REQUEST:
            return { ...state, loadingTrack: true };
        case GET_TRACK_SUCCESS:
            const { track, trackFilename } = action.payload;
            return { ...state, loadingTrack: false, track, trackFilename };
        case GET_TRACK_FAIL:
            return { ...state, loadingTrack: false };
        case CLEAR_MUSIC_LIST:
            return { ...initialState, track: state.track, trackFilename: state.trackFilename };
        case CLEAR_TRACK:
            return { ...state, track: null, trackFilename: null };
        case UPLOAD_TRACK_REQUEST:
            return { ...state, isUploadingAudio: true };
        case UPLOAD_TRACK_SUCCESS:
            return { ...state, isUploadingAudio: false };
        case UPLOAD_TRACK_FAIL:
            return { ...state, isUploadingAudio: false };
        case UPDATE_TRACK_REQUEST:
            return state;
        case UPDATE_TRACK_SUCCESS:
            const updatedTrack = action.payload;
            const updatedTracks = state.tracks.map(
                track => track.trackId === updatedTrack.trackId ? updatedTrack : track);
            return { ...state, tracks: updatedTracks };
        case UPDATE_TRACK_FAIL:
            return state;
        case DELETE_TRACK_REQUEST:
            return state;
        case DELETE_TRACK_SUCCESS:
            const trackId = action.payload;
            return { ...state, tracks: state.tracks.filter(track => track._id !== trackId) };
        case DELETE_TRACK_FAIL:
            return state;
        case SET_MUSIC_TRACKLIST:
            return { ...state, tracks: action.payload };
        default:
            return state;
    }
};

export default music;
