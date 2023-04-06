import React from "react";
import { useState } from "react";
import { useRouter } from "next/router";
import { setAuth } from "../services/authorization";
import Link from "next/link";

const Login = () => {
    const [errorMessage, setErrorMessage] = useState("");
    const router = useRouter();

    const onSubmit = async (event) => {
        event.preventDefault();

        const formData = {
            userName: document.getElementById("userName").value,
            password: document.getElementById("password").value,
        };

        try {
            const response = await fetch("http://localhost:9000/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData),
            });

            const res = await response.json();

            if (res.data) {
                const userData = { token: res.data.token, userName: res.data.userName, role: res.data.role };
                setAuth(userData);
                router.push("/dashboard");
            } else {
                setErrorMessage(res.error);
                console.log("Server response here:", res);
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
                    <form className="mx-auto" onSubmit={onSubmit}>
                        <div className="form-group my-2">
                            <label htmlFor="userName">Username</label>
                            <input type="text" className="form-control" id="userName" placeholder="Enter username" required />
                        </div>

                        <div className="form-group my-2">
                            <label htmlFor="password">Password</label>
                            <input type="password" className="form-control" id="password" placeholder="Password" required />
                        </div>

                        {errorMessage && <p class="text-danger">{errorMessage}</p>}

                        <button type="submit" className="btn btn-primary my-2">
                            Submit
                        </button>
                        <div className="text-small">
                            don't have an account? click{" "}
                            <Link href="/">
                                <span>here</span>
                            </Link>{" "}
                            to Sign up
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

module.exports = { Login };
