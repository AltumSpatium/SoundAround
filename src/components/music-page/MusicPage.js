import React, { Component } from 'react';
import { List, Spin, Button, Icon, Select } from 'antd';
import Track from './Track';
import { connect } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroller';
import { getMusicPage, clearMusicList } from '../../actions/music';
import { sortOptions, groupByOptions } from '../../constants/music';

import '../../styles/MusicPage.css';

class MusicPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            page: 1,
            pageSize: 8,
            orderBy: 'uploadDate',
            orderType: 'desc',

            sort: 'uploadDate',
            groupBy: 'track'
        };

        this.loadMore = this.loadMore.bind(this);
        this.renderListItem = this.renderListItem.bind(this);
        this.processTracks = this.processTracks.bind(this);
        this.onChangeSort = this.onChangeSort.bind(this);
    }

    onChangeSort(value) {
        let orderBy, orderType;
        switch (value) {
            case 'title':
                orderBy = 'title';
                orderType = 'asc';
                break;
            case 'artist':
                orderBy = 'artist';
                orderType = 'asc';
                break;
            case 'random':
                orderBy = 'random';
                orderType = 'desc';
                break;
            case 'reversed':
                orderBy = 'uploadDate';
                orderType = 'asc'
                break;
            case 'uploadDate':
            default:
                orderBy = 'uploadDate';
                orderType = 'desc';
                break;
        }
        this.setState({sort: value, orderType, orderBy, page: 1}, this.loadMore);
        this.props.clearMusicList();
    }

    loadMore() {
        const { page, pageSize, orderBy, orderType } = this.state;
        const { getMusicPage, currentUser } = this.props;
        if (!currentUser) return;

        getMusicPage(currentUser.username, page, pageSize, orderBy, orderType);
        this.setState({ page: page + 1 });
    }

    renderListItem(track) {
        return <Track track={track} />
    }

    componentDidUpdate(prevProps, prevState) {
        if (!prevProps.currentUser && this.props.currentUser) this.loadMore();
    }

    componentDidMount() {
        if (this.props.currentUser) this.loadMore();
    }

    componentWillUnmount() {
        this.props.clearMusicList();
    }

    processTracks(tracks) {

    }

    render() {
        const { tracks, loading, hasMore } = this.props;
        const { sort, groupBy } = this.state;

        return (
            <div className="music-page">
                <div className="row">
                    <div className="col-md-3"></div>
                    <div className="col-md-6">
                        <InfiniteScroll
                            initialLoad={false}
                            pageStart={0}
                            hasMore={!loading && hasMore}
                            loadMore={this.loadMore}>
                            <List
                                dataSource={tracks}
                                renderItem={this.renderListItem}>
                                {loading && hasMore && (
                                    <div className="loading-container">
                                        <Spin size='small' />
                                    </div>
                                )}
                                {!loading && !hasMore && !tracks.length && (
                                    <div className='music-page__no-tracks'>You have no tracks</div>
                                )}
                            </List>
                        </InfiniteScroll>
                    </div>
                    <div className="col-md-3">
                        <div className='music-page__controls-panel'>
                            <Button>Upload<Icon type='upload' /></Button><br />
                            <div>
                                <span>Sort:</span>
                                <Select
                                    placeholder='Sort' defaultValue={sort} disabled={!tracks.length}
                                    onChange={this.onChangeSort}>
                                    {sortOptions.map(option => (
                                        <Select.Option key={option.value} value={option.value}>
                                            {option.title}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </div>
                            <div>
                                <span>Group by:</span>
                                <Select
                                    placeholder='Group by' defaultValue={groupBy} disabled={!tracks.length}
                                    onChange={value => this.setState({groupBy: value})}>
                                    {groupByOptions.map(option => (
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
    tracks: state.music.tracks,
    loading: state.music.isFetching,
    hasMore: state.music.hasMore
});

const mapDispatchToProps = dispatch => ({
    getMusicPage: (username, page, pageSize, orderBy, orderType) => {
        return dispatch(getMusicPage(username, page, pageSize, orderBy, orderType))
    },
    clearMusicList: () => dispatch(clearMusicList())
})

export default connect(mapStateToProps, mapDispatchToProps)(MusicPage);
