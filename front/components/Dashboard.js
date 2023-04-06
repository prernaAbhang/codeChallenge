import React from "react";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { VendingMachine } from "./VendingMachine";
import { removeAuth, getAuth } from "../services/authorization";
import { ProductList } from "../components/ProductList";

const Dashboard = () => {
    const router = useRouter();
    const [user, setUser] = useState({});

    const handleLogout = () => {
        removeAuth();
        router.push("/login");
    };

    useEffect(() => {
        const auth = getAuth();
        setUser(auth);
    }, []);

    return (
        <div className="container">
            <button className="btn btn-danger float-end mt-2" onClick={handleLogout}>
                Logout
            </button>
            <button className="btn btn-dark float-end mt-2" onClick={() => router.push(`/updateUser/${user.userName}`)}>
                Edit User
            </button>

            {user.role === "buyer" && <VendingMachine user={user} />}
            {user.role === "seller" && <ProductList />}
        </div>
    );
};

module.exports = { Dashboard };
