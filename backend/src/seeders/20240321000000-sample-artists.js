'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const artists = [
      {
        id: '550e8400-e29b-41d4-a716-446655440000',
        name: 'Queen',
        spotifyId: '1dfeR4HaWDbWqFHLkxsg1d',
        popularity: 80,
        followers: 20000000,
        genres: ['rock', 'classic rock', 'glam rock'],
        imageUrl: 'https://i.scdn.co/image/ab6761610000e5eb0bae7d0f1b1b3b3b3b3b3b3b3',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440001',
        name: 'Michael Jackson',
        spotifyId: '3fMbdgg4jU18AjLCKBhRSm',
        popularity: 85,
        followers: 25000000,
        genres: ['pop', 'r&b', 'soul'],
        imageUrl: 'https://i.scdn.co/image/ab6761610000e5eb0bae7d0f1b1b3b3b3b3b3b3b3',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440002',
        name: 'Ed Sheeran',
        spotifyId: '6eUKZXaKkcviH0Ku9w2n3V',
        popularity: 90,
        followers: 30000000,
        genres: ['pop', 'singer-songwriter', 'folk-pop'],
        imageUrl: 'https://i.scdn.co/image/ab6761610000e5eb0bae7d0f1b1b3b3b3b3b3b3b3',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    await queryInterface.bulkInsert('Artists', artists, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Artists', null, {});
  }
}; 