const uuid = require("uuid");
const User = require("../../../models/user");
const jwt = require("jsonwebtoken");
const PasswordHash = require("password-hash");
const jwtSecret = "d393940ae85bddfd3b65d6ccb5cb5825bb48335fceb37bb2f17dd59e5985884a";

const createUser = async (userData) => {
    try {
        const existingUser = await getUser(userData.userName);

        if (existingUser) {
            return { error: "User with the given userName already exists!", data: null };
        } else {
            const id = uuid.v4();
            const hashedPassword = PasswordHash.generate(userData.password.toString());

            await User.create({
                id,
                userName: userData.userName,
                password: hashedPassword,
                deposit: 0,
                role: userData.role,
            });
            const token = generateAuthToken(userData.userName, userData.role);
            return { error: null, data: { token, userName: userData.userName, role: userData.role } };
        }
    } catch (error) {
        return { error: "Failed to create the User", data: null };
    }
};

const loginUser = async (userData) => {
    try {
        const user = await getUser(userData.userName);
        if (user) {
            const passwordVerified = PasswordHash.verify(userData.password.toString(), user.password);
            if (passwordVerified) {
                const token = generateAuthToken(userData.userName, user.role);
                return { error: null, data: { token, userName: user.userName, role: user.role } };
            } else return { error: "Incorrect Password!", data: null };
        } else {
            return { error: "Invalid Username!", data: null };
        }
    } catch (error) {
        return { error: "Failed to login the User", data: null };
    }
};

const generateAuthToken = (userName, role) => {
    const options = { expiresIn: "1h" };
    const token = jwt.sign({ userName, role, options }, jwtSecret);
    return token;
};

const getUser = async (userName) => {
    try {
        return User.findOne({
            where: { userName },
            attributes: ["userName", "deposit", "role", "password"],
        });
    } catch (error) {
        return "Failed to fetch the user";
    }
};

const updateUser = async (userName, userData) => {
    let details = userData;
    if (details.password) {
        const hashedPassword = PasswordHash.generate(userData.password.toString());
        details.password = hashedPassword;
    }
    try {
        await User.update(details, {
            where: { userName },
        });
        return { error: null, data: "Updated record successfully!" };
    } catch (error) {
        console.log(error);
        return { error: "Failed to update the user", data: null };
    }
};

const deleteUser = async (userName) => {
    try {
        await User.destroy({
            where: { userName },
        });
        return "Deleted record successfully!";
    } catch (error) {
        console.log(error);
        return "Failed to delete the user";
    }
};

const deposit = async (userName, amount) => {
    try {
        const user = await getUser(userName);

        if (user) {
            const totalAmount = user.deposit + Number(amount);
            await User.update(
                {
                    deposit: totalAmount,
                },
                {
                    where: { userName },
                }
            );
            return { error: null, data: `Deposited coins successfully! total amount : ${totalAmount}` };
        } else {
            return { error: "User does not exist!", data: null };
        }
    } catch (error) {
        console.log(error);
        return { error: "Failed to deposit the coins", data: null };
    }
};

module.exports = { createUser, loginUser, getUser, updateUser, deleteUser, deposit, generateAuthToken };
