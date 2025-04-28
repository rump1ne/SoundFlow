'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const genres = [
      { id: uuidv4(), name: 'Rock', created_at: new Date(), updated_at: new Date() },
      { id: uuidv4(), name: 'Pop', created_at: new Date(), updated_at: new Date() },
      { id: uuidv4(), name: 'Hip Hop', created_at: new Date(), updated_at: new Date() },
      { id: uuidv4(), name: 'Electronic', created_at: new Date(), updated_at: new Date() },
      { id: uuidv4(), name: 'Jazz', created_at: new Date(), updated_at: new Date() },
      { id: uuidv4(), name: 'Classical', created_at: new Date(), updated_at: new Date() },
      { id: uuidv4(), name: 'R&B', created_at: new Date(), updated_at: new Date() },
      { id: uuidv4(), name: 'Country', created_at: new Date(), updated_at: new Date() },
      { id: uuidv4(), name: 'Blues', created_at: new Date(), updated_at: new Date() },
      { id: uuidv4(), name: 'Metal', created_at: new Date(), updated_at: new Date() }
    ];

    await queryInterface.bulkInsert('genres', genres, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('genres', null, {});
  }
}; 