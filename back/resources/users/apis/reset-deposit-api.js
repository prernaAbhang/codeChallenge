const UserService = require("../services/user-service");

module.exports.reset = async (userName) => {
    const response = await UserService.updateUser(userName, { deposit: 0 });
    return response;
};
