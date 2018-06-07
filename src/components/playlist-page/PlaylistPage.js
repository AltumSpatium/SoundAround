import React, { Component } from 'react';
import { connect } from 'react-redux';
import PlaylistHeader from './PlaylistHeader';
import PlaylistMain from './PlaylistMain';
import { getMusicPage, setMusicTracklist, clearMusicList } from '../../actions/music';
import {
    getPlaylistPage, createPlaylist, setPlaylistTracklist,
    clearPlaylist, getPlaylist, updatePlaylist
} from '../../actions/playlist';
import { showMessage } from '../../util/toastrUtil';
import { Link } from 'react-router-dom';

import '../../styles/PlaylistPage.css';

class PlaylistPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            playlistPicture: null,
            title: '',
            musicPage: 1,
            playlistPage: 1
        };

        this.playlistId = this.isNewPlaylist() ? null : props.location.pathname.split('/')[3];

        this.getPageHeader = this.getPageHeader.bind(this);
        this.onImageUpload = this.onImageUpload.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onDragEnd = this.onDragEnd.bind(this);
        this.loadMore = this.loadMore.bind(this);
        this.onSaveClick = this.onSaveClick.bind(this);
        this.onCancelClick = this.onCancelClick.bind(this);
    }

    componentWillUnmount() {
        this.props.clearMusicList();
        this.props.clearPlaylist();
    }

    isNewPlaylist = () => this.props.location.pathname.split('/')[2] === 'add'

    getPageHeader() {
        if (this.isNewPlaylist()) return 'Create new playlist';
        else return 'Edit playlist';
    }

    onImageUpload(playlistPicture) {
        if (playlistPicture) {
            const fileReader = new FileReader();
            fileReader.onload = () => this.setState({ playlistPicture: new Buffer(fileReader.result) });
            fileReader.readAsArrayBuffer(playlistPicture);
        } else {
            this.setState({ playlistPicture });
        }
    }

    onChange({ target }) {
        const { name, value } = target;
        this.setState({ [name]: value });
    }

    onCancelClick() {
        this.props.history.push('/playlists');
    }

    onSaveClick() {
        const { playlistPicture, title } = this.state;

        if (!title) {
            showMessage('You must enter playlist title!', null, 'error');
            const input = document.querySelector('.playlist-page__playlist-title');
            input.classList.add('has-error');
            setTimeout(() => input.classList.remove('has-error'), 500);
            return;
        }

        const { playlistTracks, currentUser, createPlaylist, updatePlaylist, history } = this.props;
        const playlistData = {
            title, playlistPicture,
            tracks: playlistTracks.map(track => track._id)
        };

        if (this.isNewPlaylist()) {
            createPlaylist(currentUser.username, playlistData)
                .then(err => { if (!err) history.push('/playlists') });
        } else {
            updatePlaylist(this.playlistId, playlistData)
                .then(err => { if (!err) history.push('/playlists') });
        }
    }

    onDragEnd(result) {
        const { source, destination } = result;
        if (!destination) {
            if (source.droppableId === 'playlistTracklist') {
                const sourceClone = Array.from(this.props.playlistTracks);
                const destClone = Array.from(this.props.musicTracks);
                const [removed] = sourceClone.splice(source.index, 1);
                destClone.unshift(removed);
                this.props.setMusicTracklist(destClone);
                this.props.setPlaylistTracklist(sourceClone);
            }

            return;
        }

        const {
            musicTracks, setMusicTracklist,
            playlistTracks, setPlaylistTracklist
        } = this.props;

        const reorder = (list, startIndex, endIndex) => {
            const result = Array.from(list);
            const [removed] = result.splice(startIndex, 1);
            result.splice(endIndex, 0, removed);
            return result;
        };
        const move = (source, destination, droppableSource, droppableDestination) => {
            const sourceClone = Array.from(source);
            const destClone = Array.from(destination);
            const [removed] = sourceClone.splice(droppableSource.index, 1);
            destClone.splice(droppableDestination.index, 0, removed);
            const result = {};
            result[droppableSource.droppableId] = sourceClone;
            result[droppableDestination.droppableId] = destClone;
            return result;
        };
        const getTracks = droppableId => droppableId === 'musicTracklist' ? musicTracks : playlistTracks;

        if (source.droppableId === destination.droppableId) {
            const tracks = reorder(
                getTracks(source.droppableId),
                source.index,
                destination.index
            );

            if (source.droppableId === 'musicTracklist') {
                setMusicTracklist(tracks);
            } else {
                setPlaylistTracklist(tracks);
            }
        } else {
            const res = move(
                getTracks(source.droppableId),
                getTracks(destination.droppableId),
                source,
                destination
            );

            setMusicTracklist(res.musicTracklist);
            setPlaylistTracklist(res.playlistTracklist);
        }
    }

    componentDidMount() {
        if (!this.isNewPlaylist()) this.props.getPlaylist(this.playlistId);
    }

    componentWillReceiveProps(nextProps) {
        if (!this.props.playlist && nextProps.playlist) {
            this.setState({
                title: nextProps.playlist.title,
                playlistPicture: nextProps.playlist.playlistPicture
            });
        }
    }

    loadMore(tracklistName) {
        const { currentUser } = this.props;
        if (!currentUser) return;

        const filterMusicTracklist = () => {
            const playlistTracks = this.props.playlistTracks;
            if (playlistTracks.length) {
                const playlistTracksIds = playlistTracks.map(t => t._id);
                const filteredMusicTracks = this.props.musicTracks.filter(
                    t => !playlistTracksIds.includes(t._id));
                this.props.setMusicTracklist(filteredMusicTracks);
            }
        };

        const page = this.state[`${tracklistName}Page`];
        if (tracklistName === 'music') {
            this.props.getMusicPage(currentUser.username, page)
                .then(filterMusicTracklist);
        } else if (tracklistName === 'playlist') {
            if (!this.playlistId) return;
            this.props.getPlaylistPage(currentUser.username, this.playlistId, page)
                .then(filterMusicTracklist);
        }
        this.setState({ [`${tracklistName}Page`]: page + 1 });
    }

    render() {
        const { title, playlistPicture } = this.state;
        const {
            musicTracks, musicHasMore, musicLoading,
            playlistTracks, playlistHasMore, playlistLoading,
            currentUser, playlist, loadingPlaylist, playlistSaving
        } = this.props;

        if (!currentUser || loadingPlaylist) return null;
        if (!this.isNewPlaylist() && (!currentUser.playlists.includes(this.playlistId) ||
            !playlist)) {
            return (
                <div className='playlist-page__not-found'>
                    <span>Playlist not found</span><br/>
                    <Link to='/playlists'>To playlists page</Link>
                </div>
            );
        }

        const tracksCount = playlistTracks.length;
        const totalDuration = playlistTracks.reduce((prev, curr) => prev + curr.duration, 0);

        return (
            <div className="playlist-page">
                <div className="row">
                    <div className="col-md-2"></div>
                    <div className="col-md-8 playlist-page-content">
                        <PlaylistHeader
                            pageHeader={this.getPageHeader()} tracksCount={tracksCount} saving={playlistSaving}
                            onImageUpload={this.onImageUpload} title={title} onTitleChange={this.onChange}
                            onCancelClick={this.onCancelClick} onSaveClick={this.onSaveClick}
                            playlistPicture={playlistPicture} totalDuration={totalDuration} />
                        <main className="playlist-page__playlist-main">
                            <PlaylistMain
                                musicTracks={musicTracks} musicHasMore={musicHasMore}
                                musicLoading={musicLoading} playlistTracks={playlistTracks}
                                playlistHasMore={playlistHasMore} playlistLoading={playlistLoading}
                                onDragEnd={this.onDragEnd} loadMore={this.loadMore} />
                        </main>
                    </div>
                    <div className="col-md-2"></div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    currentUser: state.user.currentUser,
    playlist: state.playlist.playlist,
    loadingPlaylist: state.playlist.loadingPlaylist,
    musicTracks: state.music.tracks,
    musicLoading: state.music.isFetching,
    musicHasMore: state.music.hasMore,
    playlistTracks: state.playlist.tracks,
    playlistLoading: state.playlist.isFetching,
    playlistHasMore: state.playlist.hasMore,
    playlistSaving: state.playlist.saving
});

const mapDispatchToProps = dispatch => ({
    getMusicPage: (username, page) => {
        return dispatch(getMusicPage(username, page, 15, 'uploadDate', 'desc'));
    },
    getPlaylistPage: (username, playlistId, page) => {
        return dispatch(getPlaylistPage(username, playlistId, page, 15));
    },
    getPlaylist: playlistId => dispatch(getPlaylist(playlistId)),
    setMusicTracklist: tracklist => dispatch(setMusicTracklist(tracklist)),
    setPlaylistTracklist: tracklist => dispatch(setPlaylistTracklist(tracklist)),
    createPlaylist: (username, playlistData) => dispatch(createPlaylist(username, playlistData)),
    updatePlaylist: (playlistId, playlistData) => dispatch(updatePlaylist(playlistId, playlistData)),
    clearMusicList: () => dispatch(clearMusicList()),
    clearPlaylist: () => dispatch(clearPlaylist())
});

export default connect(mapStateToProps, mapDispatchToProps)(PlaylistPage);
