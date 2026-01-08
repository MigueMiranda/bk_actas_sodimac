const { Model, DataTypes } = require("sequelize");

const TIENDAS_TABLE = "tienda";

const TiendaSchema = {
  id: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  nombre: {
    allowNull: false,
    type: DataTypes.STRING,
    unique: true,
  },
};
class Tienda extends Model {
  static associate(models) {
    this.hasMany(models.Elemento, {
      as: "elementos",
      foreignKey: "tiendaId",
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: TIENDAS_TABLE,
      modelName: "Tienda",
      timestamps: false,
    };
  }
}
module.exports = { TIENDAS_TABLE, TiendaSchema, Tienda };
