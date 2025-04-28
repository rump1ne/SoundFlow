import React from 'react';
import TrackList from '../components/tracks/TrackList';
import UploadTrack from '../components/tracks/UploadTrack';
import SearchAndFilter from '../components/tracks/SearchAndFilter';
import PlaylistManager from '../components/playlists/PlaylistManager';
import PlaybackStats from '../components/stats/PlaybackStats';
import AnimatedContainer from '../components/common/AnimatedContainer';
import Player from '../components/Player';
import useLocalStorage from '../hooks/useLocalStorage';
import usePlaybackStats from '../hooks/usePlaybackStats';

const MusicPage = () => {
  const [tracks, setTracks] = useLocalStorage('tracks', [
    {
      id: '1',
      title: 'Пример трека 1',
      artist: 'Исполнитель 1',
      url: '/music/song1.mp3',
      cover: '/default-cover.jpg',
      genre: 'pop',
      dateAdded: '2024-01-01T00:00:00.000Z'
    },
    {
      id: '2',
      title: 'Пример трека 2',
      artist: 'Исполнитель 2',
      url: '/music/song2.mp3',
      cover: '/default-cover.jpg',
      genre: 'rock',
      dateAdded: '2024-01-02T00:00:00.000Z'
    },
  ]);

  const [filteredTracks, setFilteredTracks] = React.useState(tracks);
  const [selectedPlaylist, setSelectedPlaylist] = React.useState(null);
  const { trackPlayback, trackComplete } = usePlaybackStats();

  const handleAddTrack = (newTrack) => {
    const trackWithMetadata = {
      ...newTrack,
      id: Date.now().toString(),
      dateAdded: new Date().toISOString(),
      genre: 'pop' // По умолчанию
    };
    setTracks([...tracks, trackWithMetadata]);
  };

  const handleDeleteTrack = (trackId) => {
    setTracks(tracks.filter(track => track.id !== trackId));
  };

  const handleSearch = (query) => {
    const filtered = tracks.filter(track => 
      track.title.toLowerCase().includes(query.toLowerCase()) ||
      track.artist.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredTracks(filtered);
  };

  const handleFilter = (filters) => {
    let filtered = [...tracks];

    // Фильтрация по жанру
    if (filters.genre) {
      filtered = filtered.filter(track => track.genre === filters.genre);
    }

    // Сортировка
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (filters.sortBy) {
        case 'title':
          comparison = a.title.localeCompare(b.title);
          break;
        case 'artist':
          comparison = a.artist.localeCompare(b.artist);
          break;
        case 'date':
          comparison = new Date(a.dateAdded) - new Date(b.dateAdded);
          break;
        default:
          comparison = 0;
      }
      return filters.sortOrder === 'asc' ? comparison : -comparison;
    });

    setFilteredTracks(filtered);
  };

  const handleSelectPlaylist = (playlist) => {
    setSelectedPlaylist(playlist);
  };

  const handleAddToPlaylist = (track) => {
    if (!selectedPlaylist) return;

    const updatedPlaylists = playlists.map(p => {
      if (p.id === selectedPlaylist.id) {
        return {
          ...p,
          tracks: [...p.tracks, track]
        };
      }
      return p;
    });

    setPlaylists(updatedPlaylists);
  };

  const handlePlay = (track) => {
    trackPlayback(track);
  };

  const handleTrackEnd = () => {
    trackComplete();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <AnimatedContainer>
        <h1 className="text-3xl font-bold text-white mb-8">Музыкальный плеер</h1>
      </AnimatedContainer>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <AnimatedContainer>
            <SearchAndFilter onSearch={handleSearch} onFilter={handleFilter} />
          </AnimatedContainer>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <AnimatedContainer>
              <div>
                <h2 className="text-2xl font-semibold text-white mb-4">Загрузить новый трек</h2>
                <UploadTrack onAddTrack={handleAddTrack} />
              </div>
            </AnimatedContainer>
            
            <AnimatedContainer>
              <div>
                <h2 className="text-2xl font-semibold text-white mb-4">Список треков</h2>
                <TrackList 
                  tracks={filteredTracks} 
                  onDeleteTrack={handleDeleteTrack}
                  onAddToPlaylist={handleAddToPlaylist}
                  selectedPlaylist={selectedPlaylist}
                  onPlay={handlePlay}
                  onTrackEnd={handleTrackEnd}
                />
              </div>
            </AnimatedContainer>
          </div>
        </div>

        <div className="space-y-8">
          <AnimatedContainer>
            <PlaylistManager onSelectPlaylist={handleSelectPlaylist} />
          </AnimatedContainer>
          
          <AnimatedContainer>
            <PlaybackStats tracks={tracks} />
          </AnimatedContainer>
        </div>
      </div>

      <div className="mt-8">
        <Player onTrackEnd={handleTrackEnd} />
      </div>
    </div>
  );
};

export default MusicPage; 