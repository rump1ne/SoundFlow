import React, { useState } from 'react';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import useLocalStorage from '../../hooks/useLocalStorage';

const PlaylistManager = ({ onSelectPlaylist }) => {
  const [playlists, setPlaylists] = useLocalStorage('playlists', []);
  const [isCreating, setIsCreating] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState('');
  const [editingPlaylist, setEditingPlaylist] = useState(null);

  const handleCreatePlaylist = (e) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;

    const newPlaylist = {
      id: Date.now().toString(),
      name: newPlaylistName,
      tracks: [],
      createdAt: new Date().toISOString()
    };

    setPlaylists([...playlists, newPlaylist]);
    setNewPlaylistName('');
    setIsCreating(false);
  };

  const handleDeletePlaylist = (playlistId) => {
    if (window.confirm('Вы уверены, что хотите удалить этот плейлист?')) {
      setPlaylists(playlists.filter(p => p.id !== playlistId));
    }
  };

  const handleEditPlaylist = (playlist) => {
    setEditingPlaylist(playlist);
    setNewPlaylistName(playlist.name);
  };

  const handleUpdatePlaylist = (e) => {
    e.preventDefault();
    if (!newPlaylistName.trim()) return;

    setPlaylists(playlists.map(p => 
      p.id === editingPlaylist.id 
        ? { ...p, name: newPlaylistName }
        : p
    ));

    setNewPlaylistName('');
    setEditingPlaylist(null);
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-white">Плейлисты</h2>
        <button
          onClick={() => setIsCreating(true)}
          className="p-2 text-blue-500 hover:text-blue-600 transition-colors"
        >
          <PlusIcon className="h-5 w-5" />
        </button>
      </div>

      {isCreating && (
        <form onSubmit={handleCreatePlaylist} className="mb-4">
          <input
            type="text"
            value={newPlaylistName}
            onChange={(e) => setNewPlaylistName(e.target.value)}
            placeholder="Название плейлиста"
            className="w-full p-2 rounded bg-gray-700 text-white mb-2"
          />
          <div className="flex space-x-2">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Создать
            </button>
            <button
              type="button"
              onClick={() => setIsCreating(false)}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
            >
              Отмена
            </button>
          </div>
        </form>
      )}

      {editingPlaylist && (
        <form onSubmit={handleUpdatePlaylist} className="mb-4">
          <input
            type="text"
            value={newPlaylistName}
            onChange={(e) => setNewPlaylistName(e.target.value)}
            placeholder="Название плейлиста"
            className="w-full p-2 rounded bg-gray-700 text-white mb-2"
          />
          <div className="flex space-x-2">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
            >
              Сохранить
            </button>
            <button
              type="button"
              onClick={() => {
                setEditingPlaylist(null);
                setNewPlaylistName('');
              }}
              className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
            >
              Отмена
            </button>
          </div>
        </form>
      )}

      <div className="space-y-2">
        {playlists.map(playlist => (
          <div
            key={playlist.id}
            className="flex items-center justify-between p-2 bg-gray-700 rounded hover:bg-gray-600 transition-colors"
          >
            <button
              onClick={() => onSelectPlaylist(playlist)}
              className="flex-1 text-left text-white hover:text-blue-400 transition-colors"
            >
              {playlist.name}
            </button>
            <div className="flex space-x-2">
              <button
                onClick={() => handleEditPlaylist(playlist)}
                className="p-1 text-gray-400 hover:text-white transition-colors"
              >
                <PencilIcon className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleDeletePlaylist(playlist.id)}
                className="p-1 text-gray-400 hover:text-red-500 transition-colors"
              >
                <TrashIcon className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlaylistManager; 