import {
    GET_MUSIC_PAGE_REQUEST, GET_MUSIC_PAGE_SUCCESS, GET_MUSIC_PAGE_FAIL,
    CLEAR_MUSIC_LIST
} from '../constants/music';

const initialState = {
    tracks: [],
    isFetching: false,
    hasMore: true
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
        case CLEAR_MUSIC_LIST:
            return { ...initialState };
        default:
            return state;
    }
};

export default music;
