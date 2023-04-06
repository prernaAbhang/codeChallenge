const chai = require("chai");
const sinon = require("sinon");
const app = require("../../../../index");
const chaiHttp = require("chai-http");
const expect = chai.expect;
chai.use(chaiHttp);

const UserService = require("../../../../resources/users/services/user-service");
const User = require("../../../../models/user");
const Product = require("../../../../models/product");

describe("Buy products api", () => {
    let sandbox;
    let user, userResponse, buyerToken, product;
    beforeEach(async () => {
        sandbox = sinon.createSandbox();

        user = {
            userName: "userName",
            password: "password",
            role: "buyer",
            deposit: 500,
        };

        product = {
            productId: "P-1",
            cost: 10,
            amountAvailable: 10,
            productName: "ProductName",
        };

        buyerToken = UserService.generateAuthToken(user.userName, user.role);

        userResponse = { token: "token", userName: user.userName, role: user.role };
    });

    it("should return error if no auth token is provided", async () => {
        // sandbox.mock(ProductService).expects("deposit").withArgs().returns({ error: null, data: userResponse });

        chai.request(app)
            .post("/buy")
            .send({})
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(401);
            });
    });

    it("should return error if no userName is provided", async () => {
        chai.request(app)
            .post("/buy")
            .set("Authorization", `Bearer ${buyerToken}`)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                expect(res.body).to.be.eql({ error: "User name is mandatory!", data: null });
            });
    });

    it("should return error if order details are not provided", async () => {
        chai.request(app)
            .post("/buy")
            .set("Authorization", `Bearer ${buyerToken}`)
            .send({ userName: user.userName })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                expect(res.body).to.be.eql({ error: "Order details are mandatory!", data: null });
            });
    });

    it("should return error if invalid order details are not provided", async () => {
        chai.request(app)
            .post("/buy")
            .set("Authorization", `Bearer ${buyerToken}`)
            .send({ userName: user.userName, orderDetails: ["invalid order details"] })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                expect(res.body).to.be.eql({ error: "Order details are invalid!", data: null });
            });
    });

    it("should return error if user does not exist", async () => {
        sandbox.mock(User).expects("findOne").returns(null);

        await chai
            .request(app)
            .post("/buy")
            .set("Authorization", `Bearer ${buyerToken}`)
            .send({
                userName: user.userName,
                orderDetails: [{ productId: "P-1", quantity: 2 }],
            })
            .then((res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.eql({ error: "User does not exist!", data: null });
                done();
            })
            .catch((err) => {});
    });

    it("should return error if some of the products do not exist", async () => {
        sandbox.mock(User).expects("findOne").returns(user);

        sandbox.mock(Product).expects("findOne").returns(null);

        await chai
            .request(app)
            .post("/buy")
            .set("Authorization", `Bearer ${buyerToken}`)
            .send({
                userName: user.userName,
                orderDetails: [{ productId: "P-1", quantity: 2 }],
            })
            .then((res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.eql({ error: "Some of the products in your order do not exist!", data: null });
                done();
            })
            .catch((err) => {});
    });

    it("should return error if user does not have sufficient balance", async () => {
        user.deposit = 0;

        sandbox.mock(User).expects("findOne").returns(user);

        sandbox.mock(Product).expects("findOne").returns(product);

        await chai
            .request(app)
            .post("/buy")
            .set("Authorization", `Bearer ${buyerToken}`)
            .send({
                userName: user.userName,
                orderDetails: [{ productId: "P-1", quantity: 2 }],
            })
            .then((res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.eql({ error: "You do not have sufficient balance in your vending machine account", data: null });
                done();
            })
            .catch((err) => {});
    });

    it("should return error if some of the products are not available in the required quantity", async () => {
        sandbox.mock(User).expects("findOne").returns(user);

        sandbox.mock(Product).expects("findOne").returns(product);

        await chai
            .request(app)
            .post("/buy")
            .set("Authorization", `Bearer ${buyerToken}`)
            .send({
                userName: user.userName,
                orderDetails: [{ productId: "P-1", quantity: 20 }],
            })
            .then((res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.eql({ error: "Few products in your order are not available!", data: null });
                done();
            })
            .catch((err) => {});
    });

    it("should return change when buy request is fulfilled successfully", async () => {
        sandbox.mock(User).expects("findOne").returns(user);

        sandbox.mock(Product).expects("findOne").returns(product);

        sandbox.mock(User).expects("update").returns({});

        sandbox.mock(Product).expects("update").returns({});

        await chai
            .request(app)
            .post("/buy")
            .set("Authorization", `Bearer ${buyerToken}`)
            .send({
                userName: user.userName,
                orderDetails: [{ productId: "P-1", quantity: 9 }],
            })
            .then((res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.eql({
                    error: null,
                    data: {
                        total: 90,
                        products: [
                            {
                                productId: "P-1",
                                cost: 10,
                                amountAvailable: 10,
                                productName: "ProductName",
                            },
                        ],
                        change: [
                            { coin: 100, quantity: 4 },
                            { coin: 10, quantity: 1 },
                        ],
                    },
                });
                done();
            })
            .catch((err) => {});
    });

    afterEach(() => {
        sandbox.verifyAndRestore();
        sinon.verifyAndRestore();
    });
});
