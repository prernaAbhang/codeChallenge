const UserService = require("../services/user-service");

module.exports.login = async (userData) => {
    const response = await UserService.loginUser(userData);
    return response;
};
