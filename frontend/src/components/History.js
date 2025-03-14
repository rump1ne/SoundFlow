import React, { useEffect, useState } from 'react';
import axios from 'axios';

const History = ({ token }) => {
    const [history, setHistory] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:8000/api/history/', {
            headers: { Authorization: `Bearer ${token}` },
        })
        .then(response => setHistory(response.data))
        .catch(error => console.error(error));
    }, [token]);

    return (
        <div>
            <h2>Listening History</h2>
            <ul>
                {history.map((entry, index) => (
                    <li key={index}>{entry.track} - {entry.artist} (Played at: {new Date(entry.played_at).toLocaleString()})</li>
                ))}
            </ul>
        </div>
    );
};

export default History;