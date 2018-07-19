import React, { Component } from 'react';
import { Icon, Slider } from 'antd';
import {
    getPlayerTrack, setNowPlaying, clearPlayerPlaylist, setVisibility,
    clearPlayerTrack, receiveCommand
} from '../../actions/player';
import { connect } from 'react-redux';
import Player from '../../util/Player';
import { beautifyDuration } from '../../util/trackUtil';
import * as GoUnmute from 'react-icons/lib/go/unmute';
import * as GoMute from 'react-icons/lib/go/mute';

class MusicPlayer extends Component {
    constructor(props) {
        super(props);

        const volume = localStorage.getItem('sa-volume');
        const muted = localStorage.getItem('sa-muted');

        this.state = {
            track: null,
            tracks: [],
            playing: false,
            currentProgress: 0,
            currentPercent: 0,

            preventUpdate: false,

            volume: volume ? parseInt(volume) : 100,
            muted: muted ? JSON.parse(muted) : false
        };

        this.createPlaylist = this.createPlaylist.bind(this);
        this.handleCommand = this.handleCommand.bind(this);
        this._handleCommand = this._handleCommand.bind(this);
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

        this.player = new Player({
            onProgress: this.updateProgress
        });
        this.player.volume(this.state.volume / 100);
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
        this.setState({ playing: true });
        this.setNowPlaying(trackId);
    }

    next() {
        const trackId = this.player.next();
        this.setState({ playing: true });
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
        localStorage.setItem('sa-volume', value);
    }

    toggleMute() {
        const { muted, volume } = this.state;

        const newVolume = muted ? volume : 0;
        this.player.volume(newVolume / 100);
        localStorage.setItem('sa-muted', !muted);

        this.setState({ muted: !muted });
    }

    async createPlaylist(playerPlaylist) {
        const { tracks, id, startIndex } = playerPlaylist;
        const startTrackId = tracks[startIndex];
        const playlist = {
            id, startIndex,
            tracks: []
        };

        const cachedTracks = [];
        for (const trackId of tracks) {
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
        return playlist;
    }

    async _handleCommand(command) {
        switch (command.type) {
            case 'SET_PLAYLIST': {
                if (this.player.playlist.id !== command.data.id) {
                    const playlist = await this.createPlaylist(command.data);
                    this.player.playlist = playlist;
                } else {
                    this.player.playlist = { ...this.player.playlist, startIndex: command.data.startIndex };
                }
                break;
            }
            case 'PLAY': {
                const playlist = this.player.playlist;
                if (playlist.id) {
                    const startTrackId = playlist.tracks[playlist.startIndex].id;
                    this.setNowPlaying(startTrackId);
                    this.play(playlist.startIndex);
                    break;
                }
            }
            case 'PAUSE': {
                this.pause();
                break;
            }
            case 'STOP': {
                this.stop();
                break;
            }
            case 'PREV': {
                this.prev();
                break;
            }
            case 'NEXT': {
                this.next();
                break;
            }
        }
    }

    async handleCommand(input) {
        if (Array.isArray(input)) {
            for (const command of input) {
                await this._handleCommand(command);
            }
        } else await this._handleCommand(input);

        this.props.receiveCommand();
    }

    async componentWillReceiveProps(nextProps) {
        // if (!this.props.playerPlaylist && nextProps.playerPlaylist) {
        //     const [playlist, startTrackId] = await this.createPlaylist(nextProps.playerPlaylist);
        //     this.player.playlist = playlist;
        //     //this.play(nextProps.playerPlaylist.startIndex);
        //     //this.props.setNowPlaying(startTrackId);
        // }

        // Replace with 'command' functionality
        // if (this.props.playerPlaylist && nextProps.playerPlaylist &&
        //     this.props.playerPlaylist.id !== nextProps.playerPlaylist.id) {
        //     const [playlist, startTrackId] = await this.createPlaylist(nextProps.playerPlaylist);
        //     this.player.playlist = playlist;
        //     //this.play(nextProps.playerPlaylist.startIndex);
        //     //this.props.setNowPlaying(startTrackId);
        // }

        // if (this.props.playerPlaylist && nextProps.playerPlaylist &&
        //     this.props.playerPlaylist.startIndex !== nextProps.playerPlaylist.startIndex) {
        //     //const trackId = this.play(nextProps.playerPlaylist.startIndex);
        //     //this.setNowPlaying(trackId);
        // }

        if (!this.props.commandReceived && nextProps.commandReceived) {
            this.handleCommand(nextProps.command);
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
    trackFilename: state.player.trackFilename,
    command: state.player.command,
    commandReceived: state.player.commandReceived
});

const mapDispatchToProps = dispatch => ({
    getTrack: trackId => dispatch(getPlayerTrack(trackId)),
    setNowPlaying: trackId => dispatch(setNowPlaying(trackId)),
    clearPlayerPlaylist: () => dispatch(clearPlayerPlaylist()),
    setVisibility: visible => dispatch(setVisibility(visible)),
    clearPlayerTrack: () => dispatch(clearPlayerTrack()),
    receiveCommand: () => dispatch(receiveCommand())
});

export default connect(mapStateToProps, mapDispatchToProps)(MusicPlayer);
