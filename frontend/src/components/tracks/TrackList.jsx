import React from 'react';
import { useDispatch } from 'react-redux';
import { setCurrentTrack, addToQueue } from '../../store/slices/playerSlice';
import { TrashIcon, PlusIcon, ChartBarIcon } from '@heroicons/react/24/outline';
import usePlaybackStats from '../../hooks/usePlaybackStats';

const TrackList = ({ 
  tracks, 
  onDeleteTrack, 
  onAddToPlaylist, 
  selectedPlaylist,
  onPlay,
  onTrackEnd
}) => {
  const dispatch = useDispatch();
  const { getTrackStats } = usePlaybackStats();

  const handlePlay = (track) => {
    dispatch(setCurrentTrack(track));
    onPlay(track);
  };

  const handleAddToQueue = (track) => {
    dispatch(addToQueue(track));
  };

  const handleDelete = (trackId) => {
    if (window.confirm('Вы уверены, что хотите удалить этот трек?')) {
      onDeleteTrack(trackId);
    }
  };

  return (
    <div className="space-y-4">
      {tracks.map((track) => {
        const stats = getTrackStats(track.id);
        return (
          <div
            key={track.id}
            className="flex items-center justify-between p-4 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-center space-x-4">
              <img
                src={track.cover}
                alt={track.title}
                className="w-12 h-12 rounded"
              />
              <div>
                <h3 className="text-white font-medium">{track.title}</h3>
                <p className="text-gray-400 text-sm">{track.artist}</p>
                {track.genre && (
                  <span className="text-xs text-gray-500">{track.genre}</span>
                )}
                {stats.playCount > 0 && (
                  <div className="flex items-center space-x-1 mt-1">
                    <ChartBarIcon className="h-3 w-3 text-gray-400" />
                    <span className="text-xs text-gray-400">
                      {stats.playCount} прослушиваний
                    </span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handlePlay(track)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                Воспроизвести
              </button>
              <button
                onClick={() => handleAddToQueue(track)}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
              >
                В очередь
              </button>
              {selectedPlaylist && (
                <button
                  onClick={() => onAddToPlaylist(track)}
                  className="p-2 text-green-500 hover:text-green-600 transition-colors"
                  title="Добавить в плейлист"
                >
                  <PlusIcon className="h-5 w-5" />
                </button>
              )}
              <button
                onClick={() => handleDelete(track.id)}
                className="p-2 text-red-500 hover:text-red-600 transition-colors"
                title="Удалить трек"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TrackList; 