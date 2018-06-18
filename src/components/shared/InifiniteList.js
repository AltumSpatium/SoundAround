import React from 'react';
import InfiniteScroller from 'react-infinite-scroller';
import { List, Spin } from 'antd';
import PropTypes from 'prop-types';

const InfiniteList = props => {
    const {
        hasMore, loadMore, loading,
        dataSource, renderItem,
        noData
    } = props;

    return (
        <InfiniteScroller
            pageStart={0}
            hasMore={!loading && hasMore}
            loadMore={loadMore}
            initialLoad={true}>
            <List
                dataSource={dataSource}
                renderItem={renderItem}>
                {loading && hasMore && (
                    <div className="loading-container">
                        <Spin size='small' />
                    </div>
                )}
                {!loading && !hasMore && !dataSource.length && (
                    noData ? noData : <div>No data</div>
                )}
            </List>
        </InfiniteScroller>
    )
};

InfiniteList.propTypes = {
    hasMore: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired,
    dataSource: PropTypes.array.isRequired,
    renderItem: PropTypes.func.isRequired,
    loadMore: PropTypes.func.isRequired,
    noData: PropTypes.object
};

export default InfiniteList;
