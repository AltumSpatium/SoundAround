import React, { Component } from 'react';
import { Draggable } from 'react-beautiful-dnd';
import PropTypes from 'prop-types';
import TrackPiece from '../shared/TrackPiece';

const PlaylistTrack = props => {
    const { track, index, tracklistId } = props;
    const getTrackStyle = (isDragging, draggableStyle) => ({
        userSelect: 'none',
        margin: `0 0 ${8}px 0`,
        backgroundColor: isDragging ? 'rgb(25, 118, 210, 0.2)' : 'white',
        ...draggableStyle
    });

    return (
        <Draggable
            draggableId={tracklistId + track._id}
            index={index}>
            {(provided, snapshot) => (
                <div
                    className='track-piece-wrapper'
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    style={getTrackStyle(snapshot.isDragging, provided.draggableProps.style)}>
                    <TrackPiece track={track} />
                </div>
            )}
        </Draggable>
    );
}

PlaylistTrack.propTypes = {
    track: PropTypes.object.isRequired,
    index: PropTypes.number.isRequired,
    tracklistId: PropTypes.string.isRequired
};

export default PlaylistTrack;
