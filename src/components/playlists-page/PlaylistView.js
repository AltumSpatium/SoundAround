import React, { Component } from 'react';
import moment from 'moment';
import { Button, List, Spin, Modal } from 'antd';
import InfiniteScroll from 'react-infinite-scroller';
import { createPicture, beautifyDuration } from '../../util/trackUtil';
import { defaultPlaylistPicture } from '../../constants/playlist';
import * as MdAccessTime from 'react-icons/lib/md/access-time';
import * as MdMusicNote from 'react-icons/lib/md/music-note';
import TrackPiece from '../shared/TrackPiece';

class PlaylistView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            page: 1
        };

        this.loadMore = this.loadMore.bind(this);
        this.renderListItem = this.renderListItem.bind(this);
        this.listenPlaylist = this.listenPlaylist.bind(this);
    }

    loadMore() {
        const { page } = this.state;
        this.props.loadMore(page);
        this.setState({ page: page + 1 });
    }

    renderListItem(track) {
        return (
            <List.Item key={track._id}>
                <div className="playlist-view__track-piece-wrapper">
                    <TrackPiece track={track} />
                </div>
            </List.Item>
        );
    }

    componentWillReceiveProps(nextProps) {
        if (!this.props.isVisible && nextProps.isVisible) {
            this.loadMore();
        }
    }

    listenPlaylist() {

    }

    render() {
        const {
            onCloseView, isVisible, tracks, loading, hasMore,
            currentUser, editPlaylist
        } = this.props;
        const playlist = this.props.playlist || {};

        const tracksCount = tracks.length;
        const totalDuration = beautifyDuration(tracks.reduce((p, c) => p + c.duration, 0));

        const onAddClick = () => editPlaylist(playlist._id);

        return (
            <Modal
                wrapClassName='playlist-view'
                afterClose={() => this.setState({ page: 1 })}
                title={<div className='playlist-view__title'>{playlist.title}</div>}
                style={{ top: 20 }}
                width={600}
                onCancel={onCloseView}
                visible={isVisible}
                footer={[
                    <div className="playlists-page__playlist-view__footer">
                        <InfiniteScroll
                            initialLoad={false}
                            pageStart={0}
                            loadMore={this.loadMore}
                            hasMore={!loading && hasMore}>
                            <List
                                dataSource={tracks}
                                renderItem={this.renderListItem}>
                                {loading && hasMore && (
                                    <div className="loading-container">
                                        <Spin size='small' />
                                    </div>
                                )}
                                {!loading && !hasMore && !tracks.length && (
                                    <div className='playlist-view__no-tracks'>
                                        <Button onClick={onAddClick} className='sa-btn'>Add tracks</Button>
                                    </div>
                                )}
                            </List>
                        </InfiniteScroll>
                    </div>
                ]}>
                <div className="playlists-page__playlist-view__header">
                    <div className="playlist-view__playlist-picture">
                        {createPicture(playlist.playlistPicture, defaultPlaylistPicture)}
                    </div>
                    <div className="playlist-view__playlist-info">
                        {currentUser && currentUser._id !== playlist.authorId && (
                            <div>Author: {playlist.authorUsername}</div>
                        )}
                        <div className="playlist-view__playlist-dates">
                            <div><span>Created:</span> {moment(playlist.createdDate).format('DD.MM.YYYY')}</div>
                            <div><span>Updated:</span> {moment(playlist.lastUpdatedDate).format('DD.MM.YYYY')}</div>
                        </div>
                        <Button onClick={this.listenPlaylist} className='sa-btn playlist-view__btn-listen'>Listen</Button>
                        <div className="playlist-view__tracks-info">
                            {
                                <span title={`Tracks count: ${tracksCount}`}>
                                    <MdMusicNote /> {tracksCount}
                                </span>
                            }
                            {
                                <span title={`Total duration: ${totalDuration} min.`}>
                                    <MdAccessTime /> {totalDuration}
                                </span>
                            }
                        </div>
                    </div>
                    <div style={{clear: 'both'}}></div>
                </div>
            </Modal>
        );
    }
}

export default PlaylistView;
