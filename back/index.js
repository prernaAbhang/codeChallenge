const express = require("express");
const cors = require("cors");
const app = express();
const port = 9000;
const { verifyToken, verifyBuyerToken, verifySellerToken } = require("./authorization");

const CreateUserApi = require("./resources/users/apis/create-user-api");
const GetUserApi = require("./resources/users/apis/get-user-api");
const UpdateUserApi = require("./resources/users/apis/update-user-api");
const DeleteUserApi = require("./resources/users/apis/delete-user-api");
const UserLoginApi = require("./resources/users/apis/user-login-api");

const CreateProductApi = require("./resources/products/apis/create-product-api");
const GetProductsApi = require("./resources/products/apis/get-products-api");
const UpdateProductApi = require("./resources/products/apis/update-product-api");
const DeleteProductApi = require("./resources/products/apis/delete-product-api");

const DepositAmountApi = require("./resources/users/apis/deposit-coins-api");
const BuyProductsApi = require("./resources/products/apis/buy-products-api");
const ResetDepositApi = require("./resources/users/apis/reset-deposit-api");

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.post("/users", async (req, res) => {
    const userData = req.body;
    const response = await CreateUserApi.create(userData);
    return res.send(response);
});

app.post("/login", async (req, res) => {
    const userData = req.body;
    const response = await UserLoginApi.login(userData);
    return res.send(response);
});

app.get("/users/:userName", verifyToken, async (req, res) => {
    const response = await GetUserApi.get(req.params.userName);
    return res.send(response);
});

app.put("/users/:userName", verifyToken, async (req, res) => {
    const userData = req.body;
    const response = await UpdateUserApi.update(req.params.userName, userData);
    return res.send(response);
});

app.delete("/users/:userName", verifyToken, async (req, res) => {
    const response = await DeleteUserApi.delete(req.params.userName);
    return res.send(response);
});

app.post("/reset", verifyBuyerToken, async (req, res) => {
    const { userName } = req.body;
    const response = await ResetDepositApi.reset(userName);
    return res.send(response);
});

app.post("/products", verifySellerToken, async (req, res) => {
    const productData = req.body;
    const response = await CreateProductApi.create(productData);
    return res.send(response);
});

app.get("/products", verifyToken, async (req, res) => {
    const response = await GetProductsApi.get();
    return res.send(response);
});

app.put("/products/:productId", verifySellerToken, async (req, res) => {
    const productData = req.body;
    const response = await UpdateProductApi.update(req.params.productId, productData);
    return res.send(response);
});

app.delete("/products/:productId", verifySellerToken, async (req, res) => {
    const response = await DeleteProductApi.delete(req.params.productId);
    return res.send(response);
});

app.post("/deposit", verifyBuyerToken, async (req, res) => {
    const { userName, amount } = req.body;
    const response = await DepositAmountApi.deposit(userName, amount);
    return res.send(response);
});

app.post("/buy", verifyBuyerToken, async (req, res) => {
    const { userName, orderDetails } = req.body;
    const response = await BuyProductsApi.buy(userName, orderDetails);
    return res.send(response);
});

app.listen(port, () => {
    console.log(`listening on port ${port}!`);
});

module.exports = app;
