import React from 'react';
import Player from './Player';

const TrackList = ({ tracks }) => {
    return (
        <div>
            <h2>Track List</h2>
            {tracks.map(track => (
                <Player key={track.id} track={track} />
            ))}
        </div>
    );
};

export default TrackList;