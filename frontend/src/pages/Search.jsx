import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { theme } from '../styles/theme';
import TrackCard from '../components/tracks/TrackCard';
import PlaylistCard from '../components/playlists/PlaylistCard';
import Icon from '../components/common/Icon';

const Container = styled.div`
  padding: 2rem;
`;

const SearchHeader = styled.div`
  margin-bottom: 2rem;
`;

const SearchInputWrapper = styled.div`
  position: relative;
  max-width: 720px;
  margin-bottom: ${theme.spacing.xl};
`;

const SearchIcon = styled(MagnifyingGlassIcon)`
  position: absolute;
  left: ${theme.spacing.md};
  top: 50%;
  transform: translateY(-50%);
  width: 24px;
  height: 24px;
  color: ${theme.colors.text.secondary};
`;

const SearchInput = styled.input`
  width: 100%;
  max-width: 600px;
  padding: 1rem;
  font-size: 1.5rem;
  border: none;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  background-color: ${({ theme }) => theme.colors.background.paper};
  color: ${({ theme }) => theme.colors.text.primary};
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px ${({ theme }) => theme.colors.primary.main};
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.text.secondary};
  }
`;

const ResultsSection = styled.section`
  margin-top: 2rem;
`;

const ResultsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1rem;
`;

const ResultCard = styled.div`
  padding: 1rem;
  background-color: ${({ theme }) => theme.colors.background.paper};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.background.hover};
  }
`;

const NoResults = styled.div`
  text-align: center;
  color: ${({ theme }) => theme.colors.text.secondary};
  padding: 2rem;
`;

const CategorySection = styled.section`
  margin-top: 2rem;
`;

const CategoryTitle = styled.h2`
  margin-bottom: 1rem;
  color: ${({ theme }) => theme.colors.text.primary};
`;

const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1rem;
`;

const CategoryCard = styled.div`
  aspect-ratio: 1;
  background-color: ${({ theme }) => theme.colors.background.paper};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: transform 0.2s ease;
  overflow: hidden;
  position: relative;

  &:hover {
    transform: scale(1.05);
  }
`;

const CategoryImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const CategoryName = styled.span`
  position: absolute;
  bottom: 1rem;
  left: 1rem;
  color: white;
  font-weight: bold;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
`;

function Search() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const dispatch = useDispatch();

  const categories = [
    { id: 1, name: 'Pop', image: 'path/to/pop.jpg' },
    { id: 2, name: 'Rock', image: 'path/to/rock.jpg' },
    { id: 3, name: 'Hip Hop', image: 'path/to/hiphop.jpg' },
    { id: 4, name: 'Electronic', image: 'path/to/electronic.jpg' },
    { id: 5, name: 'Jazz', image: 'path/to/jazz.jpg' },
    { id: 6, name: 'Classical', image: 'path/to/classical.jpg' },
  ];

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    
    // TODO: Implement actual search logic with Redux
    if (query.trim()) {
      // Mock search results for now
      setSearchResults([
        { id: 1, type: 'track', title: 'Sample Track', artist: 'Sample Artist' },
        { id: 2, type: 'playlist', name: 'Sample Playlist', tracks: 12 },
      ]);
    } else {
      setSearchResults(null);
    }
  };

  return (
    <Container>
      <SearchHeader>
        <SearchInputWrapper>
          <SearchIcon />
          <SearchInput
            type="text"
            placeholder="What do you want to listen to?"
            value={searchQuery}
            onChange={handleSearch}
          />
        </SearchInputWrapper>
      </SearchHeader>

      {searchResults ? (
        <ResultsSection>
          <ResultsGrid>
            {searchResults.map((result) => (
              <ResultCard key={result.id}>
                {result.type === 'track' ? (
                  <div>
                    <h3>{result.title}</h3>
                    <p>{result.artist}</p>
                  </div>
                ) : (
                  <div>
                    <h3>{result.name}</h3>
                    <p>{result.tracks} tracks</p>
                  </div>
                )}
              </ResultCard>
            ))}
          </ResultsGrid>
        </ResultsSection>
      ) : (
        <CategorySection>
          <CategoryTitle>Browse All</CategoryTitle>
          <CategoryGrid>
            {categories.map((category) => (
              <CategoryCard key={category.id}>
                <CategoryImage src={category.image} alt={category.name} />
                <CategoryName>{category.name}</CategoryName>
              </CategoryCard>
            ))}
          </CategoryGrid>
        </CategorySection>
      )}

      {searchResults?.length === 0 && (
        <NoResults>
          No results found for "{searchQuery}"
        </NoResults>
      )}
    </Container>
  );
}

export default Search; 