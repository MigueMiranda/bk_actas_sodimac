const { Model, DataTypes } = require("sequelize");

const ELEMENTOS_TABLE = "elementos";

const ElementoSchema = {
  serial: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.STRING,
  },
  placa: {
    allowNull: false,
    type: DataTypes.STRING,
    unique: true,
  },
  tipo: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  ubicacion: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  fabricante: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  modelo: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  estado: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  adendo: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  fechaActualizacion: {
    field: "fecha_actualizacion",
    allowNull: false,
    type: DataTypes.DATE,
  },
  fechaAsignacion: {
    field: "fecha_asignacion",
    allowNull: true,
    type: DataTypes.DATE,
  },
  responsable: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  memoria: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  disco: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  ipCableada: {
    field: "ip_cableada",
    allowNull: true,
    type: DataTypes.STRING,
  },
  macCableada: {
    field: "mac_cableada",
    allowNull: false,
    type: DataTypes.STRING,
  },
  ipInalambrica: {
    field: "ip_inalambrica",
    allowNull: true,
    type: DataTypes.STRING,
  },
  macInalambrica: {
    field: "mac_inalambrica",
    allowNull: false,
    type: DataTypes.STRING,
  },
  teclado: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  mouse: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  propietario: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  hostname: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  observacion: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  userId: {
    field: "user_id",
    allowNull: false,
    type: DataTypes.STRING,
    references: {
      model: "users",
      key: "id",
    },
    onUpdate: "CASCADE",
    onDelete: "SET NULL",
  },
  tiendaId: {
    field: "tienda_id",
    allowNull: false,
    type: DataTypes.INTEGER,
    references: {
      model: "tiendas",
      key: "id",
    },
    onUpdate: "CASCADE",
    onDelete: "SET NULL",
  },
};

class Elemento extends Model {
  static associate(models) {
    this.belongsTo(models.User, {
      as: "usuario",
      foreignKey: "userId",
    });
    this.belongsTo(models.Tienda, {
      as: "tienda",
      foreignKey: "tiendaId",
    });
    this.hasMany(models.Movimiento, {
      as: "movimientos",
      foreignKey: "serial",
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: ELEMENTOS_TABLE,
      modelName: "Elemento",
      timestamps: false,
    };
  }
}

module.exports = { ELEMENTOS_TABLE, ElementoSchema, Elemento };
