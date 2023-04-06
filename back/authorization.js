const jwt = require("jsonwebtoken");
const jwtSecret = "d393940ae85bddfd3b65d6ccb5cb5825bb48335fceb37bb2f17dd59e5985884a";

function verifyToken(req, res, next) {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).send("Unauthorized");
    }
    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.user = decoded;
        if (req.user.role === "buyer" || req.user.role === "seller") next();
        else return res.status(401).send("Unauthorized");
    } catch (err) {
        return res.status(401).send("Unauthorized");
    }
}

function verifyBuyerToken(req, res, next) {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).send("Unauthorized");
    }
    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.user = decoded;
        if (req.user.role === "buyer") next();
        else return res.status(401).send("Unauthorized");
    } catch (err) {
        return res.status(401).send("Unauthorized");
    }
}

function verifySellerToken(req, res, next) {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).send("Unauthorized");
    }
    try {
        const decoded = jwt.verify(token, jwtSecret);
        req.user = decoded;
        if (req.user.role === "seller") next();
        else return res.status(401).send("Unauthorized");
    } catch (err) {
        return res.status(401).send("Unauthorized");
    }
}

module.exports = { verifyToken, verifyBuyerToken, verifySellerToken };
