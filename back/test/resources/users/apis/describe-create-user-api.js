const chai = require("chai");
const sinon = require("sinon");
const app = require("../../../../index");
const chaiHttp = require("chai-http");
const expect = chai.expect;
chai.use(chaiHttp);

const User = require("../../../../models/user");
const UserService = require("../../../../resources/users/services/user-service");
const CreateUserApiValidation = require("../../../../resources/users/validators/create-user-api-validation");

describe("Create user api", () => {
    let sandbox;
    let user, userResponse;
    beforeEach(() => {
        sandbox = sinon.createSandbox();

        user = {
            userName: "userName",
            password: "password",
            role: "seller",
        };

        userResponse = { token: "token", userName: user.userName, role: user.role };
    });

    it("should return error if userName is not present", async () => {
        chai.request(app)
            .post("/users")
            .send({ password: "password", role: "seller" })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                expect(res.body).to.be.eql({ error: "User name is mandatory!", data: null });
            });
    });

    it("should return error if password is not present", async () => {
        chai.request(app)
            .post("/users")
            .send({ userName: "userName", role: "seller" })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                expect(res.body).to.be.eql({ error: "User password is mandatory!", data: null });
            });
    });

    it("should return error if user role is not present", async () => {
        chai.request(app)
            .post("/users")
            .send({ userName: "userName" })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                expect(res.body).to.be.eql({ error: "User role is mandatory!", data: null });
            });
    });

    it("should return error if user role is invalid", async () => {
        chai.request(app)
            .post("/users")
            .send({ userName: "userName", role: "invalid user role" })
            .end((err, res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                expect(res.body).to.be.eql({ error: "User role is invalid!", data: null });
            });
    });

    it("should return error if the user already exists", async () => {
        sandbox.mock(User).expects("findOne").withArgs().returns(user);

        await chai
            .request(app)
            .post("/users")
            .send(user)
            .then((res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                expect(res.body).to.be.eql({ error: "User with the given userName already exists!", data: null });
                done();
            })
            .catch((err) => {});
    });

    it("should return token, userName and role when user is created", async () => {
        sandbox.mock(User).expects("findOne").withArgs().returns(null);

        sandbox.mock(User).expects("create").withArgs().returns(null);

        await chai
            .request(app)
            .post("/users")
            .send(user)
            .then((res) => {
                expect(err).to.be.null;
                expect(res).to.have.status(200);
                expect(res.body).to.be.eql({ error: null, data: userResponse });
                done();
            })
            .catch((err) => {});
    });

    afterEach(() => {
        sandbox.verifyAndRestore();
        sinon.verifyAndRestore();
    });
});
