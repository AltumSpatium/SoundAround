import React, { Component } from 'react';
import moment from 'moment';
import { Button, Icon, List, Spin, Modal } from 'antd';
import InfiniteScroll from 'react-infinite-scroller';
import { createPicture, beautifyDuration } from '../../util/trackUtil';
import { defaultPlaylistPicture } from '../../constants/playlist';
import * as MdAccessTime from 'react-icons/lib/md/access-time';
import * as MdMusicNote from 'react-icons/lib/md/music-note';

class PlaylistView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            page: 1
        };

        this.loadMore = this.loadMore.bind(this);
        this.renderListItem = this.renderListItem.bind(this);
    }

    loadMore() {
        const { page } = this.state;
        this.props.loadMore(page);
        this.setState({ page: page + 1 });
    }

    renderListItem(track) {
        return (
            <List.Item key={track._id}>
                {track.artist} - {track.title}
            </List.Item>
        );
    }

    componentWillReceiveProps(nextProps) {
        if (this.props.playlist && !nextProps.playlist) {
            this.setState({ page: 1 });
        }

        if (!this.props.isVisible && nextProps.isVisible) {
            this.loadMore();
        }
    }

    render() {
        const {
            onCloseView, isVisible, tracks, loading, hasMore,
            currentUser
        } = this.props;
        const playlist = this.props.playlist || {};

        const tracksCount = tracks.length;
        const totalDuration = beautifyDuration(tracks.reduce((p, c) => p + c.duration, 0));

        return (
            <Modal
                title={playlist.title}
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
                                    <div className='music-page__no-tracks'>No tracks</div>
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
