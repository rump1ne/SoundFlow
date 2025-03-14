import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TrackList from './components/TrackList';
import Playlist from './components/Playlist';
import History from './components/History';
import Recommendations from './components/Recommendations';
import FollowingTracks from './components/FollowingTracks';
import Login from './pages/Login';
import Register from './pages/Register';

const App = () => {
    const [tracks, setTracks] = useState([]);
    const [token, setToken] = useState(localStorage.getItem('token') || '');

    useEffect(() => {
        axios.get('http://localhost:8000/api/tracks/', {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then(response => setTracks(response.data))
        .catch(error => console.error(error));
    }, [token]);

    return (
        <div>
            <h1>SoundFlow</h1>
            {!token ? (
                <>
                    <Login setToken={setToken} />
                    <Register />
                </>
            ) : (
                <>
                    <TrackList tracks={tracks} token={token} />
                    <Playlist token={token} tracks={tracks} />
                    <History token={token} />
                    <Recommendations token={token} />
                    <FollowingTracks token={token} />
                </>
            )}
        </div>
    );
};

export default App;