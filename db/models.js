const { DataTypes } = require("sequelize");
const sequelize = require("./dbSetup");

const User = sequelize.define("user", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email: { type: DataTypes.STRING, allowNull: true },
  username: { type: DataTypes.STRING, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  logins: { type: DataTypes.INTEGER, allowNull: true },
  last_login: { type: DataTypes.STRING, allowNull: true },
  verification: { type: DataTypes.INTEGER, allowNull: true },
  name: { type: DataTypes.STRING, allowNull: true },
});

const Token = sequelize.define("token", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  refresh_token: { type: DataTypes.TEXT('medium'), allowNull: false },
});


const Teacher = sequelize.define("teacher", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  school: { type: DataTypes.STRING, allowNull: false },
});

const Role = sequelize.define("role", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.STRING, allowNull: false },
});

User.hasOne(Token, {
    foreignKey: 'user_id'
});

User.hasOne(Teacher, {
    foreignKey: 'user_id'
});

User.belongsToMany(Role, { through: 'roles_users' })

Role.belongsToMany(User, { through: 'roles_users' })

module.exports = {User, Role, Teacher, Token}