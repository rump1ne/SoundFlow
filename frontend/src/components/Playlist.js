import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Playlist = ({ token, tracks }) => {
    const [playlists, setPlaylists] = useState([]);
    const [name, setName] = useState('');
    const [selectedTrack, setSelectedTrack] = useState('');

    useEffect(() => {
        axios.get('http://localhost:8000/api/playlists/', {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then(response => setPlaylists(response.data))
        .catch(error => console.error(error));
    }, [token]);

    const createPlaylist = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/api/playlists/',
                { name },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setPlaylists([...playlists, response.data]);
        } catch (error) {
            console.error('Error creating playlist', error);
        }
    };

    const addTrackToPlaylist = async (playlistId) => {
        try {
            await axios.post(`http://localhost:8000/api/playlists/${playlistId}/add-track/`,
                { track_id: selectedTrack },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert('Track added successfully!');
        } catch (error) {
            console.error('Error adding track to playlist', error);
        }
    };

    const removeTrackFromPlaylist = async (playlistId, trackId) => {
        try {
            await axios.delete(`http://localhost:8000/api/playlists/${playlistId}/remove-track/${trackId}/`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert('Track removed successfully!');
        } catch (error) {
            console.error('Error removing track from playlist', error);
        }
    };

    const updatePlaylistName = async (playlistId, newName) => {
        try {
            await axios.patch(`http://localhost:8000/api/playlists/${playlistId}/update/`,
                { name: newName },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert('Playlist name updated successfully!');
        } catch (error) {
            console.error('Error updating playlist name', error);
        }
    };

    return (
        <div>
            <h2>Your Playlists</h2>
            <form onSubmit={createPlaylist}>
                <input
                    type="text"
                    placeholder="Playlist Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <button type="submit">Create</button>
            </form>
            <h3>Manage Playlists</h3>
            <ul>
                {playlists.map(playlist => (
                    <li key={playlist.id}>
                        <input type="text" defaultValue={playlist.name} onBlur={(e) => updatePlaylistName(playlist.id, e.target.value)} />
                        <button onClick={() => addTrackToPlaylist(playlist.id)}>Add Track</button>
                        {playlist.tracks?.map(track => (
                            <button key={track.id} onClick={() => removeTrackFromPlaylist(playlist.id, track.id)}>Remove {track.title}</button>
                        ))}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Playlist;