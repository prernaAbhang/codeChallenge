const uuid = require("uuid");
const Product = require("../../../models/product");
const Random = require("random-number");

const UserService = require("../../users/services/user-service");

const createProduct = async (productData) => {
    try {
        const id = uuid.v4();
        const productId = generateProductId();

        if (!productData.cost || productData.cost == 0) {
            return { error: "Please enter valid product cost", data: null };
        }

        if (productData.cost % 5 !== 0) {
            return { error: "Product cost must be in multiple of 5", data: null };
        }
        await Product.create({
            id,
            amountAvailable: productData.amountAvailable,
            cost: productData.cost,
            productName: productData.productName,
            productId,
        });

        return { error: null, data: "Product added successfully!" };
    } catch (error) {
        return { error: "Failed to create the Product", data: null };
    }
};

const getProducts = () => {
    try {
        return Product.findAll({
            attributes: ["amountAvailable", "cost", "productName", "productId"],
        });
    } catch (error) {
        console.log(error);
        return "Failed to fetch the products";
    }
};

const getProduct = (productId) => {
    try {
        return Product.findOne({
            where: { productId },
            attributes: ["amountAvailable", "cost", "productName"],
        });
    } catch (error) {
        console.log(error);
        return "Failed to fetch the products";
    }
};

const updateProduct = async (productId, productData) => {
    if (!productData.cost || productData.cost == 0) {
        return { error: "Please enter valid product cost", data: null };
    }

    if (productData.cost % 5 !== 0) {
        return { error: "Product cost must be in multiple of 5", data: null };
    }

    try {
        await Product.update(productData, {
            where: { productId },
        });
        return { error: null, data: "Updated record successfully!" };
    } catch (error) {
        console.log(error);
        return { error: "Failed to update the product", data: null };
    }
};

const deleteProduct = async (productId) => {
    try {
        await Product.destroy({
            where: { productId },
        });
        return "Deleted record successfully!";
    } catch (error) {
        console.log(error);
        return "Failed to delete the product";
    }
};

const generateProductId = () => {
    return (
        "P-" +
        Random.generator({
            min: 1000,
            max: 9999,
            integer: true,
        })()
    );
};

const buyProducts = async (userName, orderDetails) => {
    let invalidProductId = false;

    const user = await UserService.getUser(userName);
    if (!user) return { error: "User does not exist!", data: null };

    const details = await Promise.all(
        orderDetails.map(async (order) => {
            const product = await getProduct(order.productId);
            if (!product) {
                invalidProductId = true;
            } else {
                return {
                    productId: order.productId,
                    quantity: order.quantity,
                    price: product.cost,
                    amountAvailable: product.amountAvailable,
                    productName: product.productName,
                };
            }
        })
    );
    if (invalidProductId) return { error: "Some of the products in your order do not exist!", data: null };

    const orderTotal = getOrderTotal(details);
    if (user.deposit < orderTotal) {
        return { error: "You do not have sufficient balance in your vending machine account", data: null };
    }

    const unAvailableProduct = checkProductsAvailability(details);
    if (unAvailableProduct) {
        return { error: "Few products in your order are not available!", data: null };
    }

    details.map(async (order) => {
        await updateProduct(order.productId, {
            amountAvailable: order.amountAvailable - order.quantity,
        });
    });

    const change = getChange(user.deposit, orderTotal);

    await UserService.updateUser(userName, { deposit: 0 });
    return {
        error: null,
        data: {
            total: orderTotal,
            products: details.map((product) => {
                return {
                    productName: product.productName,
                    quantity: product.quantity,
                };
            }),
            change,
        },
    };
};

const getChange = (deposit, orderTotal) => {
    let remainder = deposit - orderTotal;

    if (remainder === 0) {
        return [];
    } else {
        const coins = [
            { value: 100, count: 0 },
            { value: 50, count: 0 },
            { value: 20, count: 0 },
            { value: 10, count: 0 },
            { value: 5, count: 0 },
        ];
        const result = [];

        for (let i = 0; i < coins.length; i++) {
            const coinCount = Math.floor(remainder / coins[i].value);
            coins[i].count = coinCount;
            remainder -= coinCount * coins[i].value;
        }

        for (let i = 0; i < coins.length; i++) {
            if (coins[i].count > 0) {
                result.push({ coin: coins[i].value, quantity: coins[i].count });
            }
        }

        return result;
    }
};

const checkProductsAvailability = (orderDetails) => {
    return orderDetails.find((order) => {
        return order.amountAvailable < order.quantity;
    });
};

const getOrderTotal = (orderDetails) => orderDetails.reduce((a, b) => a + b.price * b.quantity, 0);

module.exports = { createProduct, getProducts, updateProduct, deleteProduct, buyProducts, getProduct };
