import { useRouter } from "next/router";

const TransactionSummary = ({ totalSpent, change, productsPurchased }) => {
    const router = useRouter();

    return (
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-lg-6 mt-5">
                    <h4>Transaction Summary</h4>
                    <table className="table table-bordered">
                        <thead>
                            <tr>
                                <th>Products Purchased</th>
                                <th>Change</th>
                                <th>Total spent</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>
                                    <table className="table table-striped">
                                        <thead>
                                            <tr>
                                                <th>Product Name</th>
                                                <th>Quantity</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {productsPurchased.map((product, index) => (
                                                <tr key={index}>
                                                    <td>{product.productName}</td>
                                                    <td>{product.quantity || 0}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </td>
                                <td>
                                    {change.length ? (
                                        <table className="table table-striped">
                                            <thead>
                                                <tr>
                                                    <th>Coin</th>
                                                    <th>Quantity</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {change.map(({ coin, quantity }) => (
                                                    <tr key={coin}>
                                                        <td>{coin} cent</td>
                                                        <td>{quantity}</td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    ) : (
                                        <span>0</span>
                                    )}
                                </td>
                                <td>{totalSpent} cent</td>
                            </tr>
                        </tbody>
                    </table>
                    <div class="d-flex justify-content-center mt-2">
                        <button class="btn btn-dark" onClick={() => router.reload("/dashboard")}>
                            OK
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

module.exports = { TransactionSummary };
