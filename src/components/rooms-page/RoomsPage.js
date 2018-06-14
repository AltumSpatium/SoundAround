import React, { Component } from 'react';
import { connect } from 'react-redux';
import InfiniteList from '../shared/InifiniteList';
import Room from './Room';
import RoomInfo from './RoomInfo';
import CreateRoomModal from './CreateRoomModal';
import { Button, Input, Tabs } from 'antd';
import { getRooms, clearRooms } from '../../actions/room';

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
                onRoomClick={() => this.showInfo(room)} isActive={room._id == chosenRoom._id} />
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
        // this.setState({ page: 1 }, () => {
        //     this.props.clearRooms().then(this.loadMore);
        // });
    }

    deleteRoom(roomId) {

    }

    clearRooms = async () => this.setState({ page: 1 }, this.props.clearRooms)

    clearSearch() {
        this.setState({ search: '' });
        this.clearRooms();
    }

    render() {
        const { chosenRoom, createModal, search, activeTab } = this.state;
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
                                <Tabs activeKey={activeTab} onChange={activeTab => this.setState({ activeTab })}>
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
                        <RoomInfo room={chosenRoom} />
                    </div>
                    <div className="col-md-1"></div>
                </div>

                <CreateRoomModal
                    isVisible={createModal}
                    onCancelCreate={() => this.hideModal('createModal')}
                    onClickCreate={this.createRoom}/>
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
    clearRooms: () => dispatch(clearRooms())
});

export default connect(mapStateToProps, mapDispatchToProps)(RoomsPage);
