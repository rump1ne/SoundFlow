'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create albums
    const albums = [
      {
        id: '550e8400-e29b-41d4-a716-446655441100',
        artistId: '550e8400-e29b-41d4-a716-446655440000', // Queen
        title: 'A Night at the Opera',
        releaseDate: new Date('1975-10-31'),
        imageUrl: 'https://i.scdn.co/image/ab67616d0000b273e8b066e70f0d0b7d5a0a0e1e',
        spotifyId: '1GbtB4zTqAsyfZEsm1RZfx',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '550e8400-e29b-41d4-a716-446655441101',
        artistId: '550e8400-e29b-41d4-a716-446655440001', // Michael Jackson
        title: 'Thriller',
        releaseDate: new Date('1983-01-02'),
        imageUrl: 'https://i.scdn.co/image/ab67616d0000b273b0c9e9c9d9c9d9c9d9c9d9c9',
        spotifyId: '2ANVost0y2y52ema1E9xAZ',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '550e8400-e29b-41d4-a716-446655441102',
        artistId: '550e8400-e29b-41d4-a716-446655440002', // Ed Sheeran
        title: '÷',
        releaseDate: new Date('2017-01-06'),
        imageUrl: 'https://i.scdn.co/image/ab67616d0000b273c0c9e9c9d9c9d9c9d9c9d9c9',
        spotifyId: '3T4tUhGYeRNVUGevb0wThu',
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