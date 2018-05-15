import React, { Component } from 'react';
import { List, Spin, Button, Icon, Select } from 'antd';
import Track from './Track';
import UploadModal from './UploadModal';
import EditModal from './EditModal';
import DeleteModal from './DeleteModal';
import { connect } from 'react-redux';
import moment from 'moment';
import InfiniteScroll from 'react-infinite-scroller';
import {
    getMusicPage, clearMusicList, uploadTrack, updateTrack, deleteTrack
} from '../../actions/music';
import { sortOptions, groupByOptions } from '../../constants/music';

import '../../styles/MusicPage.css';

class MusicPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            page: 1,
            pageSize: 10,
            orderBy: 'uploadDate',
            orderType: 'desc',

            sort: 'uploadDate',
            groupBy: 'track',

            uploadModal: false,
            fileList: null,
            uploadingPercent: 0,

            editModal: false,
            deleteModal: false,

            chosenTrack: null
        };

        this.loadMore = this.loadMore.bind(this);
        this.renderListItem = this.renderListItem.bind(this);
        this.processTracks = this.processTracks.bind(this);
        this.onChangeSort = this.onChangeSort.bind(this);
        this.uploadTrack = this.uploadTrack.bind(this);
        this.onCancelUpload = this.onCancelUpload.bind(this);
        this.onChangeUploadedFile = this.onChangeUploadedFile.bind(this);
        this.startProgressBar = this.startProgressBar.bind(this);
        this.editTrack = this.editTrack.bind(this);
        this.deleteTrack = this.deleteTrack.bind(this);
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

    renderListItem(item) {
        const { groupBy } = this.state;
        const renderTrack = track => (
            <Track
                track={track}
                onEditClick={() => {
                    this.setState({ chosenTrack: track }, () => this.showModal('editModal'));
                }}
                onDeleteClick={() => {
                    this.setState({ chosenTrack: track }, () => this.showModal('deleteModal'));
                }} />
        );

        if (groupBy === 'track') {
            return renderTrack(item);
        } else {
            return (
                <div className='music-page__grouped-block'>
                    <p>{item.title}</p>
                    <ul>
                        {item.tracks.map(renderTrack)}
                    </ul>
                </div>
            );
        }
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
        const { groupBy } = this.state;
        const groupByField = (tracks, fieldName) => {
            return tracks.reduce((groupedTracks, track) => {
                groupedTracks[track[fieldName]] = groupedTracks[track[fieldName]] || [];
                groupedTracks[track[fieldName]].push(track);
                return groupedTracks;
            }, {});
        };
        const formatGroupedDates = groupedTracks => {
            const withFormattedDates = {};
            for (let key in groupedTracks) {
                const formattedDate = moment(key).format('DD.MM.YYYY');
                const formattedDateTracks = withFormattedDates[formattedDate];

                if (formattedDateTracks) {
                    withFormattedDates[formattedDate] = formattedDateTracks.concat(groupedTracks[key]);
                } else withFormattedDates[formattedDate] = groupedTracks[key];
            }
            return withFormattedDates;
        };

        let groupedTracks;
        switch (groupBy) {
            case 'album':
                groupedTracks = groupByField(tracks, 'album');
                break;
            case 'artist':
                groupedTracks = groupByField(tracks, 'artist');
                break;
            case 'uploadDate':
                groupedTracks = formatGroupedDates(groupByField(tracks, 'uploadDate'));
                break;
            case 'track':
            default:
                return tracks;
        }

        let processedTracks = [];
        for (let key in groupedTracks) {
            const processedTrackContainer = {
                title: key,
                tracks: groupedTracks[key]
            };
            processedTracks.push(processedTrackContainer);
        }

        processedTracks.sort((a, b) => a.title > b.title);
        return processedTracks;
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
    clearUploadFileList = () => this.setState({fileList: null })

    onCancelUpload() {
        this.hideModal('uploadModal', this.clearUploadFileList);
    }

    onChangeUploadedFile(info) {
        this.setState({ fileList: info.fileList });
    }

    startProgressBar() {
        this.timerId = setInterval(() => {
            const { uploadingPercent } = this.state;
            const { isUploadingAudio } = this.props;

            if (uploadingPercent >= 98 || !isUploadingAudio) {
                clearInterval(this.timerId);
                return;
            }
            
            this.setState({ uploadingPercent: uploadingPercent + 2 });
        }, 250);
    }

    uploadTrack() {
        const { uploadTrack, currentUser, clearMusicList } = this.props;
        const { fileList } = this.state;
        if (!fileList || !currentUser) return;

        this.startProgressBar();
        uploadTrack(currentUser.username, fileList[0])
            .then(() => {
                this.hideModal('uploadModal', this.clearUploadFileList, 500);
                this.setState({ page: 1, uploadingPercent: 100 },
                    () => clearMusicList().then(() => this.loadMore()));
            }).then(() => setTimeout(() => this.setState({ uploadingPercent: 0 }), 550));
    }

    editTrack({ artist, title, lyrics, album, trackId, needUpdate }) {
        this.hideModal('editModal', () => this.setState({ chosenTrack: null }));
        const { currentUser, updateTrack } = this.props;
        const trackData = { artist, title, lyrics, album };
        if (needUpdate) {
            updateTrack(trackId, trackData, currentUser.username);
        }
    }

    deleteTrack(trackId) {
        this.hideModal('deleteModal', () => this.setState({ chosenTrack: null }));
        const { currentUser, deleteTrack } = this.props;
        deleteTrack(trackId, currentUser.username);
    }

    render() {
        const { tracks, loading, hasMore, isUploadingAudio } = this.props;
        const {
            sort, groupBy, uploadModal, fileList,
            uploadingPercent, editModal, chosenTrack,
            deleteModal
        } = this.state;

        const processedTracks = this.processTracks(tracks);

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
                                dataSource={processedTracks}
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
                            <Button onClick={() => this.showModal('uploadModal')} className='sa-btn'>
                                Upload<Icon type='upload' />
                            </Button><br />
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

                <UploadModal
                    isVisible={uploadModal} percent={uploadingPercent}
                    isUploading={isUploadingAudio} fileList={fileList}
                    onCancelUpload={this.onCancelUpload}
                    onClickUpload={this.uploadTrack}
                    onChangeUploadedFile={this.onChangeUploadedFile} />

                <EditModal
                    isVisible={editModal} track={chosenTrack}
                    onCancelEdit={() => {
                        this.hideModal('editModal', () => this.setState({ chosenTrack: null }));
                    }}
                    onConfirmEdit={this.editTrack} />

                <DeleteModal
                    isVisible={deleteModal} track={chosenTrack}
                    onCancelDelete={() => {
                        this.hideModal('deleteModal', () => this.setState({ chosenTrack: null }));
                    }}
                    onConfirmDelete={this.deleteTrack} />
            </div>
        );
    }
}

const mapStateToProps = state => ({
    currentUser: state.user.currentUser,
    tracks: state.music.tracks,
    loading: state.music.isFetching,
    hasMore: state.music.hasMore,
    isUploadingAudio: state.music.isUploadingAudio
});

const mapDispatchToProps = dispatch => ({
    getMusicPage: (username, page, pageSize, orderBy, orderType) => {
        return dispatch(getMusicPage(username, page, pageSize, orderBy, orderType))
    },
    clearMusicList: () => dispatch(clearMusicList()),
    uploadTrack: (username, track) => dispatch(uploadTrack(username, track)),
    updateTrack: (trackId, trackData, username) => dispatch(updateTrack(trackId, trackData, username)),
    deleteTrack: (trackId, username) => dispatch(deleteTrack(trackId, username))
});

export default connect(mapStateToProps, mapDispatchToProps)(MusicPage);
