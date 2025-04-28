'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create tracks
    const tracks = [
      {
        id: '550e8400-e29b-41d4-a716-446655441000',
        albumId: '550e8400-e29b-41d4-a716-446655441100',
        artistId: '550e8400-e29b-41d4-a716-446655440000', // Queen
        title: 'Bohemian Rhapsody',
        duration: 354,
        spotifyId: '7tFiyTwD0nx5a1eklYtX2J',
        previewUrl: 'https://p.scdn.co/mp3-preview/d11f57bca6c0f2d24d4ba3d714f211fcec7aa4d9',
        popularity: 82,
        explicit: false,
        danceability: 0.402,
        energy: 0.902,
        key: 0,
        loudness: -9.928,
        mode: 0,
        tempo: 72.02,
        timeSignature: 4,
        instrumentalness: 0.000522,
        valence: 0.264,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '550e8400-e29b-41d4-a716-446655441001',
        albumId: '550e8400-e29b-41d4-a716-446655441101',
        artistId: '550e8400-e29b-41d4-a716-446655440001', // Michael Jackson
        title: 'Billie Jean',
        duration: 294,
        spotifyId: '5ChkMS8OtdzJeqyybCc9R5',
        previewUrl: 'https://p.scdn.co/mp3-preview/f504e6b8e037771318656394f532dede4f9bcaea',
        popularity: 80,
        explicit: false,
        danceability: 0.894,
        energy: 0.731,
        key: 6,
        loudness: -3.227,
        mode: 0,
        tempo: 117.067,
        timeSignature: 4,
        instrumentalness: 0.0102,
        valence: 0.818,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '550e8400-e29b-41d4-a716-446655441002',
        albumId: '550e8400-e29b-41d4-a716-446655441102',
        artistId: '550e8400-e29b-41d4-a716-446655440002', // Ed Sheeran
        title: 'Shape of You',
        duration: 234,
        spotifyId: '7qiZfU4dY1lWllzX7mPBI3',
        previewUrl: 'https://p.scdn.co/mp3-preview/84462d8e1e4d0f9e5ccd06f0da390f65843774a2',
        popularity: 84,
        explicit: false,
        danceability: 0.825,
        energy: 0.652,
        key: 1,
        loudness: -3.183,
        mode: 0,
        tempo: 95.977,
        timeSignature: 4,
        instrumentalness: 0.000892,
        valence: 0.931,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await queryInterface.bulkInsert('Tracks', tracks, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Tracks', null, {});
  }
}; 