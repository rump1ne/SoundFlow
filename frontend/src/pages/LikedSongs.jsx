import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styled from 'styled-components';

const Container = styled.div`
  padding: 2rem;
`;

const Header = styled.div`
  display: flex;
  align-items: flex-end;
  gap: 2rem;
  margin-bottom: 2rem;
`;

const CoverArt = styled.div`
  width: 232px;
  height: 232px;
  background: linear-gradient(135deg, ${({ theme }) => theme.colors.primary.main}, ${({ theme }) => theme.colors.secondary.main});
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Title = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.text.primary};
  margin: 0;
`;

const Meta = styled.div`
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const TrackList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const TrackHeader = styled.div`
  display: grid;
  grid-template-columns: 48px 4fr 3fr 2fr 1fr;
  padding: 0.5rem 1rem;
  color: ${({ theme }) => theme.colors.text.secondary};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 0.875rem;
`;

const Track = styled.div`
  display: grid;
  grid-template-columns: 48px 4fr 3fr 2fr 1fr;
  padding: 0.5rem 1rem;
  align-items: center;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.colors.background.hover};
  }
`;

function LikedSongs() {
  const dispatch = useDispatch();
  const likedSongs = useSelector(state => state.playlists.likedSongs);

  return (
    <Container>
      <Header>
        <CoverArt>
          <svg width="64" height="64" viewBox="0 0 24 24" fill="white">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/>
          </svg>
        </CoverArt>
        <Info>
          <Title>Liked Songs</Title>
          <Meta>{likedSongs?.length || 0} songs</Meta>
        </Info>
      </Header>

      <TrackList>
        <TrackHeader>
          <span>#</span>
          <span>Title</span>
          <span>Artist</span>
          <span>Album</span>
          <span>Duration</span>
        </TrackHeader>
        {likedSongs?.map((track, index) => (
          <Track key={track.id}>
            <span>{index + 1}</span>
            <span>{track.title}</span>
            <span>{track.artist}</span>
            <span>{track.album}</span>
            <span>{track.duration}</span>
          </Track>
        ))}
      </TrackList>
    </Container>
  );
}

export default LikedSongs; 