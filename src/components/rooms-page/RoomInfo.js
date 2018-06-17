import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getTrack, clearMusicList } from '../../actions/music';
import { Button, Spin } from 'antd';
import PasswordModal from './PasswordModal';
import TrackPiece from '../shared/TrackPiece';

class RoomInfo extends Component {
    constructor(props) {
        super(props);

        this.state = {
            passwordModal: false
        };

        this.loadTrack = this.loadTrack.bind(this);
        this.enterRoom = this.enterRoom.bind(this);
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

    loadTrack(trackId) {
        const { getTrack } = this.props;
        getTrack(trackId, true);
    }

    componentWillReceiveProps(nextProps) {
        const load = () => {
            this.props.clearMusicList();
            const trackId = nextProps.room.nowPlaying;
            if (trackId) this.loadTrack(trackId);
        };

        if (!this.props.room && nextProps.room) {
            load();
        } else if (this.props.room && nextProps.room &&
            this.props.room._id !== nextProps.room._id) {
            load();
        }
    }

    enterRoom() {
        const { room, onEnterRoom } = this.props;
        if (!room) return;

        if (!room.public) {
            this.showModal('passwordModal');
        } else onEnterRoom(room);
    }

    render() {
        const { passwordModal } = this.state;
        const { room, loadingTrack, track, onEnterRoom } = this.props;
        if (!room) return null;

        return (
            <div className="room-info">
                <div className="info-header">
                    <span>{room.name}</span>
                    <Button onClick={this.enterRoom} className='sa-btn'>Enter room</Button>
                    <div style={{clear: 'both'}}></div>
                </div>
                <div className="info-main">
                    <div className="descr">{room.description}</div>
                    <div style={{clear: 'both'}}></div>
                    <div className="now-playing">
                        {loadingTrack && <div className='now-playing-loading'><Spin size='small' /></div>}
                        {!loadingTrack && track && (
                            <div>Now playing:<br />
                                <div className="track-piece-wrapper"><TrackPiece track={track} /></div>
                            </div>
                        )}
                    </div>
                </div>
                <div style={{clear: 'both'}}></div>

                <PasswordModal
                    isVisible={passwordModal} room={room}
                    onCancelClick={() => this.hideModal('passwordModal')}
                    onEnterClick={room => {
                        this.hideModal('passwordModal');
                        onEnterRoom(room);
                    }} />
            </div>
        );
    }
}

RoomInfo.propTypes = {
    room: PropTypes.object,
    track: PropTypes.object,
    loadingTrack: PropTypes.bool,
    onEnterRoom: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    track: state.music.track,
    loadingTrack: state.music.loadingTrack,
});

const mapDispatchToProps = dispatch => ({
    getTrack: (trackId, onlyInfo) => dispatch(getTrack(trackId, onlyInfo)),
    clearMusicList: () => dispatch(clearMusicList())
});

export default connect(mapStateToProps, mapDispatchToProps)(RoomInfo);
