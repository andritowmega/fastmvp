// tests/utils/auth.test.js
const authModule = require("../../fastmvpcore/utils/auth");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const mockConfigDb = require("../../config/configDb.json");

jest.mock("jsonwebtoken");
jest.mock("bcryptjs");

// Mock the db config to provide a mock secret key
jest.mock("../../config/configDb.json", () => ({
  testProject: {
    token_secret: "testSecret",
  },
}));

describe("authModule", () => {
  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test to prevent cross-test contamination
  });

  test("should generate a new token for the user", async () => {
    const data = { userId: 123 };
    const expiration = 1; // 1 day expiration
    const project = "testProject";

    jwt.sign.mockReturnValue("mockToken"); // Mock return value of jwt.sign

    const token = await authModule.newTokenUser(data, expiration, project);
    expect(jwt.sign).toHaveBeenCalledWith(
      data,
      mockConfigDb.testProject.token_secret,
      { expiresIn: expiration + "d" }
    );
    expect(token).toBe("mockToken");
  });

  test("should decode a token successfully", async () => {
    const key = "mockKey";
    const decodedToken = { userId: 123 };

    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(null, decodedToken); // Simulating successful verification
    });

    const decoded = await authModule.keyDecoded(key);
    expect(jwt.verify).toHaveBeenCalledWith(
      key,
      expect.any(String),
      expect.any(Function)
    );
    expect(decoded).toEqual(decodedToken);
  });

  test("should fail to decode token if verification fails", async () => {
    const key = "mockKey";

    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(new Error("Invalid Token"), null); // Simulating error
    });

    const decoded = await authModule.keyDecoded(key);
    expect(decoded).toBeNull();
  });

  test("should compare password correctly", async () => {
    const password = "password123";
    const hashedPassword =
      "$2a$12$O9D/zzFGYgNmm7UG3MIhHu2rK3uOswJ9nIHBXXggLk52XUgNnlYhm";

    bcrypt.compare.mockResolvedValue(true); // Simulating password match

    const isValid = await authModule.comparePassword(password, hashedPassword);
    expect(isValid).toBe(true);
  });

  test("should authenticate user with valid token", async () => {
    const req = {
      body: {},
      headers: { authorization: "Bearer mockToken" },
      params: { project: "testProject" },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(null, { userId: 123 }); // Simulating valid token
    });

    await authModule.authenticateUser(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(req.datatoken).toEqual({ userId: 123 });
  });

  test("should fail authentication if token is invalid", async () => {
    const req = {
      body: {},
      headers: { authorization: "Bearer invalidToken" },
      params: { project: "testProject" },
    };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    const next = jest.fn();

    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(new Error("Invalid Token"), null); // Simulating invalid token
    });

    await authModule.authenticateUser(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      status: "error",
      msg: "Invalid token",
      data: null,
    });
  });

  test("should replace request body with user data from token", () => {
    const req = {
      body: { someField: "value" },
      datatoken: { userId: 123 },
    };
    const res = {};
    const next = jest.fn();

    authModule.replaceWithUserData(req, res, next);

    expect(req.body).toHaveProperty("AUTH::userId", 123);
    expect(next).toHaveBeenCalled();
  });

  test("should check token validity", async () => {
    const token = "mockToken";
    const project = "testProject";

    jwt.verify.mockImplementation((token, secret, callback) => {
      callback(null, { userId: 123 }); // Simulating valid token
    });

    const decoded = await authModule.checktoken(token, project);

    expect(decoded).toEqual({ userId: 123 });
  });
});
