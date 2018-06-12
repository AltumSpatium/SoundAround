import React, { Component } from 'react';
import { connect } from 'react-redux';
import InfiniteList from '../shared/InifiniteList';
import Room from './Room';
import RoomInfo from './RoomInfo';
import { Button, Input, Tabs } from 'antd';
import { getRooms, clearRooms } from '../../actions/room';

import '../../styles/RoomsPage.css';

class RoomsPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            page: 1,

            showRoomInfo: false,

            createModal: false,
            deleteModal: false,
            passwordModal: false,
            chosenRoom: null
        };

        this.loadMore = this.loadMore.bind(this);
        this.renderListItem = this.renderListItem.bind(this);
        this.isRoomAuthor = this.isRoomAuthor.bind(this);
        this.showInfo = this.showInfo.bind(this);
        this.hideInfo = this.hideInfo.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);
    }

    componentDidMount() {
        window.addEventListener('keyup', this.onKeyUp);
    }

    onKeyUp(e) {
        if (e.keyCode === 27) this.hideInfo();
    }

    hideInfo() {
        this.setState({ chosenRoom: null, showRoomInfo: false });
    }

    componentWillUnmount() {
        this.props.clearRooms();
        window.removeEventListener('keyup', this.onKeyUp);
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

    loadMore() {
        const { page } = this.state;
        this.props.getRooms(page, 15);
        this.setState({ page: page + 1 });
    }

    renderListItem(room) {
        const chosenRoom = this.state.chosenRoom || {};

        return (
            <Room
                key={room._id} room={room} isRoomAuthor={this.isRoomAuthor(room)}
                onRoomClick={() => this.showInfo(room)} isActive={room._id == chosenRoom._id} />
        );
    }

    isRoomAuthor(room) {
        const { currentUser } = this.props;
        return room.authorId == currentUser._id;
    }

    showInfo(room) {
        this.setState({ chosenRoom: room, showRoomInfo: true });
    }

    render() {
        const { showRoomInfo, chosenRoom } = this.state;
        const { rooms, loading, hasMore, currentUser } = this.props;
        const userRooms = rooms.filter(this.isRoomAuthor);

        return (
            <div className="rooms-page">
                <div className="row">
                    <div className="col-md-2"></div>
                    <div className="col-md-6">
                        <div className="rooms-main">
                            <div className="room-main__header">
                                <div className="room-main__header__search-bar">
                                    <Input />
                                    <Button>Search</Button>
                                </div>
                                <Button className='sa-btn sa-btn-success btn-create'>Create room</Button>
                            </div>                            
                            <div className="rooms-list">
                                <Tabs defaultActiveKey='1'>
                                    <Tabs.TabPane tab='All rooms' key='1'>
                                        <InfiniteList
                                            hasMore={hasMore} loading={loading} loadMore={this.loadMore}
                                            dataSource={rooms} renderItem={this.renderListItem} />
                                    </Tabs.TabPane>
                                    {userRooms.length && (
                                        <Tabs.TabPane tab='My rooms' key='2'>
                                            <InfiniteList
                                                hasMore={hasMore} loading={loading} loadMore={this.loadMore}
                                                dataSource={userRooms} renderItem={this.renderListItem} />
                                        </Tabs.TabPane>
                                    )}
                                </Tabs>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        {showRoomInfo && <RoomInfo room={chosenRoom} />}
                    </div>
                    <div className="col-md-1"></div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    currentUser: state.user.currentUser,
    rooms: state.room.rooms,
    loading: state.room.loading,
    hasMore: state.room.hasMore
});

const mapDispatchToProps = dispatch => ({
    getRooms: (page, pageSize) => dispatch(getRooms(page, pageSize)),
    clearRooms: () => dispatch(clearRooms())
});

export default connect(mapStateToProps, mapDispatchToProps)(RoomsPage);
