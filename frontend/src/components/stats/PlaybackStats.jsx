import React from 'react';
import { ChartBarIcon, ClockIcon, CalendarIcon } from '@heroicons/react/24/outline';
import usePlaybackStats from '../../hooks/usePlaybackStats';

const PlaybackStats = ({ tracks }) => {
  const { getTrackStats, getMostPlayedTracks } = usePlaybackStats();
  const mostPlayed = getMostPlayedTracks();

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}ч ${minutes}м`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Никогда';
    return new Date(dateString).toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <h2 className="text-xl font-semibold text-white mb-4">Статистика прослушиваний</h2>
      
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-medium text-white mb-2">Популярные треки</h3>
          <div className="space-y-2">
            {mostPlayed.map(({ trackId, playCount, totalDuration }) => {
              const track = tracks.find(t => t.id === trackId);
              if (!track) return null;

              return (
                <div
                  key={trackId}
                  className="flex items-center justify-between p-2 bg-gray-700 rounded"
                >
                  <div className="flex items-center space-x-2">
                    <ChartBarIcon className="h-5 w-5 text-blue-500" />
                    <span className="text-white">{track.title}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <ClockIcon className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-400">{formatDuration(totalDuration)}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <ChartBarIcon className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-400">{playCount} прослушиваний</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-white mb-2">Общая статистика</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-gray-700 rounded">
              <div className="flex items-center space-x-2">
                <ChartBarIcon className="h-5 w-5 text-blue-500" />
                <span className="text-white">Всего треков</span>
              </div>
              <p className="text-2xl font-bold text-white mt-2">{tracks.length}</p>
            </div>
            <div className="p-3 bg-gray-700 rounded">
              <div className="flex items-center space-x-2">
                <ClockIcon className="h-5 w-5 text-blue-500" />
                <span className="text-white">Общее время</span>
              </div>
              <p className="text-2xl font-bold text-white mt-2">
                {formatDuration(
                  Object.values(getMostPlayedTracks()).reduce(
                    (acc, { totalDuration }) => acc + totalDuration,
                    0
                  )
                )}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlaybackStats; 