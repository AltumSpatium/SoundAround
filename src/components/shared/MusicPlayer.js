import React, { Component } from 'react';
import { Icon, Slider } from 'antd';
import {
    getPlayerTrack, setNowPlaying, clearPlayerPlaylist, setVisibility,
    clearPlayerTrack
} from '../../actions/player';
import { connect } from 'react-redux';
import { Howl, Howler } from 'howler';
import { beautifyDuration } from '../../util/trackUtil';
import * as GoUnmute from 'react-icons/lib/go/unmute';
import * as GoMute from 'react-icons/lib/go/mute';

class Player {
    constructor(playlist={}, updateProgress) {
        this.playlist = playlist;
        this.updateProgress = updateProgress;

        if (playlist.tracks) {
            this.tracks = this.initPlaylist(playlist);
        }

        this.currentIndex = this.playlist.startIndex || 0;
        this.isPlaying = false;
    }

    initPlaylist(playlist) {
        const self = this;
        return playlist.tracks.map(track => new Howl({
            src: [track.src],
            html5: true, 
            onplay: () => {
                requestAnimationFrame(self.step.bind(self));
            },
            onloaderror: function() {
            }
        }));
    }

    step() {
        const self = this;
        const trackHowl = self.tracks[self.currentIndex];
        const seek = trackHowl.seek() || 0;
        const percent = (((seek / trackHowl.duration()) * 100) || 0);
        self.updateProgress(seek, percent);

        if (trackHowl.playing()) {
            requestAnimationFrame(self.step.bind(self));
        }
    }

    stop() {
        const trackHowl = this.tracks[this.currentIndex];
        trackHowl.stop();
    }

    setPlaylist(playlist) {
        if (this.isPlaying) {
            this.tracks[this.currentIndex].stop();
        }

        this.playlist = playlist;
        if (playlist.tracks) {
            this.tracks = this.initPlaylist(playlist);
        }

        this.currentIndex = this.playlist.startIndex || 0;
    }

    play(index) {
        if (this.isPlaying) {
            this.tracks[this.currentIndex].stop();
        }

        if (index !== undefined) this.currentIndex = index;
        const trackHowl = this.tracks[this.currentIndex];
        trackHowl.play();
        this.isPlaying = true;
        return this.playlist.tracks[this.currentIndex].id;
    }

    pause() {
        const trackHowl = this.tracks[this.currentIndex];
        trackHowl.pause();
        this.isPlaying = false;
    }

    seek(percent) {
        const trackHowl = this.tracks[this.currentIndex];
        if (trackHowl.playing()) {
            trackHowl.seek(trackHowl.duration() * percent / 100);
        }
    }

    volume(value) {
        Howler.volume(value);
    }

    prev() {
        return this.skipTo(this.currentIndex - 1);
    }

    next() {
        return this.skipTo(this.currentIndex + 1);
    }

    skipTo(index) {
        if (this.isPlaying) {
            this.tracks[this.currentIndex].stop();
        }

        if (index < 0) index = 0;
        if (index >= this.tracks.length) index = this.tracks.length - 1;
        return this.play(index);
    }
}

class MusicPlayer extends Component {
    constructor(props) {
        super(props);

        this.state = {
            track: null,
            tracks: [],
            playing: false,
            currentProgress: 0,
            currentPercent: 0,

            preventUpdate: false,

            volume: 100,
            muted: false
        };

        this.play = this.play.bind(this);
        this.pause = this.pause.bind(this);
        this.prev = this.prev.bind(this);
        this.next = this.next.bind(this);
        this.stop = this.stop.bind(this);
        this.seek = this.seek.bind(this);
        this.updateProgress = this.updateProgress.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onChangeVolume = this.onChangeVolume.bind(this);
        this.toggleMute = this.toggleMute.bind(this);
        this.onAfterChange = this.onAfterChange.bind(this);
        this.setNowPlaying = this.setNowPlaying.bind(this);

        this.player = new Player({}, this.updateProgress);
    }

    play(index) {
        this.setState({ playing: true });
        return this.player.play(index);
    }

    pause() {
        this.player.pause();
        this.setState({ playing: false });
    }

    setNowPlaying(trackId) {
        this.props.setNowPlaying(trackId);
        const trackIndex = this.state.tracks.map(t => t._id).indexOf(trackId);
        this.setState({ track: this.state.tracks[trackIndex] });
    }

    prev() {
        const trackId = this.player.prev();
        this.setNowPlaying(trackId);
    }

    next() {
        const trackId = this.player.next();
        this.setNowPlaying(trackId);
    }

    stop() {
        this.player.stop();
        this.props.setNowPlaying(null);
        this.props.setVisibility(false);
        this.props.clearPlayerPlaylist();
        this.props.clearPlayerTrack();
    }

    seek(percent) {
        this.player.seek(percent);
    }

    updateProgress(seek, percent) {
        const { preventUpdate } = this.state;
        if (!preventUpdate) {
            this.setState({ currentProgress: seek, currentPercent: percent });
        } else this.setState({ currentProgress: seek });
    }

    onChange(value) {
        this.setState({ currentPercent: value, preventUpdate: true });
    }

    onAfterChange(value) {
        this.setState({ preventUpdate: false, currentPercent: value });
        this.seek(value);
    }

    onChangeVolume(value) {
        if (value === 0) {
            this.setState({ volume: value, muted: true });
        } else this.setState({ volume: value, muted: false });

        this.player.volume(value / 100);
    }

    toggleMute() {
        const { muted, volume } = this.state;

        if (!muted) {
            this.player.volume(0);
        } else this.player.volume(volume / 100);

        this.setState({ muted: !muted });
    }

    async componentWillReceiveProps(nextProps) {
        if (!this.props.playerPlaylist && nextProps.playerPlaylist) {
            const tracks = nextProps.playerPlaylist.tracks;
            const startTrackId = tracks[nextProps.playerPlaylist.startIndex];
            const playlist = {
                id: nextProps.playerPlaylist.id,
                startIndex: nextProps.playerPlaylist.startIndex,
                tracks: []
            };

            const cachedTracks = [];
            for (let trackId of tracks) {
                await this.props.getTrack(trackId);
                if (trackId === startTrackId) {
                    this.setState({ track: this.props.track });
                }

                cachedTracks.push(this.props.track);
                playlist.tracks.push({
                    id: trackId,
                    src: this.props.trackFilename
                });
            }

            this.setState({ tracks: cachedTracks });

            this.player.setPlaylist(playlist);
            this.play(nextProps.playerPlaylist.startIndex);
            this.props.setNowPlaying(startTrackId);
        }

        if (this.props.playerPlaylist && nextProps.playerPlaylist &&
            this.props.playerPlaylist.id !== nextProps.playerPlaylist.id) {
            const tracks = nextProps.playerPlaylist.tracks;
            const startTrackId = tracks[nextProps.playerPlaylist.startIndex];
            const playlist = {
                id: nextProps.playerPlaylist.id,
                startIndex: nextProps.playerPlaylist.startIndex,
                tracks: []
            };

            const cachedTracks = [];
            for (let trackId of tracks) {
                await this.props.getTrack(trackId);
                if (trackId === startTrackId) {
                    this.setState({ track: this.props.track });
                }

                cachedTracks.push(this.props.track);
                playlist.tracks.push({
                    id: trackId,
                    src: this.props.trackFilename
                });
            }

            this.setState({ tracks: cachedTracks });

            this.player.setPlaylist(playlist);
            this.play(nextProps.playerPlaylist.startIndex);
            this.props.setNowPlaying(startTrackId);
        }

        if (this.props.playerPlaylist && nextProps.playerPlaylist &&
            this.props.playerPlaylist.startIndex !== nextProps.playerPlaylist.startIndex) {
            const trackId = this.play(nextProps.playerPlaylist.startIndex);
            this.setNowPlaying(trackId);
        }

        if (nextProps.visible) {
            document.querySelector('.page-main-content').style.paddingBottom = '75px';
        } else {
            document.querySelector('.page-main-content').style.paddingBottom = '0px';
        }
    }

    render() {
        const { visible } = this.props;
        const { playing, currentProgress, currentPercent, muted, track } = this.state;
        let volume = this.state.volume;

        if (!visible) return null;
        if (!track) return null;

        if (muted) volume = 0;

        return (
            <div className="music-player">
                <div className='music-player__track'>
                    <div className="music-player__track-info">
                        {track.artist} - {track.title}
                    </div>
                    <div className="music-player__progress">
                        <span>{beautifyDuration(currentProgress)}</span>
                        <Slider
                            className='music-player__slider' tipFormatter={null}
                            value={currentPercent} onChange={this.onChange}
                            onAfterChange={this.onAfterChange} />
                        <span>{beautifyDuration(track.duration)}</span>
                    </div>
                </div>
                <div className="music-player__controls">
                    <span onClick={this.prev}><Icon type='step-backward' /></span>
                    {
                        playing ? 
                            <span onClick={this.pause}><Icon type='pause-circle-o' /></span> :
                            <span onClick={() => this.play()}><Icon type='play-circle-o' /></span>
                    }
                    <span onClick={this.next}><Icon type='step-forward' /></span>
                </div>
                <div className="music-player__volume">
                    <Slider
                        className='music-player__volume-slider' value={volume}
                        tipFormatter={null} onChange={this.onChangeVolume} />
                    <span onClick={this.toggleMute}>{volume ? <GoUnmute /> : <GoMute />}</span>
                </div>
                <span className='music-player__close' onClick={this.stop}>
                    <Icon type='close-circle-o' />
                </span>
            </div>
        )
    }
}

const mapStateToProps = state => ({
    visible: state.player.visible,
    playerPlaylist: state.player.playerPlaylist,
    track: state.player.track,
    trackFilename: state.player.trackFilename
});

const mapDispatchToProps = dispatch => ({
    getTrack: trackId => dispatch(getPlayerTrack(trackId)),
    setNowPlaying: trackId => dispatch(setNowPlaying(trackId)),
    clearPlayerPlaylist: () => dispatch(clearPlayerPlaylist()),
    setVisibility: visible => dispatch(setVisibility(visible)),
    clearPlayerTrack: () => dispatch(clearPlayerTrack())
});

export default connect(mapStateToProps, mapDispatchToProps)(MusicPlayer);
