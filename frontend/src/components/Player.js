import React, { useRef, useState } from 'react';
import axios from 'axios';

const Player = ({ track, token }) => {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);

    const togglePlay = () => {
        if (isPlaying) {
            audioRef.current.pause();
        } else {
            audioRef.current.play();
            axios.post(`http://localhost:8000/api/tracks/${track.id}/history/`, {}, {
                headers: { Authorization: `Bearer ${token}` },
            }).catch(error => console.error('Error updating history', error));
        }
        setIsPlaying(!isPlaying);
    };

    return (
        <div>
            <h3>{track.title} - {track.artist}</h3>
            <audio ref={audioRef} src={track.audio_file} />
            <button onClick={togglePlay}>{isPlaying ? 'Pause' : 'Play'}</button>
        </div>
    );
};

export default Player;