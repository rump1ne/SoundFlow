import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCurrentTrack, togglePlay } from '../store/slices/playerSlice';
import {
  PlayIcon,
  PauseIcon,
  HeartIcon,
  UserGroupIcon,
  EllipsisHorizontalIcon,
} from '@heroicons/react/24/solid';

const Playlist = () => {
  const { id } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    // TODO: Replace with actual API call
    const fetchPlaylist = async () => {
      try {
        // Simulated API response
        setPlaylist({
          id: 1,
          title: 'My Awesome Playlist',
          description: 'A collection of my favorite tracks',
          cover: 'https://via.placeholder.com/300',
          owner: {
            id: 1,
            username: 'User123',
            avatar: 'https://via.placeholder.com/50',
          },
          collaborators: [
            {
              id: 2,
              username: 'Collaborator1',
              avatar: 'https://via.placeholder.com/50',
            },
          ],
          tracks: [
            {
              id: 1,
              title: 'Track 1',
              artist: 'Artist 1',
              album: 'Album 1',
              duration: 180,
              cover: 'https://via.placeholder.com/150',
            },
            {
              id: 2,
              title: 'Track 2',
              artist: 'Artist 2',
              album: 'Album 2',
              duration: 240,
              cover: 'https://via.placeholder.com/150',
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching playlist:', error);
      }
    };

    fetchPlaylist();
  }, [id]);

  const handlePlayTrack = (track) => {
    if (selectedTrack?.id === track.id) {
      setIsPlaying(!isPlaying);
      dispatch(togglePlay());
    } else {
      setSelectedTrack(track);
      setIsPlaying(true);
      dispatch(setCurrentTrack(track));
      dispatch(togglePlay());
    }
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (!playlist) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Playlist Header */}
      <div className="flex items-start space-x-6">
        <img
          src={playlist.cover}
          alt={playlist.title}
          className="w-48 h-48 object-cover rounded-lg shadow-lg"
        />
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{playlist.title}</h1>
          <p className="text-gray-400 mt-2">{playlist.description}</p>
          <div className="flex items-center space-x-4 mt-4">
            <div className="flex items-center space-x-2">
              <img
                src={playlist.owner.avatar}
                alt={playlist.owner.username}
                className="w-6 h-6 rounded-full"
              />
              <span className="text-sm">{playlist.owner.username}</span>
            </div>
            <div className="flex items-center space-x-2">
              <UserGroupIcon className="h-5 w-5 text-gray-400" />
              <span className="text-sm text-gray-400">
                {playlist.collaborators.length} collaborators
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Playlist Controls */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => handlePlayTrack(playlist.tracks[0])}
          className="bg-blue-600 text-white px-6 py-2 rounded-full flex items-center space-x-2 hover:bg-blue-700"
        >
          {isPlaying && selectedTrack?.id === playlist.tracks[0].id ? (
            <PauseIcon className="h-5 w-5" />
          ) : (
            <PlayIcon className="h-5 w-5" />
          )}
          <span>Play</span>
        </button>
        <button className="text-gray-400 hover:text-white">
          <HeartIcon className="h-6 w-6" />
        </button>
        <button className="text-gray-400 hover:text-white">
          <EllipsisHorizontalIcon className="h-6 w-6" />
        </button>
      </div>

      {/* Tracks List */}
      <div className="bg-gray-800 rounded-lg overflow-hidden">
        <div className="grid grid-cols-[auto,1fr,auto,auto] gap-4 px-4 py-2 text-gray-400 text-sm border-b border-gray-700">
          <div className="w-8">#</div>
          <div>Title</div>
          <div>Duration</div>
          <div className="w-8"></div>
        </div>
        {playlist.tracks.map((track, index) => (
          <div
            key={track.id}
            className={`grid grid-cols-[auto,1fr,auto,auto] gap-4 px-4 py-2 hover:bg-gray-700 cursor-pointer ${
              selectedTrack?.id === track.id ? 'bg-gray-700' : ''
            }`}
            onClick={() => handlePlayTrack(track)}
          >
            <div className="w-8 text-gray-400">{index + 1}</div>
            <div className="flex items-center space-x-4">
              <img
                src={track.cover}
                alt={track.title}
                className="w-10 h-10 rounded"
              />
              <div>
                <div className="font-medium">{track.title}</div>
                <div className="text-sm text-gray-400">
                  {track.artist} • {track.album}
                </div>
              </div>
            </div>
            <div className="text-gray-400">
              {formatDuration(track.duration)}
            </div>
            <div className="w-8">
              {selectedTrack?.id === track.id && isPlaying ? (
                <PauseIcon className="h-5 w-5 text-blue-500" />
              ) : (
                <PlayIcon className="h-5 w-5 text-gray-400" />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Playlist; 