const { Model, DataTypes } = require("sequelize");

const MOVIMIENTO_TABLE = "movimientos";

const MovimientoSchema = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER,
  },
  serial: {
    allowNull: false,
    type: DataTypes.STRING,
    references: {
      model: "elementos",
      key: "serial",
    },
    onUpdate: "CASCADE",
    onDelete: "RESTRICT",
  },
  contactoId: {
    field: "contacto_id",
    allowNull: false,
    type: DataTypes.STRING,
    references: {
      model: "users",
      key: "id",
    },
    onUpdate: "CASCADE",
    onDelete: "RESTRICT",
  },
  estadoAsignacion: {
    field: "estado_asignacion",
    allowNull: false,
    type: DataTypes.STRING,
  },
  estadoElemento: {
    field: "estado_elemento",
    allowNull: true,
    type: DataTypes.STRING,
  },
  tiendaId: {
    field: "tienda_id",
    allowNull: true,
    type: DataTypes.INTEGER,
  },
  ubicacionElemento: {
    field: "ubicacion_elemento",
    allowNull: true,
    type: DataTypes.STRING,
  },
  caso: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  acta: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  asignacionId: {
    field: "asignacion_id",
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: "asignaciones",
      key: "id",
    },
    onUpdate: "CASCADE",
    onDelete: "SET NULL",
  },
};

class Movimiento extends Model {
  static associate(models) {
    this.belongsTo(models.Elemento, {
      as: "elemento",
      foreignKey: "serial",
    });

    this.belongsTo(models.User, {
      as: "users",
      foreignKey: "contacto_id",
    });

    this.belongsTo(models.Asignaciones, {
      as: "asignacion",
      foreignKey: "asignacion_id",
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: MOVIMIENTO_TABLE,
      modelName: "Movimiento",
      timestamps: false,
    };
  }
}

module.exports = { MOVIMIENTO_TABLE, MovimientoSchema, Movimiento };
