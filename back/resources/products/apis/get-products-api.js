const ProductService = require("../services/product-service");

module.exports.get = async () => {
    const response = await ProductService.getProducts();
    return response;
};
