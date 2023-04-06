const Sequelize = require("sequelize");

const db_host = "localhost";
const db_port = 5432;
const db_name = "vending-machine";
const db_user = "root";
const db_password = "root";

const sequelize = new Sequelize({
    dialect: "postgres",
    host: db_host,
    port: db_port,
    database: db_name,
    username: db_user,
    password: db_password,
});

module.exports = sequelize;
