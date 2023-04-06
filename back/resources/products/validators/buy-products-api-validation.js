module.exports.validate = (userDetails) => {
    if (!userDetails.userName) return { error: "User name is mandatory!", data: null };

    if (!userDetails.orderDetails) return { error: "Order details are mandatory!", data: null };

    if (!Array.isArray(userDetails.orderDetails)) return { error: "Order details are invalid!", data: null };

    const data = userDetails.orderDetails.find((order) => {
        return !order.productId || !order.quantity;
    });

    if (data || !userDetails.orderDetails.length) return { error: "Order details are invalid!", data: null };

    return { error: null, data: null };
};
