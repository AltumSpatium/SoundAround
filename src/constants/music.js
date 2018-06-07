export const GET_MUSIC_PAGE_REQUEST = 'GET_MUSIC_PAGE_REQUEST';
export const GET_MUSIC_PAGE_SUCCESS = 'GET_MUSIC_PAGE_SUCCESS';
export const GET_MUSIC_PAGE_FAIL = 'GET_MUSIC_PAGE_FAIL';

export const CLEAR_MUSIC_LIST = 'CLEAR_MUSIC_LIST';

export const sortOptions = [
    { title: 'By default', value: 'uploadDate' },
    { title: 'By title', value: 'title' },
    { title: 'By artist', value: 'artist' },
    { title: 'Randomly', value: 'random' },
    { title: 'Reversed', value: 'reversed' }
];

export const groupByOptions = [
    { title: 'Track', value: 'track' },
    { title: 'Album', value: 'album' },
    { title: 'Artist', value: 'artist' },
    { title: 'Upload date', value: 'uploadDate' }
];

export const UPLOAD_TRACK_REQUEST = 'UPLOAD_TRACK_REQUEST';
export const UPLOAD_TRACK_SUCCESS = 'UPLOAD_TRACK_SUCCESS';
export const UPLOAD_TRACK_FAIL = 'UPLOAD_TRACK_FAIL';

export const UPDATE_TRACK_REQUEST = 'UPDATE_TRACK_REQUEST';
export const UPDATE_TRACK_SUCCESS = 'UPDATE_TRACK_SUCCESS';
export const UPDATE_TRACK_FAIL = 'UPDATE_TRACK_FAIL';

export const DELETE_TRACK_REQUEST = 'DELETE_TRACK_REQUEST';
export const DELETE_TRACK_SUCCESS = 'DELETE_TRACK_SUCCESS';
export const DELETE_TRACK_FAIL = 'DELETE_TRACK_FAIL';

export const SET_MUSIC_TRACKLIST = 'SET_MUSIC_TRACKLIST';
