import React from 'react';
import * as TiNotes from 'react-icons/lib/ti/notes';

export const beautifyDuration = duration => {
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration) - minutes * 60;
    return `${minutes}:${seconds}`;
};

export const createAlbumCover = picture => {
    if (!picture) return <div className='default-album-cover'><TiNotes /></div>;
    const rawPicture = new Buffer(picture.data.data);
    return (
        <img src={`data:image/jpeg;base64,${rawPicture.toString('base64')}`} alt='Album cover' />
    );
};