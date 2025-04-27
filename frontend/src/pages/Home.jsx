import React from 'react';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import TrackCard from '../components/tracks/TrackCard';
import PlaylistCard from '../components/playlists/PlaylistCard';
import ArtistCard from '../components/artists/ArtistCard';

const Container = styled.div`
  padding: ${({ theme }) => theme.spacing.lg};
`;

const Section = styled.section`
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const SectionTitle = styled.h2`
  margin: 0 0 ${({ theme }) => theme.spacing.md};
  font-size: ${({ theme }) => theme.typography.fontSize.xl};
  font-weight: ${({ theme }) => theme.typography.fontWeight.bold};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: ${({ theme }) => theme.spacing.md};
`;

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const Home = () => {
  const { recentlyPlayed } = useSelector((state) => state.track);
  const { playlists } = useSelector((state) => state.playlists);
  const { tracks } = useSelector((state) => state.track);

  // Get unique artists from tracks
  const artists = React.useMemo(() => {
    const artistMap = new Map();
    tracks.forEach(track => {
      if (!artistMap.has(track.artistId)) {
        artistMap.set(track.artistId, {
          id: track.artistId,
          name: track.artist,
          image: track.artistImage,
          monthlyListeners: track.artistMonthlyListeners || 0
        });
      }
    });
    return Array.from(artistMap.values()).sort((a, b) => b.monthlyListeners - a.monthlyListeners);
  }, [tracks]);

  return (
    <Container>
      <Section>
        <SectionTitle>Recently Played</SectionTitle>
        <List>
          {recentlyPlayed.slice(0, 5).map((track) => (
            <TrackCard key={track.id} track={track} />
          ))}
        </List>
      </Section>

      <Section>
        <SectionTitle>Your Playlists</SectionTitle>
        <Grid>
          {playlists.slice(0, 6).map((playlist) => (
            <PlaylistCard key={playlist.id} playlist={playlist} />
          ))}
        </Grid>
      </Section>

      <Section>
        <SectionTitle>Popular Artists</SectionTitle>
        <Grid>
          {artists.slice(0, 6).map((artist) => (
            <ArtistCard key={artist.id} artist={artist} />
          ))}
        </Grid>
      </Section>
    </Container>
  );
};

export default Home; 