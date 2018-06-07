import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List, Spin } from 'antd';
import InfiniteScroll from 'react-infinite-scroller';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';
import PlaylistTrack from './PlaylistTrack';

class PlaylistMain extends Component {
    getListStyle(isDraggingOver) {
        return {
            outline: isDraggingOver ? '1px dashed lightblue' : '',
            padding: 8, overflow: 'auto', height: '200px'
        };
    }

    createTrackList({ tracklistId, tracks, loading, hasMore, loadMore }) {
        return (
            <Droppable
                droppableId={tracklistId}
                direction='vertical'>
                {(provided, snapshot) => (
                    <div
                        className='playlist-page__track-list'
                        ref={provided.innerRef}
                        style={this.getListStyle(snapshot.isDraggingOver)}>
                        <InfiniteScroll
                            initialLoad={true}
                            pageStart={0}
                            hasMore={!loading && hasMore}
                            loadMore={loadMore}>
                            <List
                                dataSource={tracks}
                                renderItem={(track, index) => (
                                    <PlaylistTrack
                                        key={track._id}
                                        track={track}
                                        index={index}
                                        tracklistId={tracklistId} />
                                )}>
                                {loading && hasMore && (
                                    <div className="loading-container">
                                        <Spin size='small' />
                                    </div>
                                )}
                                {!loading && !hasMore && !tracks.length && (
                                    <div className="playlist-page__no-tracks">
                                    </div>
                                )}
                            </List>
                        </InfiniteScroll>
                    </div>
                )}
            </Droppable>
        );
    }

    render() {
        const {
            onDragEnd, loadMore,
            musicTracks, musicHasMore, musicLoading,
            playlistTracks, playlistHasMore, playlistLoading
        } = this.props;

        const musicTracklistOptions = {
            tracklistId: 'musicTracklist',
            tracks: musicTracks,
            loading: musicLoading,
            hasMore: musicHasMore,
            loadMore: () => loadMore('music')
        };

        const playlistTracklistOptions = {
            tracklistId: 'playlistTracklist',
            tracks: playlistTracks,
            loading: playlistLoading,
            hasMore: playlistHasMore,
            loadMore: () => loadMore('playlist')
        };

        return (
            <DragDropContext onDragEnd={onDragEnd}>
                <div>
                    <p>Playlist</p>
                    {this.createTrackList(playlistTracklistOptions)}
                </div>
                <div>
                    <p>Tracks</p>
                    {this.createTrackList(musicTracklistOptions)}
                </div>
            </DragDropContext>
        );
    }
}

PlaylistMain.propTypes = {
    onDragEnd: PropTypes.func.isRequired,
    loadMore: PropTypes.func.isRequired,

    musicTracks: PropTypes.array.isRequired,
    musicHasMore: PropTypes.bool.isRequired,
    musicLoading: PropTypes.bool.isRequired,

    playlistTracks: PropTypes.array.isRequired,
    playlistHasMore: PropTypes.bool.isRequired,
    playlistLoading: PropTypes.bool.isRequired
};

export default PlaylistMain;
