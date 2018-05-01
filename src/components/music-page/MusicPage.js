import React, { Component } from 'react';
import { List, Spin } from 'antd';
import InfiniteScroll from 'react-infinite-scroller';

import '../../styles/MusicPage.css';

class MusicPage extends Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: false,
            hasMore: true
        };
    }

    render() {
        const { loading, hasMore } = this.state;

        return (
            <div className="music-page">
                <div className="row">
                    <div className="col-lg-3">kek</div>
                    <div className="col-lg-6">
                        <InfiniteScroll
                            initialLoad={false}
                            pageStart={0}
                            hasMore={!loading && hasMore}>
                            <List>
                                {loading && hasMore && (
                                    <div className="loading-container">
                                        <Spin />
                                    </div>
                                )}
                            </List>
                        </InfiniteScroll>
                    </div>
                    <div className="col-lg-3">
                        There should be buttons
                    </div>
                </div>
            </div>
        );
    }
}

export default MusicPage;
