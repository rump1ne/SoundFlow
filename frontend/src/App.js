import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TrackList from './components/TrackList';

const App = () => {
    const [tracks, setTracks] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8000/api/tracks/')
            .then(response => setTracks(response.data))
            .catch(error => console.error(error));
    }, []);

    return (
        <div>
            <h1>Music Streaming App</h1>
            <TrackList tracks={tracks} />
        </div>
    );
};

export default App;