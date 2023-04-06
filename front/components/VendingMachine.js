import { useState, useEffect } from "react";
import axios from "axios";
import { getHeaders } from "../services/authorization";
import { TransactionSummary } from "./TransactionSummary";

const VendingMachine = ({ user }) => {
    const [depositAmount, setDepositAmount] = useState(0);
    const [productList, setProductList] = useState([]);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [totalSpent, setTotalSpent] = useState(0);
    const [change, setChange] = useState({});
    const [errorMessage, setErrorMessage] = useState("");
    const [message, setMessage] = useState("");
    const [productsPurchased, setProductsPurchased] = useState([]);

    const handleDeposit = async () => {
        setErrorMessage("");
        setTotalSpent("");
        setChange("");
        setProductsPurchased("");

        const config = getHeaders();
        try {
            const response = await axios.post(
                "http://localhost:9000/deposit",
                {
                    userName: user.userName,
                    amount: depositAmount,
                },
                config
            );
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

    const handleBuy = async () => {
        const config = getHeaders();

        if (selectedProducts.length) {
            try {
                const response = await axios.post(
                    "http://localhost:9000/buy",
                    {
                        userName: user.userName,
                        orderDetails: selectedProducts,
                    },
                    config
                );

                const { data } = response.data;
                if (data) {
                    setErrorMessage("");
                    setMessage("");
                    setTotalSpent(data.total);
                    setChange(data.change);
                    setProductsPurchased(data.products);
                    setSelectedProducts([]);
                } else {
                    setMessage("");
                    setErrorMessage(response.data.error);
                }
            } catch (error) {
                console.log(error);
                setErrorMessage("Something went wrong!");
            }
        } else {
            setErrorMessage("Please select products to buy");
        }
    };

    const handleReset = async () => {
        const config = getHeaders();

        try {
            await axios.post(
                "http://localhost:9000/reset",
                {
                    userName: user.userName,
                },
                config
            );
            setMessage("Reset data Successfully!");
            setErrorMessage("");
        } catch (error) {
            console.log(error);
            setErrorMessage("Something went wrong!");
        }
    };

    const handleProductSelect = (productId, quantity) => {
        if (quantity > 0) {
            const index = selectedProducts.findIndex((product) => product.productId === productId);
            if (index !== -1) {
                const updatedSelectedProducts = [...selectedProducts];
                updatedSelectedProducts[index].quantity = quantity;
                setSelectedProducts(updatedSelectedProducts);
            } else {
                setSelectedProducts([...selectedProducts, { productId, quantity }]);
            }
        }
    };

    const fetchProducts = async () => {
        const config = getHeaders();
        try {
            const response = await axios.get("http://localhost:9000/products", config);
            setProductList(response.data);
        } catch (error) {
            console.log(error);
            setErrorMessage("Something went wrong!");
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    return (
        <div>
            {user.role === "buyer" && (
                <>
                    {totalSpent <= 0 && (
                        <div className="container">
                            <div className="row justify-content-center">
                                <div className="col-lg-6">
                                    <div className="mb-4">
                                        <h4>Deposit coins</h4>
                                        <div className="d-flex">
                                            <label className="me-2">Amount:</label>
                                            <input
                                                type="number"
                                                id="depositAmount"
                                                value={depositAmount}
                                                onChange={(e) => setDepositAmount(e.target.value)}
                                                className="form-control me-2"
                                            />
                                            <button onClick={handleDeposit} className="btn btn-primary me-2">
                                                Deposit
                                            </button>
                                            <button onClick={handleReset} className="btn btn-secondary">
                                                Reset
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <h4>Buy products</h4>
                                        <table className="table table-striped table-bordered">
                                            <thead>
                                                <tr>
                                                    <th className="col-lg-1">Sr. No.</th>
                                                    <th className="col-lg-2">Name</th>
                                                    <th className="col-lg-2">Price(cent)</th>
                                                    <th className="col-lg-2">Quantity</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {productList.map((product, index) => (
                                                    <tr key={product.productId}>
                                                        <td scope="row">{index + 1}</td>
                                                        <td className="text-capitalize">{product.productName}</td>
                                                        <td className="text-success">{product.cost}</td>
                                                        <td>
                                                            <div className="form-group mb-0">
                                                                <input
                                                                    type="number"
                                                                    id={`quantity-${product.productId}`}
                                                                    className="form-control"
                                                                    onChange={(e) => handleProductSelect(product.productId, parseInt(e.target.value))}
                                                                />
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>

                                        <div class="d-flex justify-content-center mt-2">
                                            <button onClick={handleBuy} className="btn btn-primary m-2">
                                                Buy Products
                                            </button>
                                        </div>

                                        {errorMessage && <p className="text-danger">{errorMessage}</p>}
                                        {message && <p className="text-success">{message}</p>}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {totalSpent > 0 && <TransactionSummary totalSpent={totalSpent} change={change} productsPurchased={productsPurchased} />}
                </>
            )}
        </div>
    );
};

module.exports = { VendingMachine };
