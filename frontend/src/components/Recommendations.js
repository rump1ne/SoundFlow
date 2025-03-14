import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Recommendations = ({ token }) => {
    const [tracks, setTracks] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8000/api/recommendations/', {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then(response => setTracks(response.data))
        .catch(error => console.error(error));
    }, [token]);

    return (
        <div>
            <h2>Recommended Tracks</h2>
            <ul>
                {tracks.map(track => (
                    <li key={track.id}>{track.title} - {track.artist} (Genre: {track.genre})</li>
                ))}
            </ul>
        </div>
    );
};

export default Recommendations;