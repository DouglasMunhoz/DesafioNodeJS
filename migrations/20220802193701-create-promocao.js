'use strict';
module.exports = {
   async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Promocaos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      EmpresaId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references:{
          model: 'empresas',
          key: 'id'
        },
        OnUpdate: 'CASCADE',
        OnDelete: 'CASCADE'
      },
      nome: {
        type: Sequelize.STRING
      },
      descricao: {
        type: Sequelize.STRING
      },
      validade: {
        type: Sequelize.DATEONLY
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
   async down (queryInterface, Sequelize)  {
    await queryInterface.dropTable('Promocaos');
  }
};