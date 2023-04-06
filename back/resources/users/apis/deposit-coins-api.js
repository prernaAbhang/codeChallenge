const UserService = require("../services/user-service");
const DepositCoinsApiValidation = require("../validators/deposit-coins-api-validation.js");

module.exports.deposit = async (userName, amount) => {
    const validationResponse = DepositCoinsApiValidation.validate({ userName, amount });

    if (!validationResponse.error) {
        const response = await UserService.deposit(userName, amount);

        return response;
    } else {
        return validationResponse;
    }
};
