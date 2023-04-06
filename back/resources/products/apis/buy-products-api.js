const ProductService = require("../services/product-service");
const BuyProductsApiValidation = require("../validators/buy-products-api-validation");

module.exports.buy = async (userName, orderDetails) => {
    const validationResponse = BuyProductsApiValidation.validate({ userName, orderDetails });

    if (!validationResponse.error) {
        const response = await ProductService.buyProducts(userName, orderDetails);

        return response;
    } else {
        return validationResponse;
    }
};
