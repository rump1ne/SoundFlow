import React from 'react';
import axios from 'axios';
import Comments from './Comments';

const TrackList = ({ tracks, token }) => {
    const likeTrack = async (trackId) => {
        try {
            await axios.post(`http://localhost:8000/api/tracks/${trackId}/like/`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert('Track like status changed!');
        } catch (error) {
            console.error('Error liking track', error);
        }
    };

    return (
        <div>
            <h2>Track List</h2>
            <ul>
                {tracks.map(track => (
                    <li key={track.id}>
                        {track.title} - {track.artist}
                        <button onClick={() => likeTrack(track.id)}>Like</button>
                        <Comments trackId={track.id} token={token} />
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TrackList;