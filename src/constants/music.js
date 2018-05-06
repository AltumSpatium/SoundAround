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
