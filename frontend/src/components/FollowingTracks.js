import React, { useEffect, useState } from 'react';
import axios from 'axios';

const FollowingTracks = ({ token }) => {
    const [tracks, setTracks] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8000/api/following/tracks/', {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then(response => setTracks(response.data))
        .catch(error => console.error(error));
    }, [token]);

    return (
        <div>
            <h2>Tracks from Followed Users</h2>
            <ul>
                {tracks.map(track => (
                    <li key={track.id}>{track.title} - {track.artist}</li>
                ))}
            </ul>
        </div>
    );
};

export default FollowingTracks;