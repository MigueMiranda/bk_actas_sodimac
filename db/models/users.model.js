const { Model, DataTypes } = require("sequelize");

const USER_TABLE = "users";

const UserSchema = {
  id: {
    allowNull: false,
    primaryKey: true,
    type: DataTypes.STRING,
  },
  name: {
    allowNull: false,
    type: DataTypes.STRING,
    unique: true,
  },
  password: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  recoveryToken: {
    field: 'recovery_token',
    allowNull: true,
    type: DataTypes.STRING
  },
  cargo: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  estate: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  compañia: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  username: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  departamento: {
    allowNull: false,
    type: DataTypes.STRING,
  },
};

class User extends Model {
  static associate(models) {
    // UN Usuario TIENE MUCHOS elementos
    this.hasMany(models.Elemento, {
      as: 'elementos',
      foreignKey: 'userId'
    });
  }

  static config(sequelize) {
    return {
      sequelize,
      tableName: USER_TABLE,
      modelName: 'User',
      timestamps: false
    }
  }
}


module.exports = { USER_TABLE, UserSchema, User };
