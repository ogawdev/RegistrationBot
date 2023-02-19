const { Sequelize } = require("sequelize");
const { DB_URL } = require("../config");
const { Users, Appeals } = require("./models");

const sequelize = new Sequelize(DB_URL, {
  //   logging: (e) => console.log("SQL", e),
  logging: false,
});

async function postgres() {
  try {
    const db = {};

    // models
    db.users = await Users(Sequelize, sequelize);
    db.appeals = await Appeals(Sequelize, sequelize);

    sequelize.sync({ force: false });
    return db;
  } catch (e) {
    console.log("DB ERROR", e);
  }
}

postgres();
module.exports = postgres;
