import React from "react";
import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import axios from "axios";
import { getHeaders } from "../services/authorization";

const AddProduct = () => {
    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState("");

    const onSubmit = async (event) => {
        event.preventDefault();

        const formData = {
            productName: document.getElementById("productName").value,
            cost: document.getElementById("productCost").value,
            amountAvailable: document.getElementById("productQuantity").value,
        };

        const config = getHeaders();

        try {
            const response = await axios.post("http://localhost:9000/products", formData, config);

            const { data } = response.data;
            if (data) {
                router.push("/dashboard");
            } else {
                setErrorMessage(response.data.error);
            }
        } catch (error) {
            console.log(error);
            setErrorMessage("Something went wrong!");
        }
    };

    return (
        <div className="container mt-5">
            <Head>
                <title>Add Product</title>
            </Head>

            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-lg-6">
                        <span className="btn btn-dark mt-5" onClick={() => router.push("/dashboard")}>
                            Back
                        </span>
                        <h1 className="text-center mt-2">Add Product</h1>
                        <form onSubmit={onSubmit}>
                            <div className="form-group">
                                <label>Product Name:</label>
                                <input type="text" className="form-control" id="productName" required />
                            </div>
                            <div className="form-group">
                                <label>Cost:</label>
                                <input type="number" className="form-control" id="productCost" required />
                            </div>
                            <div className="form-group">
                                <label>Quantity:</label>
                                <input type="number" className="form-control" id="productQuantity" required />
                            </div>
                            <button type="submit" className="btn btn-primary mt-2">
                                Add Product
                            </button>
                            {errorMessage && <p class="text-danger">{errorMessage}</p>}
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

module.exports = { AddProduct };
