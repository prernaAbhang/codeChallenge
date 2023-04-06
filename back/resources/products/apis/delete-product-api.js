const ProductService = require("../services/product-service");

module.exports.delete = async (productId) => {
    const response = await ProductService.deleteProduct(productId);
    return response;
};
