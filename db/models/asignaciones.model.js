const { Model, DataTypes, Sequelize } = require("sequelize");

const ASIGNACIONES_TABLE = "asignaciones";

const AsignacionesSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  contacto_id: {
    allowNull: false,
    type: DataTypes.STRING,
    onUpdate: "CASCADE",
    onDelete: "SET NULL",
  },
  estado_asignacion: {
    allowNull: false,
    type: DataTypes.STRING,
    defaultValue: "pendiente",
  },
  token: {
    allowNull: false,
    unique: true,
    type: DataTypes.STRING,
  },
  tokenExpire: {
    field: "token_expire",
    type: DataTypes.DATE,
    allowNull: false,
  },
  acta: {
    allowNull: true,
    type: DataTypes.STRING, // ruta o URL del PDF
  },
  created_at: {
    allowNull: false,
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
  },
};

class Asignaciones extends Model {
  static associate(models) {
    this.hasMany(models.Movimiento, {
      as: "elementos",
      foreignKey: "asignacion_id",
    });

    this.belongsTo(models.User, {
      as: "users",
      foreignKey: "contacto_id",
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: ASIGNACIONES_TABLE,
      modelName: "Asignaciones",
      timestamps: false,
    };
  }
}

module.exports = { ASIGNACIONES_TABLE, AsignacionesSchema, Asignaciones };
