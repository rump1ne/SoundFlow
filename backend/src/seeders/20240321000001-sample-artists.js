'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Artists', [
      {
        id: '550e8400-e29b-41d4-a716-446655440000',
        name: 'Queen',
        spotifyId: '1dfeR4HaWDbWqFHLkxsg1d',
        imageUrl: 'https://i.scdn.co/image/b040846ceba13c3e9c125d68389491094e7f2982',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440001',
        name: 'Michael Jackson',
        spotifyId: '3fMbdgg4jU18AjLCKBhRSm',
        imageUrl: 'https://i.scdn.co/image/ab6761610000e5eb0e08ea2c4d6789fbf5cbe0aa',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440002',
        name: 'Ed Sheeran',
        spotifyId: '6eUKZXaKkcviH0Ku9w2n3V',
        imageUrl: 'https://i.scdn.co/image/ab6761610000e5eb3bcef85e105dfc42399ef0ba',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Artists', null, {});
  }
}; 