import React, { Component } from 'react';
import TrackPiece from '../shared/TrackPiece';
import { connect } from 'react-redux';
import { getMusicPage } from '../../actions/music';
import { Button, Input, Icon } from 'antd';

import '../../styles/CurrentRoomPage.css';

class CurrentRoomPage extends Component {
    componentDidMount() {
        this.props.getMusicPage();
    }

    render() {
        const tracks = this.props.tracks;
        if (!tracks || !tracks.length) return null;

        const messages = [
            { author: 'alex', text: 'Hello guys!' }
        ];

        return (
            <div className="current-room-page">
                <div className="room-main">
                    <div className="croom-header">
                        <span>enjoy our music</span><Button>Exit</Button>
                        <div style={{clear: 'both'}}></div>
                    </div>
                    <div className="chat-window">
                        {messages.map(msg => (
                            <div className="msg">
                                <div className="msg-author">{msg.author}</div>
                                <div className="msg-text">{msg.text}</div>
                            </div>
                        ))}
                    </div>
                    <div className="chat-input">
                        <div><Icon type='plus' /></div><Input /><button>Send</button>
                    </div>
                </div>
                <div className="room-aside">
                    <div className="np">
                        <span>Now playing:</span>
                        <div className='tp-wrap'>
                            <TrackPiece track={tracks[1]} />
                        </div>
                    </div>
                    <div className="tracklist">
                        <span>My first playlist</span>
                        <div>
                            {tracks.slice(0, 5).map((item, index) => (
                                <div className={`tp-wrap ${index === 1 ? 'active' : ''}`} key={index}>
                                    <TrackPiece track={item} />
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="users-online">
                        <span>Users online:</span><br/>
                        <span>sample user</span><br/>
                        <span>alex</span>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    tracks: state.music.tracks
});

const mapDispatchToProps = dispatch => ({
    getMusicPage: () => dispatch(getMusicPage('alex', 1, 20, 'uploadDate', 'desc'))
});

export default connect(mapStateToProps, mapDispatchToProps)(CurrentRoomPage);
