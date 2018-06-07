import {
    GET_PLAYLIST_REQUEST, GET_PLAYLIST_SUCCESS, GET_PLAYLIST_FAIL,
    GET_PLAYLISTS_REQUEST, GET_PLAYLISTS_SUCCESS, GET_PLAYLISTS_FAIL,
    GET_PLAYLIST_PAGE_REQUEST, GET_PLAYLIST_PAGE_SUCCESS, GET_PLAYLIST_PAGE_FAIL,
    CREATE_PLAYLIST_REQUEST, CREATE_PLAYLIST_SUCCESS, CREATE_PLAYLIST_FAIL,
    UPDATE_PLAYLIST_REQUEST, UPDATE_PLAYLIST_SUCCESS, UPDATE_PLAYLIST_FAIL,
    DELETE_PLAYLIST_REQUEST, DELETE_PLAYLIST_SUCCESS, DELETE_PLAYLIST_FAIL,
    CLEAR_PLAYLIST, SET_PLAYLIST_TRACKLIST
} from '../constants/playlist';

const initialState = {
    playlist: null,
    loadingPlaylist: false,

    playlists: [],
    loadingPlaylists: false,
    hasMorePlaylists: true,

    tracks: [],
    isFetching: false,
    hasMore: true,

    saving: false
};

const playlist = (state=initialState, action) => {
    switch (action.type) {
        case GET_PLAYLIST_REQUEST:
            return { ...state, loadingPlaylist: true };
        case GET_PLAYLIST_SUCCESS:
            return { ...state, loadingPlaylist: false, playlist: action.payload };
        case GET_PLAYLIST_FAIL:
            return { ...state, loadingPlaylist: false };
        case GET_PLAYLIST_PAGE_REQUEST:
            return { ...state, isFetching: true };
        case GET_PLAYLIST_PAGE_SUCCESS:
            const playlistPage = action.payload;
            const playlistTracks = state.tracks.concat(playlistPage);
            return { ...state, tracks: playlistTracks, isFetching: false, hasMore: !!playlistPage.length };
        case GET_PLAYLIST_PAGE_FAIL:
            return { ...state, isFetching: false, hasMore: false };
        case CREATE_PLAYLIST_REQUEST:
            return { ...state, saving: true };
        case CREATE_PLAYLIST_SUCCESS:
        case CREATE_PLAYLIST_FAIL:
            return { ...state, saving: false };
        case UPDATE_PLAYLIST_REQUEST:
            return { ...state, saving: true };
        case UPDATE_PLAYLIST_SUCCESS:
        case UPDATE_PLAYLIST_FAIL:
            return { ...state, saving: false };
        case DELETE_PLAYLIST_REQUEST:
            return { ...state, isFetching: true };
        case DELETE_PLAYLIST_SUCCESS:
        case DELETE_PLAYLIST_FAIL:
        return { ...state, isFetching: false };
        case CLEAR_PLAYLIST:
            return { ...initialState };
        case SET_PLAYLIST_TRACKLIST:
            const playlist = { ...state.playlist, tracks: action.payload.map(t => t._id) };
            return { ...state, tracks: action.payload, playlist };
        default:
            return state;
    }
}

export default playlist;
