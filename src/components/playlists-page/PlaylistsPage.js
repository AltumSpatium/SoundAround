import React, { Component } from 'react';
import { Button, Select, Icon, List, Spin } from 'antd';
import InfiniteScroll from 'react-infinite-scroller';
import Playlist from './Playlist';
import DeletePlaylistModal from './DeletePlaylistModal';
import PlaylistView from './PlaylistView';
import { connect } from 'react-redux';
import { sortOptions } from '../../constants/playlist';
import {
    getPlaylists, getPlaylistPage, deletePlaylist, clearPlaylist,
    clearPlaylistPage
} from '../../actions/playlist';

import '../../styles/PlaylistsPage.css';

class PlaylistsPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            page: 1,

            sort: 'createdDate',
            orderBy: 'createdDate',
            orderType: 'desc',

            openModal: false,
            deleteModal: false,

            chosenPlaylist: null
        };

        this.onChangeSort = this.onChangeSort.bind(this);
        this.loadMore = this.loadMore.bind(this);
        this.loadMorePlaylists = this.loadMorePlaylists.bind(this);
        this.renderListItem = this.renderListItem.bind(this);
        this.createPlaylist = this.createPlaylist.bind(this);
        this.editPlaylist = this.editPlaylist.bind(this);
        this.deletePlaylist = this.deletePlaylist.bind(this);
    }

    onChangeSort(value) {
        let orderBy, orderType;
        switch (value) {
            case 'title':
                orderBy = 'title';
                orderType = 'asc';
                break;
            case 'lastUpdateDate':
                orderBy = 'lastUpdateDate';
                orderType = 'desc';
                break;
            case 'duration':
                orderBy = 'duration';
                orderType = 'desc';
                break;
            case 'tracksCount':
                orderBy = 'tracksCount';
                orderType = 'desc';
                break;
            case 'random':
                orderBy = 'random';
                orderType = 'desc';
                break;
            case 'reversed':
                orderBy = 'createdDate';
                orderType = 'asc'
                break;
            case 'createdDate':
            default:
                orderBy = 'createdDate';
                orderType = 'desc';
                break;
        }
        this.setState({sort: value, orderType, orderBy, page: 1});
        this.props.clearPlaylist();
    }

    componentWillUnmount() {
        this.props.clearPlaylist();
    }

    hideModal = (modalName, cb, timeout=0) => {
        const hide = () => this.setState({ [modalName]: false }, cb ? cb : () => {});
        if (timeout > 0) {
            setTimeout(() => {
                hide();
            }, timeout);
        } else hide();
    }
    showModal = (modalName, cb) => this.setState({ [modalName]: true }, cb ? cb : () => {})

    createPlaylist() {
        this.props.history.push('/playlists/add');
    }

    editPlaylist(playlistId) {
        this.props.history.push(`/playlists/edit/${playlistId}`);
    }

    deletePlaylist(playlistId) {
        this.hideModal('deleteModal', () => this.setState({ chosenPlaylist: null }));
        const { currentUser, deletePlaylist } = this.props;
        deletePlaylist(currentUser.username, playlistId);
    }

    loadMore() {
        const { page, orderBy, orderType } = this.state;
        const { getPlaylists, currentUser } = this.props;
        if (!currentUser) return;

        getPlaylists(currentUser.username, page, 15, orderBy, orderType);
        this.setState({ page: page + 1 });
    }

    loadMorePlaylists(page) {
        const { chosenPlaylist } = this.state;
        const { getPlaylistPage, currentUser } = this.props;
        if (!currentUser || !chosenPlaylist) return;
        getPlaylistPage(currentUser.username, chosenPlaylist._id, page);
    }

    renderListItem(playlist) {
        const { currentUser } = this.props;

        return (
            <List.Item key={playlist._id}>
                <Playlist
                    playlist={playlist} userId={currentUser._id}
                    onOpenClick={() => {
                        this.setState({ chosenPlaylist: playlist }, () => this.showModal('openModal'));
                    }}
                    onEditClick={() => this.editPlaylist(playlist._id)}
                    onDeleteClick={() => {
                        this.setState({ chosenPlaylist: playlist }, () => this.showModal('deleteModal'));
                    }} />
            </List.Item>
        );
    }

    render() {
        const { sort, deleteModal, openModal, chosenPlaylist } = this.state;
        const {
            playlists, loadingPlaylists, hasMorePlaylists, currentUser,
            playlistTracks, playlistTracksLoading, playlistTracksHasMore
        } = this.props;

        return (
            <div className="playlists-page">
                 <div className="row">
                    <div className="col-md-3"></div>
                    <div className="col-md-6">
                        <InfiniteScroll
                            initialLoad={true}
                            pageStart={0}
                            loadMore={this.loadMore}
                            hasMore={!loadingPlaylists && hasMorePlaylists}>
                            <List
                                grid={{ gutter: 16, column: 4 }}
                                dataSource={playlists}
                                renderItem={this.renderListItem}>
                                {loadingPlaylists && hasMorePlaylists && (
                                    <div className="loading-container">
                                        <Spin size='small' />
                                    </div>
                                )}
                                {!loadingPlaylists && !hasMorePlaylists && !playlists.length && (
                                    <div className='music-page__no-tracks'>You have no playlists</div>
                                )}
                            </List>
                        </InfiniteScroll>
                    </div>
                    <div className="col-md-3">
                        <div className='controls-panel'>
                            <Button onClick={this.createPlaylist} className='sa-btn'>
                                Create<Icon type='plus' />
                            </Button><br />
                            <div>
                                <span>Sort:</span>
                                <Select
                                    placeholder='Sort' defaultValue={sort} disabled={!playlists.length}
                                    onChange={this.onChangeSort}>
                                    {sortOptions.map(option => (
                                        <Select.Option key={option.value} value={option.value}>
                                            {option.title}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </div>
                        </div>
                    </div>
                </div>

                <PlaylistView
                    isVisible={openModal} playlist={chosenPlaylist}
                    onCloseView={() => {
                        this.hideModal('openModal', () => {
                            this.setState({ chosenPlaylist: null });
                            this.props.clearPlaylistPage();
                        });
                    }}
                    tracks={playlistTracks} loading={playlistTracksLoading} hasMore={playlistTracksHasMore}
                    loadMore={page => this.loadMorePlaylists(page)} currentUser={currentUser} />

                <DeletePlaylistModal
                    isVisible={deleteModal} playlist={chosenPlaylist}
                    onCancelDelete={() => {
                        this.hideModal('deleteModal', () => this.setState({ chosenPlaylist: null }));
                    }}
                    onConfirmDelete={this.deletePlaylist} />
            </div>
        );
    }
}

const mapStateToProps = state => ({
    currentUser: state.user.currentUser,
    playlists: state.playlist.playlists,
    loadingPlaylists: state.playlist.loadingPlaylists,
    hasMorePlaylists: state.playlist.hasMorePlaylists,
    playlistTracks: state.playlist.tracks,
    playlistTracksLoading: state.playlist.isFetching,
    playlistTracksHasMore: state.playlist.hasMore
});

const mapDispatchToProps = dispatch => ({
    getPlaylists: (username, page, pageSize, orderBy, orderType) => {
        return dispatch(getPlaylists(username, page, pageSize, orderBy, orderType));
    },
    getPlaylistPage: (username, playlistId, page) => dispatch(getPlaylistPage(username, playlistId, page, 10)),
    deletePlaylist: (username, playlistId) => dispatch(deletePlaylist(username, playlistId)),
    clearPlaylist: () => dispatch(clearPlaylist()),
    clearPlaylistPage: () => dispatch(clearPlaylistPage())
});

export default connect(mapStateToProps, mapDispatchToProps)(PlaylistsPage);
