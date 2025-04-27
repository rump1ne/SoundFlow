import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

const Card = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.background.card};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  transition: ${({ theme }) => theme.transitions.default};
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.colors.background.hover};
  }
`;

const Avatar = styled.div`
  width: 120px;
  height: 120px;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  overflow: hidden;
  margin-bottom: ${({ theme }) => theme.spacing.md};
  background-color: ${({ theme }) => theme.colors.background.default};
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const Info = styled.div`
  text-align: center;
`;

const Name = styled.h3`
  margin: 0;
  font-size: ${({ theme }) => theme.typography.fontSize.base};
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const Stats = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.text.secondary};
  font-size: ${({ theme }) => theme.typography.fontSize.sm};
`;

const Stat = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StatValue = styled.span`
  font-weight: ${({ theme }) => theme.typography.fontWeight.medium};
  color: ${({ theme }) => theme.colors.text.primary};
`;

const ArtistCard = ({ artist }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/artist/${artist.id}`);
  };

  return (
    <Card onClick={handleClick}>
      <Avatar>
        <Image src={artist.avatar} alt={artist.name} />
      </Avatar>
      <Info>
        <Name>{artist.name}</Name>
        <Stats>
          <Stat>
            <StatValue>{artist.tracks}</StatValue>
            <span>Tracks</span>
          </Stat>
          <Stat>
            <StatValue>{artist.followers}</StatValue>
            <span>Followers</span>
          </Stat>
        </Stats>
      </Info>
    </Card>
  );
};

export default ArtistCard; 