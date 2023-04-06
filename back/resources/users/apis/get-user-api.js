const UserService = require("../services/user-service");

module.exports.get = async (userData) => {
    const response = await UserService.getUser(userData);
    return response;
};
