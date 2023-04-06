"use strict";
const sequelize = require("./database");
const { Model, DataTypes } = require("sequelize");

class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {}
}

Product.init(
    {
        id: {
            type: DataTypes.UUID,
            primaryKey: true,
            allowNull: false,
            unique: true,
        },
        amountAvailable: {
            type: DataTypes.INTEGER,
            allowNull: false,
            default: 0,
        },
        cost: {
            type: DataTypes.INTEGER,
            allowNull: false,
            default: 0,
        },
        productName: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        productId: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
    },
    {
        sequelize,
        modelName: "Product",
        tableName: "products",
        timestamps: true,
    }
);

module.exports = Product;
