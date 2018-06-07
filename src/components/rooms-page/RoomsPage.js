import React, { Component } from 'react';
import { Button, Input } from 'antd';

import '../../styles/RoomsPage.css';

class RoomsPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            rooms: [
                { title: 'Best music', usersOnline: 3 },
                { title: 'enjoy our music', usersOnline: 2 },
                { title: 'music', usersOnline: 0 }
            ]
        };
    }

    render() {
        const rooms = this.state.rooms.slice();

        return (
            <div className="rooms-page">
                <div className="row">
                    <div className="col-md-2"></div>
                    <div className="col-md-6">
                        <div className="rooms-main">
                            <Input className='search-bar' />
                            <div className="rooms-list">
                                {rooms.map((room, index) => (
                                    <div className="room-card">
                                        <div className="room-name">{room.title}</div>
                                        <div className="room-users">
                                            Users online: {room.usersOnline}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="room-info">
                            <div className="info-header">
                                <span>enjoy our music</span><Button className='sa-btn'>Enter room</Button>
                                
                            </div>
                            <div className="info-main">
                                <div className="descr">
                                    Hello there, my friend! Come in and relax
                                </div>
                                <div className="now-playing">
                                    Now playing: <span>Crown the Empire - Aftermath</span>
                                </div>
                            </div>
                            <div style={{clear: 'both'}}></div>
                        </div>
                    </div>
                    <div className="col-md-1"></div>
                </div>
            </div>
        );
    }
}

export default RoomsPage;
