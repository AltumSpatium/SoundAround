import React, { Component } from 'react';
import { Button, Select, Icon, List, Card, Spin } from 'antd';
import InfiniteScroll from 'react-infinite-scroller';
import { connect } from 'react-redux';
import { sortOptions } from '../../constants/playlist';
import {
    getPlaylists, getPlaylistPage, deletePlaylist, clearPlaylist
} from '../../actions/playlist';

import '../../styles/PlaylistsPage.css';

class PlaylistsPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            page: 1,

            sort: 'createdDate',

            orderBy: '',
            orderType: '',

            selectedPlaylist: '',

            deleteModalVisible: false
        };

        this.onChangeSort = this.onChangeSort.bind(this);
        this.loadMore = this.loadMore.bind(this);
        this.renderListItem = this.renderListItem.bind(this);
        this.createPlaylist = this.createPlaylist.bind(this);
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

    createPlaylist() {
        this.props.history.push('/playlists/add');
    }

    loadMore() {
        const { page, orderBy, orderType } = this.state;
        const { getPlaylists, currentUser } = this.props;
        if (!currentUser) return;

        getPlaylists(currentUser.username, page, 15, orderBy, orderType);
        this.setState({ page: page + 1 });
    }

    renderListItem(playlist) {
        console.log(playlist.playlistPicture);

        return (
            <List.Item>
                <Card
                >
                    {playlist.title}
                </Card>
            </List.Item>
        );
    }

    render() {
        const { sort } = this.state;
        const { playlists, loadingPlaylists, hasMorePlaylists } = this.props;

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
    clearPlaylist: () => dispatch(clearPlaylist())
});

export default connect(mapStateToProps, mapDispatchToProps)(PlaylistsPage);
