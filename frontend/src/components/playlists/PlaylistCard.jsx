import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import {
  PlayIcon,
  EllipsisHorizontalIcon,
  UserGroupIcon,
  PauseIcon,
} from '@heroicons/react/24/solid';
import { useDispatch, useSelector } from 'react-redux';
import { setCurrentTrack, togglePlay } from '../../store/slices/playerSlice';

const Card = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.colors.background.card};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  overflow: hidden;
  transition: ${({ theme }) => theme.transitions.default};
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.colors.background.hover};
  }
`;

const CoverContainer = styled.div`
  position: relative;
  width: 100%;
  padding-top: 100%;
  background: linear-gradient(135deg, 
    ${({ theme }) => theme.colors.primary}20, 
    ${({ theme }) => theme.colors.secondary}20
  );
`;

const CoverArt = styled.div`
  position: relative;
  width: 100%;
  padding-bottom: 100%;
  background-color: ${({ theme }) => theme.colors.background.default};
  overflow: hidden;
`;

const Image = styled.img`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const PlayButton = styled.button`
  position: absolute;
  bottom: ${({ theme }) => theme.spacing.sm};
  right: ${({ theme }) => theme.spacing.sm};
  width: 40px;
  height: 40px;
  background-color: ${({ theme }) => theme.colors.primary};
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transform: translateY(10px);
  transition: ${({ theme }) => theme.transitions.default};
  cursor: pointer;

  ${Card}:hover & {
    opacity: 1;
    transform: translateY(0);
  }

  svg {
    width: 20px;
    height: 20px;
    color: ${({ theme }) => theme.colors.text.primary};
  }
`;

const Content = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
`;

const Title = styled.h3`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const Description = styled.p`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
`;

const Meta = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.sm};
  font-size: ${({ theme }) => theme.typography.fontSize.xs};
  color: ${({ theme }) => theme.colors.text.secondary};
`;

const Collaborators = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const Avatar = styled.img`
  width: 20px;
  height: 20px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  border: 2px solid ${({ theme }) => theme.colors.background.card};
`;

const OptionsButton = styled.button`
  position: absolute;
  top: ${({ theme }) => theme.spacing.sm};
  right: ${({ theme }) => theme.spacing.sm};
  background: none;
  border: none;
  padding: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.text.primary};
  cursor: pointer;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  display: flex;
  align-items: center;
  justify-content: center;
  transition: ${({ theme }) => theme.transitions.default};
  opacity: 0;

  ${Card}:hover & {
    opacity: 1;
  }

  &:hover {
    background-color: ${({ theme }) => theme.colors.background.hover};
  }

  svg {
    width: 20px;
    height: 20px;
  }
`;

const PlaylistCard = ({ playlist }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentTrack, isPlaying } = useSelector((state) => state.player);

  const handleClick = () => {
    navigate(`/playlist/${playlist.id}`);
  };

  const handlePlay = (e) => {
    e.stopPropagation();
    if (currentTrack?.id === playlist.Tracks?.[0]?.id) {
      dispatch(togglePlay());
    } else if (playlist.Tracks?.length > 0) {
      dispatch(setCurrentTrack(playlist.Tracks[0]));
    }
  };

  const handleOptionsClick = (e) => {
    e.stopPropagation();
    // TODO: Implement playlist options menu
  };

  // Get the first track's album cover as the playlist cover if no custom cover is set
  const coverUrl = playlist.coverUrl || 
    (playlist.Tracks?.[0]?.Album?.imageUrl) || 
    'https://via.placeholder.com/200';

  // Get track count
  const trackCount = playlist.Tracks?.length || 0;

  // Get creator name
  const creatorName = playlist.User?.username || 'Unknown Creator';

  return (
    <Card onClick={handleClick}>
      <CoverContainer>
        <CoverArt>
          <Image src={coverUrl} alt={playlist.title} />
        </CoverArt>
        {trackCount > 0 && (
          <PlayButton onClick={handlePlay}>
            {isPlaying && currentTrack?.id === playlist.Tracks[0]?.id ? (
              <PauseIcon />
            ) : (
              <PlayIcon />
            )}
          </PlayButton>
        )}
        <OptionsButton onClick={handleOptionsClick}>
          <EllipsisHorizontalIcon />
        </OptionsButton>
      </CoverContainer>
      <Content>
        <Title>{playlist.title}</Title>
        <Description>{playlist.description || `A playlist by ${creatorName}`}</Description>
        <Meta>
          <span>{trackCount} tracks</span>
          <span>•</span>
          <span>By {creatorName}</span>
        </Meta>
      </Content>
    </Card>
  );
};

export default PlaylistCard; 