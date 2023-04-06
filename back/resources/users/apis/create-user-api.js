const UserService = require("../services/user-service");
const CreateUserApiValidation = require("../validators/create-user-api-validation");

module.exports.create = async (userData) => {
    const validationResponse = CreateUserApiValidation.validate(userData);

    if (!validationResponse.error) {
        const response = await UserService.createUser(userData);
        return response;
    } else {
        return validationResponse;
    }
};
