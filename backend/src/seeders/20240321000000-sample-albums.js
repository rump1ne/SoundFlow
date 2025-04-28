'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const albums = [
      {
        id: '550e8400-e29b-41d4-a716-446655440000',
        title: 'A Night at the Opera',
        artistId: '550e8400-e29b-41d4-a716-446655440000',
        spotifyId: '1GbtB4zTqAsyfZEsm1RZfx',
        releaseDate: '1975-11-21',
        imageUrl: 'https://i.scdn.co/image/ab67616d0000b2730bae7d0f1b1b3b3b3b3b3b3b3',
        totalTracks: 12,
        popularity: 85,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440001',
        title: 'Thriller',
        artistId: '550e8400-e29b-41d4-a716-446655440001',
        spotifyId: '2ANVost0y2y52ema1E9xAZ',
        releaseDate: '1982-11-30',
        imageUrl: 'https://i.scdn.co/image/ab67616d0000b2730bae7d0f1b1b3b3b3b3b3b3b3',
        totalTracks: 9,
        popularity: 90,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440002',
        title: '÷ (Divide)',
        artistId: '550e8400-e29b-41d4-a716-446655440002',
        spotifyId: '6H6OQvpP9QY7I2wIRsPfV0',
        releaseDate: '2017-03-03',
        imageUrl: 'https://i.scdn.co/image/ab67616d0000b2730bae7d0f1b1b3b3b3b3b3b3b3',
        totalTracks: 16,
        popularity: 88,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await queryInterface.bulkInsert('Albums', albums, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Albums', null, {});
  }
}; 