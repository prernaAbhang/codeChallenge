module.exports.validate = (userDetails) => {
    if (!userDetails.userName) return { error: "User name is mandatory!", data: null };

    if (!userDetails.amount) return { error: "Amount is mandatory!", data: null };

    if (![5, 10, 20, 50, 100].includes(Number(userDetails.amount))) return { error: "You can deposit only 5, 10, 20, 50 and 100 cent coins into the vending machine!", data: null };

    return { error: null, data: null };
};
