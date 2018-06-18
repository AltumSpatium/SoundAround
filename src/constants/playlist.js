import React from 'react';
import * as QueueMusic from 'react-icons/lib/md/queue-music';

export const GET_PLAYLIST_REQUEST = 'GET_PLAYLIST_REQUEST';
export const GET_PLAYLIST_SUCCESS = 'GET_PLAYLIST_SUCCESS';
export const GET_PLAYLIST_FAIL = 'GET_PLAYLIST_FAIL';

export const GET_PLAYLISTS_REQUEST = 'GET_PLAYLISTS_REQUEST';
export const GET_PLAYLISTS_SUCCESS = 'GET_PLAYLISTS_SUCCESS';
export const GET_PLAYLISTS_FAIL = 'GET_PLAYLISTS_FAIL';

export const GET_PLAYLIST_PAGE_REQUEST = 'GET_PLAYLIST_PAGE_REQUEST';
export const GET_PLAYLIST_PAGE_SUCCESS = 'GET_PLAYLIST_PAGE_SUCCESS';
export const GET_PLAYLIST_PAGE_FAIL = 'GET_PLAYLIST_PAGE_FAIL';

export const CLEAR_PLAYLIST = 'CLEAR_PLAYLIST';
export const CLEAR_PLAYLIST_PAGE = 'CLEAR_PLAYLIST_PAGE';

export const sortOptions = [
    { title: 'By default', value: 'createdDate' },
    { title: 'By update date', value: 'lastUpdatedDate' },
    { title: 'By title', value: 'title' },
    { title: 'By duration', value: 'duration' },
    { title: 'By tracks count', value: 'tracksCount' },
    { title: 'Randomly', value: 'random' },
    { title: 'Reversed', value: 'reversed' }
];

export const CREATE_PLAYLIST_REQUEST = 'CREATE_PLAYLIST_REQUEST';
export const CREATE_PLAYLIST_SUCCESS = 'CREATE_PLAYLIST_SUCCESS';
export const CREATE_PLAYLIST_FAIL = 'CREATE_PLAYLIST_FAIL';

export const UPDATE_PLAYLIST_REQUEST = 'UPDATE_PLAYLIST_REQUEST';
export const UPDATE_PLAYLIST_SUCCESS = 'UPDATE_PLAYLIST_SUCCESS';
export const UPDATE_PLAYLIST_FAIL = 'UPDATE_PLAYLIST_FAIL';

export const DELETE_PLAYLIST_REQUEST = 'DELETE_PLAYLIST_REQUEST';
export const DELETE_PLAYLIST_SUCCESS = 'DELETE_PLAYLIST_SUCCESS';
export const DELETE_PLAYLIST_FAIL = 'DELETE_PLAYLIST_FAIL';

export const SET_PLAYLIST_TRACKLIST = 'SET_PLAYLIST_TRACKLIST';

export const defaultPlaylistPicture = <div className="default-playlist-icon"><QueueMusic /></div>;

export const ADD_PLAYLIST = 'ADD_PLAYLIST';