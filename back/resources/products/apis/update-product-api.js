const ProductService = require("../services/product-service");

module.exports.update = async (productId, productData) => {
    const response = await ProductService.updateProduct(productId, productData);
    return response;
};
