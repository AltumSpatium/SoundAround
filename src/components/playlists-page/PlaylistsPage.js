import React, { Component } from 'react';
import { Button, Select, Icon, List, Card } from 'antd';
import { sortOptions } from '../../constants/music';

import '../../styles/PlaylistsPage.css';

class PlaylistsPage extends Component {

    render() {
        const data = [
            { title: 'My first playlist', content: 'http://www.cco.ku.edu/wp-content/uploads/2014/06/Music-blue-640x640.png' },
            { title: 'Quite music', content: 'https://glendalemontessorischool.net/wp-content/uploads/2017/06/summer-boredom-640x640.jpg' }
        ]
        return (
            <div className="playlists-page">
                 <div className="row">
                    <div className="col-md-3"></div>
                    <div className="col-md-6">
                    <List
                        grid={{ gutter: 16, column: 4 }}
                        dataSource={data}
                        renderItem={item => (
                            <List.Item>
                                <Card
                                cover={<img src={item.content} alt="Example" width='150' height='150'/>}>
                                    {item.title}
                                </Card>
                            </List.Item>
                        )}
                    />
                    </div>
                    <div className="col-md-3">
                        <div className='music-page__controls-panel'>
                            <Button className='sa-btn'>
                                Create<Icon type='plus' />
                            </Button><br />
                            <div>
                                <span>Sort:</span>
                                <Select
                                    placeholder='Sort'>
                                    {sortOptions.map(option => (
                                        <Select.Option key={option.value} value={option.value}>
                                            {option.title}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default PlaylistsPage;
