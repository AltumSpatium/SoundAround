import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getTrack, clearMusicList } from '../../actions/music';
import { Button, Spin } from 'antd';

class RoomInfo extends Component {
    constructor(props) {
        super(props);

        this.loadTrack = this.loadTrack.bind(this);
    }

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
            this.props.room._id != nextProps.room._id) {
            load();
        }
    }

    render() {
        const { room, loadingTrack, track } = this.props;
        if (!room) return null;

        return (
            <div className="room-info">
                <div className="info-header">
                    <span>{room.name}</span><Button className='sa-btn'>Enter room</Button>
                    <div style={{clear: 'both'}}></div>
                </div>
                <div className="info-main">
                    <div className="descr">{room.description}</div>
                    <div style={{clear: 'both'}}></div>
                    <div className="now-playing">
                        {loadingTrack && <Spin size='small' />}
                        {!loadingTrack && track && (
                            <div>Now playing: <span>{track.artist} - {track.title}</span></div>
                        )}
                    </div>
                </div>
                <div style={{clear: 'both'}}></div>
            </div>
        );
    }
}

RoomInfo.propTypes = {
    room: PropTypes.object,
    track: PropTypes.object,
    loading: PropTypes.bool
};

const mapStateToProps = state => ({
    track: state.music.track,
    loading: state.music.loadingTrack
});

const mapDispatchToProps = dispatch => ({
    getTrack: (trackId, onlyInfo) => dispatch(getTrack(trackId, onlyInfo)),
    clearMusicList: () => dispatch(clearMusicList())
});

export default connect(mapStateToProps, mapDispatchToProps)(RoomInfo);
