import React from 'react';
import { Switch, Route, Redirect } from 'react-router';

import App from '../components/app/App';
import CurrentRoomPage from '../components/current-room-page/CurrentRoomPage';
import MusicPage from '../components/music-page/MusicPage';
import PlaylistPage from '../components/playlist-page/PlaylistPage';
import PlaylistsPage from '../components/playlists-page/PlaylistsPage';
import RoomsPage from '../components/rooms-page/RoomsPage';
import SettingsPage from '../components/settings-page/SettingsPage';

import RegisterPage from '../components/register-page/RegisterPage';
import LoginPage from '../components/login-page/LoginPage';

import NotFoundPage from '../components/shared/NotFoundPage';

const AppWrapper = () => (
    <App>
        <Route path='/music' component={MusicPage} />
        <Route exact path='/playlists' component={PlaylistsPage} />
        <Route path='/playlists/:playlistId' component={PlaylistPage} />
        <Route exact path='/rooms' component={RoomsPage} />
        <Route path='/rooms/:roomId' component={CurrentRoomPage} />
        <Route path='/settings' component={SettingsPage} />
    </App>
);

const routes = (
    <Switch>
        <Route exact path='/register' component={RegisterPage} />
        <Route exact path='/login' component={LoginPage} />
        <Route path='/(music|playlists|rooms|settings)' component={AppWrapper} />
        <Route exact path='/' render={() => <Redirect to='/rooms' />} />
        <Route component={NotFoundPage} />
    </Switch>
);

export default routes;
