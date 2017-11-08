'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('review', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      reviewerId: {
         type: Sequelize.INTEGER,
         references: {
           model: 'reviewer',
           key: 'id'
         },
         allowNull: false
       },
      stars: {
        allowNull: false,
        type: Sequelize.INTEGER,
        default: 1
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false
      },
      review: {
        type: Sequelize.STRING,
        allowNull: false
      },
      restaurantId: {
         type: Sequelize.INTEGER,
         references: {
           model: 'restaurant',
           key: 'id'
         },
         allowNull: false
       },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('review');
  }
};
