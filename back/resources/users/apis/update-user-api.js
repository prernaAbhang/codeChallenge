const UserService = require("../services/user-service");

module.exports.update = async (userName, userData) => {
    const response = await UserService.updateUser(userName, userData);
    return response;
};
