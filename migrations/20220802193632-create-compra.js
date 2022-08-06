'use strict';
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Compras', {
      CartaoId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
        references:{
          model: 'cartoes',
          key: 'id'
        },
        OnUpdate: 'CASCADE',
        OnDelete: 'CASCADE'
      },
      PromocaoId: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.INTEGER,
        references:{
          model: 'promocoes',
          key: 'id'
        },
        OnUpdate: 'CASCADE',
        OnDelete: 'CASCADE'
      },
      data: {
        type: Sequelize.DATEONLY
      },
      quantidade: {
        type: Sequelize.INTEGER
      },
      valor: {
        type: Sequelize.FLOAT
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
    await queryInterface.dropTable('Compras');
  }
};