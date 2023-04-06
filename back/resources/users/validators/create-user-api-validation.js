module.exports.validate = (userDetails) => {
    if (!userDetails.userName) return { error: "User name is mandatory!", data: null };
    if (!userDetails.role) return { error: "User role is mandatory!", data: null };
    if (!["seller", "buyer"].includes(userDetails.role)) return { error: "User role is invalid!", data: null };
    if (!userDetails.password) return { error: "User password is mandatory!", data: null };
    return { error: null, data: null };
};
