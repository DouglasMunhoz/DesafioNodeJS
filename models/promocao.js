'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Promocao extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Promocao.belongsToMany(models.Cartao,
        {foreignKey: 'CartaoId', through: 'Compra', as: 'promocao_cartao'});
      Promocao.hasMany(models.Compra,
        {foreignKey: 'PromocaoId', as: 'compra'});
      Promocao.belongsTo(models.Empresa, 
        {foreignKey: 'EmpresaId', as: 'empresa'});
    }
  };
  Promocao.init({
    EmpresaId: DataTypes.INTEGER,
    nome: DataTypes.STRING,
    descricao: DataTypes.STRING,
    validade: DataTypes.DATEONLY
  }, {
    sequelize,
    modelName: 'Promocao',
  });
  return Promocao;
};