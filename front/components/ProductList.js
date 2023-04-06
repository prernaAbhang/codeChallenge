import React from "react";
import { useState, useEffect } from "react";
import { Table, Button } from "react-bootstrap";
import axios from "axios";
import { getHeaders } from "../services/authorization";
import { useRouter } from "next/router";

const ProductList = () => {
    const router = useRouter();
    const [products, setProducts] = useState([]);

    const fetchProducts = async () => {
        const config = getHeaders();
        try {
            const response = await axios.get("http://localhost:9000/products", config);
            setProducts(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    const addProduct = () => {
        router.push("/addProduct");
    };

    const deleteProduct = async (productId) => {
        const config = getHeaders();

        try {
            await axios.delete(`http://localhost:9000/products/${productId}`, config);
            router.reload("/dashboard");
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <>
            <button className="btn btn-primary float-start mt-2" onClick={addProduct}>
                Add Product
            </button>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th>Sr.No</th>
                        <th>Product Name</th>
                        <th>Cost</th>
                        <th>Quantity Available</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product, index) => (
                        <tr key={index}>
                            <td>{index + 1}.</td>
                            <td>{product.productName}</td>
                            <td>{product.cost}</td>
                            <td>{product.amountAvailable}</td>
                            <td>
                                <Button variant="primary" size="sm" onClick={() => router.push(`/updateProduct/${product.productId}`)}>
                                    Edit
                                </Button>{" "}
                                <Button variant="danger" size="sm" onClick={() => deleteProduct(product.productId)}>
                                    Delete
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </>
    );
};

module.exports = { ProductList };
