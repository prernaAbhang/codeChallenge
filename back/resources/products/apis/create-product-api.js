const ProductService = require("../services/product-service");

module.exports.create = async (productData) => {
    const response = await ProductService.createProduct(productData);
    return response;
};
