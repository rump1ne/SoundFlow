import { useState, useEffect } from 'react';
import useLocalStorage from './useLocalStorage';

const usePlaybackStats = () => {
  const [stats, setStats] = useLocalStorage('playbackStats', {});
  const [currentTrack, setCurrentTrack] = useState(null);
  const [startTime, setStartTime] = useState(null);

  useEffect(() => {
    if (currentTrack) {
      setStartTime(Date.now());
    }
  }, [currentTrack]);

  const trackPlayback = (track) => {
    setCurrentTrack(track);
  };

  const trackComplete = () => {
    if (currentTrack && startTime) {
      const duration = (Date.now() - startTime) / 1000; // в секундах
      const trackId = currentTrack.id;

      setStats(prevStats => {
        const trackStats = prevStats[trackId] || {
          playCount: 0,
          totalDuration: 0,
          lastPlayed: null
        };

        return {
          ...prevStats,
          [trackId]: {
            ...trackStats,
            playCount: trackStats.playCount + 1,
            totalDuration: trackStats.totalDuration + duration,
            lastPlayed: new Date().toISOString()
          }
        };
      });

      setCurrentTrack(null);
      setStartTime(null);
    }
  };

  const getTrackStats = (trackId) => {
    return stats[trackId] || {
      playCount: 0,
      totalDuration: 0,
      lastPlayed: null
    };
  };

  const getMostPlayedTracks = (limit = 5) => {
    return Object.entries(stats)
      .sort(([, a], [, b]) => b.playCount - a.playCount)
      .slice(0, limit)
      .map(([trackId, stats]) => ({
        trackId,
        ...stats
      }));
  };

  return {
    trackPlayback,
    trackComplete,
    getTrackStats,
    getMostPlayedTracks
  };
};

export default usePlaybackStats; 