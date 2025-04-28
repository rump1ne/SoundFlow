'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const users = [
      {
        id: '550e8400-e29b-41d4-a716-446655440000',
        username: 'queen_official',
        email: 'queen@example.com',
        password: await bcrypt.hash('password123', 10),
        user_type: 'user',
        artist_id: '550e8400-e29b-41d4-a716-446655440000',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440001',
        username: 'mj_official',
        email: 'mj@example.com',
        password: await bcrypt.hash('password123', 10),
        user_type: 'user',
        artist_id: '550e8400-e29b-41d4-a716-446655440001',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: '550e8400-e29b-41d4-a716-446655440002',
        username: 'edsheeran',
        email: 'ed@example.com',
        password: await bcrypt.hash('password123', 10),
        user_type: 'user',
        artist_id: '550e8400-e29b-41d4-a716-446655440002',
        created_at: new Date(),
        updated_at: new Date()
      }
    ];

    await queryInterface.bulkInsert('users', users, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {});
  }
}; 