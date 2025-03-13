import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TrackList from './components/TrackList';
import Playlist from './components/Playlist';
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
            <h1>Music Streaming App</h1>
            {!token ? (
                <>
                    <Login setToken={setToken} />
                    <Register />
                </>
            ) : (
                <>
                    <TrackList tracks={tracks} />
                    <Playlist token={token} tracks={tracks} />
                </>
            )}
        </div>
    );
};

export default App;
