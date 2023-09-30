// const { DataTypes } = require("sequelize");
// const sequelize = require("../db-connect");

// const User = sequelize.define("user", {
//   id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
//   email: { type: DataTypes.STRING, allowNull: true },
//   username: { type: DataTypes.STRING, allowNull: false },
//   password: { type: DataTypes.STRING, allowNull: false },
//   logins: { type: DataTypes.INTEGER, allowNull: true },
//   last_login: { type: DataTypes.STRING, allowNull: true },
//   verification: { type: DataTypes.INTEGER, allowNull: true },
//   name: { type: DataTypes.STRING, allowNull: true },
// });

// module.exports = User

const { DataTypes } = require("sequelize");
const sequelize = require("../dbSetup");


const Tutorial = sequelize.define("tutorial", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    email: { type: DataTypes.STRING, allowNull: true },
})
const Tag = sequelize.define("tag", {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user: { type: DataTypes.STRING, allowNull: true },
})

Tutorial.belongsToMany(Tag, {
    through: "tutorial_tag",
    as: "tags",
    foreignKey: "tutorial_id",
});

Tag.belongsToMany(Tutorial, {
    through: "tutorial_tag",
    as: "tutorials",
    foreignKey: "tag_id",
});



module.exports = {Tutorial, Tag}