import React from 'react';
import styled from 'styled-components';
import { theme } from '../styles/theme';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.xl};
`;

const PageHeader = styled.div`
  margin-bottom: ${theme.spacing.xl};
`;

const PageTitle = styled.h1`
  color: ${theme.colors.text.primary};
  font-size: ${theme.typography.h3.fontSize};
  font-weight: ${theme.typography.h3.fontWeight};
  margin-bottom: ${theme.spacing.xs};
`;

const PageDescription = styled.p`
  color: ${theme.colors.text.secondary};
  font-size: ${theme.typography.body1.fontSize};
`;

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${theme.spacing.lg};
`;

const SectionTitle = styled.h2`
  color: ${theme.colors.text.primary};
  font-size: ${theme.typography.h4.fontSize};
  font-weight: ${theme.typography.h4.fontWeight};
  margin-bottom: ${theme.spacing.md};
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: ${theme.spacing.lg};
`;

const FeaturedArtistGrid = styled(Grid)`
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
`;

const Card = styled.div`
  background-color: ${theme.colors.background.elevated};
  border-radius: ${theme.borderRadius.md};
  overflow: hidden;
  transition: all ${theme.transitions.duration.standard}ms;
  cursor: pointer;

  &:hover {
    transform: translateY(-4px);
    background-color: ${theme.colors.background.paper};
  }
`;

const CardImage = styled.img`
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
`;

const CardContent = styled.div`
  padding: ${theme.spacing.md};
`;

const CardTitle = styled.h3`
  color: ${theme.colors.text.primary};
  font-size: ${theme.typography.body1.fontSize};
  font-weight: ${theme.typography.h6.fontWeight};
  margin-bottom: ${theme.spacing.xs};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CardSubtitle = styled.p`
  color: ${theme.colors.text.secondary};
  font-size: ${theme.typography.body2.fontSize};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const ArtistCard = styled(Card)`
  text-align: center;

  ${CardImage} {
    border-radius: ${theme.borderRadius.full};
    padding: ${theme.spacing.sm};
  }

  ${CardContent} {
    padding: ${theme.spacing.sm} ${theme.spacing.md};
  }
`;

const Badge = styled.span`
  background-color: ${theme.colors.primary.main};
  color: ${theme.colors.primary.contrastText};
  font-size: ${theme.typography.caption.fontSize};
  padding: ${theme.spacing.xs} ${theme.spacing.sm};
  border-radius: ${theme.borderRadius.full};
  margin-left: ${theme.spacing.sm};
`;

const Tab = styled.button`
  color: ${props => props.$active ? theme.colors.primary.main : theme.colors.text.primary};
  border-bottom: 2px solid ${props => props.$active ? theme.colors.primary.main : 'transparent'};
`;

const WhatsNew = () => {
  // Mock data - replace with actual API calls later
  const newReleases = [
    { id: 1, title: 'Midnight', artist: 'Taylor Swift', cover: 'https://picsum.photos/200?11', isNew: true },
    { id: 2, title: 'Renaissance', artist: 'Beyoncé', cover: 'https://picsum.photos/200?12', isNew: true },
    { id: 3, title: 'Un Verano Sin Ti', artist: 'Bad Bunny', cover: 'https://picsum.photos/200?13', isNew: true },
    { id: 4, title: 'Harry\'s House', artist: 'Harry Styles', cover: 'https://picsum.photos/200?14', isNew: true },
    { id: 5, title: '30', artist: 'Adele', cover: 'https://picsum.photos/200?15', isNew: true },
  ];

  const trendingTracks = [
    { id: 1, title: 'Anti-Hero', artist: 'Taylor Swift', cover: 'https://picsum.photos/200?16' },
    { id: 2, title: 'Unholy', artist: 'Sam Smith & Kim Petras', cover: 'https://picsum.photos/200?17' },
    { id: 3, title: 'As It Was', artist: 'Harry Styles', cover: 'https://picsum.photos/200?18' },
    { id: 4, title: 'About Damn Time', artist: 'Lizzo', cover: 'https://picsum.photos/200?19' },
    { id: 5, title: 'Break My Soul', artist: 'Beyoncé', cover: 'https://picsum.photos/200?20' },
  ];

  const featuredArtists = [
    { id: 1, name: 'Taylor Swift', image: 'https://picsum.photos/150?21', followers: '95.4M' },
    { id: 2, name: 'Drake', image: 'https://picsum.photos/150?22', followers: '75.2M' },
    { id: 3, name: 'The Weeknd', image: 'https://picsum.photos/150?23', followers: '52.8M' },
    { id: 4, name: 'Ariana Grande', image: 'https://picsum.photos/150?24', followers: '85.1M' },
    { id: 5, name: 'Ed Sheeran', image: 'https://picsum.photos/150?25', followers: '111.5M' },
    { id: 6, name: 'Dua Lipa', image: 'https://picsum.photos/150?26', followers: '42.3M' },
  ];

  const [activeTab, setActiveTab] = React.useState('New Releases');

  return (
    <PageContainer>
      <PageHeader>
        <PageTitle>What's New</PageTitle>
        <PageDescription>Stay up to date with the latest releases and trending tracks</PageDescription>
      </PageHeader>

      <Section>
        <SectionTitle>New Releases</SectionTitle>
        <Grid>
          {newReleases.map((album) => (
            <Card key={album.id}>
              <CardImage src={album.cover} alt={album.title} />
              <CardContent>
                <CardTitle>
                  {album.title}
                  {album.isNew && <Badge>New</Badge>}
                </CardTitle>
                <CardSubtitle>{album.artist}</CardSubtitle>
              </CardContent>
            </Card>
          ))}
        </Grid>
      </Section>

      <Section>
        <SectionTitle>Trending Now</SectionTitle>
        <Grid>
          {trendingTracks.map((track) => (
            <Card key={track.id}>
              <CardImage src={track.cover} alt={track.title} />
              <CardContent>
                <CardTitle>{track.title}</CardTitle>
                <CardSubtitle>{track.artist}</CardSubtitle>
              </CardContent>
            </Card>
          ))}
        </Grid>
      </Section>

      <Section>
        <SectionTitle>Featured Artists</SectionTitle>
        <FeaturedArtistGrid>
          {featuredArtists.map((artist) => (
            <ArtistCard key={artist.id}>
              <CardImage src={artist.image} alt={artist.name} />
              <CardContent>
                <CardTitle>{artist.name}</CardTitle>
                <CardSubtitle>{artist.followers} followers</CardSubtitle>
              </CardContent>
            </ArtistCard>
          ))}
        </FeaturedArtistGrid>
      </Section>

      <Tab
        key={activeTab}
        $active={activeTab === 'New Releases'}
        onClick={() => setActiveTab('New Releases')}
      >
        New Releases
      </Tab>
      <Tab
        key={activeTab}
        $active={activeTab === 'Trending Now'}
        onClick={() => setActiveTab('Trending Now')}
      >
        Trending Now
      </Tab>
      <Tab
        key={activeTab}
        $active={activeTab === 'Featured Artists'}
        onClick={() => setActiveTab('Featured Artists')}
      >
        Featured Artists
      </Tab>
    </PageContainer>
  );
};

export default WhatsNew; 