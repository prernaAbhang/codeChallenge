const UserService = require("../services/user-service");

module.exports.delete = async (userName) => {
    const response = await UserService.deleteUser(userName);
    return response;
};
