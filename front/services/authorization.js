import Cookies from "js-cookie";

const setAuth = (details) => {
    Cookies.set("AUTH", JSON.stringify(details));
};

const getAuth = () => {
    const userAuthString = Cookies.get("AUTH");
    return JSON.parse(userAuthString);
};

const getHeaders = () => {
    const auth = getAuth();
    const token = auth.token;
    return {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    };
};

const removeAuth = () => {
    Cookies.remove("AUTH");
};

module.exports = { setAuth, getAuth, removeAuth, getHeaders };
