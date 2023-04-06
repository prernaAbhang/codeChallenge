const chai = require("chai");
const sinon = require("sinon");
const app = require("../../../../index");
const chaiHttp = require("chai-http");
const expect = chai.expect;
chai.use(chaiHttp);

const UserService = require("../../../../resources/users/services/user-service");
const User = require("../../../../models/user");

describe("Deposit coins api", () => {
    let sandbox;
    let user, userResponse, buyerToken;
    beforeEach(async () => {
        sandbox = sinon.createSandbox();

        user = {
            userName: "userName",
            password: "password",
            role: "buyer",
        };

        buyerToken = UserService.generateAuthToken(user.userName, user.role);

        userResponse = { token: "token", userName: user.userName, role: user.role };
    });

    it("should return error if no auth token is provided", async () => {
        chai.request(app)
            .post("/deposit")
            .send({})
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(401);
            });
    });

    it("should return error if no userName is provided", async () => {
        chai.request(app)
            .post("/deposit")
            .set("Authorization", `Bearer ${buyerToken}`)
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                expect(res.body).to.be.eql({ error: "User name is mandatory!", data: null });
            });
    });

    it("should return error if amount is not in  multiples of 5, 10, 20, 50 and 100", async () => {
        chai.request(app)
            .post("/deposit")
            .set("Authorization", `Bearer ${buyerToken}`)
            .send({ userName: user.userName, amount: 1000 })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                expect(res.body).to.be.eql({ error: "You can deposit only 5, 10, 20, 50 and 100 cent coins into the vending machine!", data: null });
            });
    });

    it("should return error if user with the given userName does not exist", async () => {
        sandbox.mock(User).expects("findOne").returns(null);

        await chai
            .request(app)
            .post("/deposit")
            .set("Authorization", `Bearer ${buyerToken}`)
            .send({ userName: user.userName, amount: 100 })
            .then((res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.eql({ error: "User does not exist", data: null });
                done();
            })
            .catch((err) => {});
    });

    it("should deposit coins if valid request is provided", async () => {
        sandbox.mock(User).expects("findOne").returns({ userName: user.userName, deposit: 100, role: user.role, password: user.password });

        sandbox.mock(User).expects("update").returns({});

        await chai
            .request(app)
            .post("/deposit")
            .set("Authorization", `Bearer ${buyerToken}`)
            .send({ userName: user.userName, amount: 100 })
            .then((res) => {
                expect(res).to.have.status(200);
                expect(res.body).to.be.eql({ error: null, data: `Deposited coins successfully! total amount : 200` });
                done();
            })
            .catch((err) => {});
    });

    afterEach(() => {
        sandbox.verifyAndRestore();
        sinon.verifyAndRestore();
    });
});
