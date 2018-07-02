import React, { Component } from 'react';
import { connect } from 'react-redux';
import openSocket from 'socket.io-client';
import InfiniteList from '../shared/InifiniteList';
import Room from './Room';
import RoomInfo from './RoomInfo';
import CreateRoomModal from './CreateRoomModal';
import DeleteRoomModal from './DeleteRoomModal';
import { Button, Input, Tabs, Icon } from 'antd';
import { getRooms, clearRooms, deleteRoom, exitRoom } from '../../actions/room';
import { clearTrack } from '../../actions/music';

import '../../styles/RoomsPage.css';

class RoomsPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            page: 1,

            activeTab: '1',

            search: '',

            createModal: false,
            deleteModal: false,
            passwordModal: false,
            chosenRoom: null,
            roomToDelete: null
        };

        this.io = openSocket();

        this.loadMore = this.loadMore.bind(this);
        this.renderListItem = this.renderListItem.bind(this);
        this.isRoomAuthor = this.isRoomAuthor.bind(this);
        this.showInfo = this.showInfo.bind(this);
        this.hideInfo = this.hideInfo.bind(this);
        this.onKeyUp = this.onKeyUp.bind(this);
        this.createRoom = this.createRoom.bind(this);
        this.deleteRoom = this.deleteRoom.bind(this);
        this.onChange = this.onChange.bind(this);
        this.clearSearch = this.clearSearch.bind(this);
        this.loadRoomsPage = this.loadRoomsPage.bind(this);
        this.reloadRooms = this.reloadRooms.bind(this);
        this.enterRoom = this.enterRoom.bind(this);
    }

    onChange(e) {
        const target = e.target;
        const { name, value } = target;
        this.setState({ [name]: value });
    }

    componentDidMount() {
        window.addEventListener('keyup', this.onKeyUp);
    }

    onKeyUp(e) {
        if (e.keyCode === 27) this.hideInfo();
    }

    hideInfo() {
        this.setState({ chosenRoom: null });
    }

    componentWillUnmount() {
        this.props.clearRooms();
        this.props.clearTrack();
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
        const { search } = this.state;
        this.loadRoomsPage(search);
    }

    loadRoomsPage(search) {
        const { page } = this.state;
        this.props.getRooms(page, 15, search);
        this.setState({ page: page + 1 });
    }

    renderListItem(room) {
        const chosenRoom = this.state.chosenRoom || {};

        return (
            <Room
                key={room._id} room={room} isRoomAuthor={this.isRoomAuthor(room)}
                onRoomClick={() => this.showInfo(room)} isActive={room._id == chosenRoom._id}
                onDeleteClick={e => {
                    e.stopPropagation();
                    this.setState({ roomToDelete: room });
                    this.showModal('deleteModal');
                }} />
        );
    }

    isRoomAuthor(room) {
        const { currentUser } = this.props;
        if (!currentUser) return false;
        return room.authorId == currentUser._id;
    }

    showInfo(room) {
        this.setState({ chosenRoom: room });
    }

    createRoom() {
        this.hideModal('createModal');
        this.clearRooms().then(this.loadMore);
    }

    deleteRoom(roomId) {
        this.props.deleteRoom(roomId).then(err => {
            if (!err) this.io.emit('deleteRoom', { roomId });
            const { chosenRoom } = this.state;
            if (chosenRoom && chosenRoom._id === roomId) this.setState({ chosenRoom: null });
        });
        this.hideModal('deleteModal');
    }

    clearRooms = async () => this.setState({ page: 1, chosenRoom: null }, this.props.clearRooms)

    clearSearch() {
        this.setState({ search: '' });
        this.clearRooms();
    }

    reloadRooms() {
        this.clearRooms();
        const reloadIcon = document.querySelector('.rooms-list__reload i');
        reloadIcon.classList.add('rotate-animation');
        setTimeout(() => { reloadIcon.classList.remove('rotate-animation') }, 500);
    }

    enterRoom(room) {
        const { currentUser } = this.props;
        const currentRoom = currentUser.currentRoom;

        if (!currentRoom || currentRoom && currentRoom === room._id) {
            this.props.history.push(`/rooms/${room._id}`, { allowed: true });
        } else {
            this.io.emit('exitRoom', { roomId: currentRoom, username: currentUser.username });
            this.props.exitRoom(currentUser.username, currentRoom).then(() => {
                this.props.history.push(`/rooms/${room._id}`, { allowed: true });
            });
        }
    }

    render() {
        const {
            chosenRoom, createModal, deleteModal, search,
            activeTab, roomToDelete, currentUser
        } = this.state;
        const { rooms, loading, hasMore } = this.props;
        const userRooms = rooms.filter(this.isRoomAuthor);

        return (
            <div className="rooms-page">
                <div className="row">
                    <div className="col-md-2"></div>
                    <div className="col-md-6">
                        <div className="rooms-main">
                            <div className="room-main__header">
                                <div className="room-main__header__search-bar">
                                    <Input
                                        onChange={this.onChange} name='search' value={search}
                                        suffix={search ?
                                            <span
                                                onClick={this.clearSearch} className='search-cross'>
                                                ×
                                            </span>
                                            : null
                                        }
                                        onPressEnter={this.clearRooms} />
                                    <Button onClick={this.clearRooms}>Search</Button>
                                </div>
                                <Button
                                    className='sa-btn sa-btn-success btn-create'
                                    onClick={() => this.showModal('createModal')}>
                                    Create room
                                </Button>
                            </div>                            
                            <div className="rooms-list">
                                <Tabs
                                    activeKey={activeTab} onChange={activeTab => this.setState({ activeTab })}
                                    tabBarExtraContent={
                                        <div className='rooms-list__reload'>
                                            <span onClick={this.reloadRooms}><Icon type='reload' /></span>
                                        </div>
                                    }>
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
                        <RoomInfo room={chosenRoom} onEnterRoom={this.enterRoom} />
                    </div>
                    <div className="col-md-1"></div>
                </div>

                <CreateRoomModal
                    isVisible={createModal}
                    onCancelCreate={() => this.hideModal('createModal')}
                    onClickCreate={this.createRoom} />
                
                <DeleteRoomModal
                    isVisible={deleteModal} room={roomToDelete}
                    onCancelDelete={() => this.hideModal('deleteModal')}
                    onConfirmDelete={this.deleteRoom} />
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
    getRooms: (page, pageSize, search) => dispatch(getRooms(page, pageSize, search)),
    deleteRoom: roomId => dispatch(deleteRoom(roomId)),
    clearRooms: () => dispatch(clearRooms()),
    exitRoom: (username, roomId) => dispatch(exitRoom(username, roomId)),
    clearTrack: () => dispatch(clearTrack())
});

export default connect(mapStateToProps, mapDispatchToProps)(RoomsPage);
