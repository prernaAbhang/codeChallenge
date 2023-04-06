import React from "react";
import { useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { getHeaders } from "../services/authorization";
import { removeAuth } from "../services/authorization";

const UpdateUser = ({ userName }) => {
    const [errorMessage, setErrorMessage] = useState("");
    const [message, setMessage] = useState("");
    const router = useRouter();

    const onSubmit = async (event) => {
        event.preventDefault();
        const formData = {
            password: document.getElementById("password").value,
        };

        const config = getHeaders();
        try {
            const response = await axios.put(`http://localhost:9000/users/${userName}`, formData, config);
            const { data } = response.data;
            if (data) {
                setErrorMessage("");
                setMessage(data);
            } else {
                setMessage("");
                setErrorMessage(response.data.error);
            }
        } catch (error) {
            console.log(error);
            setErrorMessage("Something went wrong!");
        }
    };

    const handleLogout = () => {
        removeAuth();
        router.push("/login");
    };

    const deleteAccount = async () => {
        const config = getHeaders();
        try {
            const response = await axios.delete(`http://localhost:9000/users/${userName}`, config);
            const { data } = response;
            if (data) {
                setErrorMessage("");
                setMessage(data);
                handleLogout();
            } else {
                setMessage("");
                setErrorMessage("Failed to delete the User!");
            }
        } catch (error) {
            console.log(error);
            setErrorMessage("Something went wrong!");
        }
    };

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-lg-6">
                    <span className="btn btn-dark mt-5" onClick={() => router.push("/dashboard")}>
                        Back
                    </span>
                    <h1 className="text-center ">Update Password</h1>
                    <form className="mx-auto" onSubmit={onSubmit}>
                        <div className="form-group my-2">
                            <label htmlFor="password">Password</label>
                            <input type="password" className="form-control" id="password" placeholder="Password" required />
                        </div>
                        {errorMessage && <p class="text-danger">{errorMessage}</p>}
                        {message && <p class="text-success">{message}</p>}

                        <button type="submit" className="btn btn-primary my-2">
                            Update Password
                        </button>
                        <button className="btn btn-danger my-2 float-end" onClick={deleteAccount}>
                            Delete my account
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

module.exports = { UpdateUser };
