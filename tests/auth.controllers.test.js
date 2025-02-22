
import { signup, login } from "../controllers/auth.controller.js";
import { User } from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";

// Mock dependencies
jest.mock("../models/user.model.js");
jest.mock("bcryptjs");
jest.mock("../utils/generateTokenAndSetCookie.js");

describe("Auth Controller (Signup & Login)", () => {
  let req, res;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    jest.clearAllMocks();
  });

  //Signup Tests
  describe("Signup", () => {
    it("should return an error if required fields are missing", async () => {
      req.body = { email: "", password: "", name: "" };

      await signup(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "All fields are required",
      });
    });

    it("should return an error if user already exists", async () => {
      req.body = { email: "test@test.com", password: "Password123", name: "Test User" };
      User.findOne.mockResolvedValue({ email: "test@test.com" });

      await signup(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ email: req.body.email });
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "User already exists",
      });
    });

    it("should return an error if password is invalid", async () => {
      req.body = { email: "new@test.com", password: "12345", name: "New User" };

      await signup(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Password must be at least 8 characters long and contain both letters and numbers",
      });
    });

    it("should create a new user successfully", async () => {
      req.body = { email: "new@test.com", password: "Password1", name: "New User" };

      User.findOne.mockResolvedValue(null);
      bcryptjs.hash.mockResolvedValue("hashedPassword");

      const fakeUser = {
        _id: "12345",
        _doc: { email: req.body.email, name: req.body.name },
        save: jest.fn().mockResolvedValue(true),
      };

      User.mockImplementation(() => fakeUser);

      await signup(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ email: req.body.email });
      expect(bcryptjs.hash).toHaveBeenCalledWith(req.body.password, 12);
      expect(fakeUser.save).toHaveBeenCalled();
      expect(generateTokenAndSetCookie).toHaveBeenCalledWith(res, fakeUser._id);
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "User created successfully",
        user: { ...fakeUser._doc, password: undefined },
      });
    });
  });

  //Login Tests
  describe("Login", () => {
    it("should return an error if email or password is missing", async () => {
      req.body = { email: "", password: "" };

      await login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Invalid credentials",
      });
    });

    it("should return an error if user does not exist", async () => {
      req.body = { email: "nonexistent@test.com", password: "Password123" };

      User.findOne.mockResolvedValue(null);

      await login(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ email: req.body.email });
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Invalid credentials",
      });
    });

    it("should return an error if password is incorrect", async () => {
      req.body = { email: "test@test.com", password: "WrongPassword" };

      const fakeUser = {
        _id: "12345",
        password: "hashedPassword",
        _doc: { email: req.body.email, name: "Test User" },
      };

      User.findOne.mockResolvedValue(fakeUser);
      bcryptjs.compare.mockResolvedValue(false);

      await login(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ email: req.body.email });
      expect(bcryptjs.compare).toHaveBeenCalledWith(req.body.password, fakeUser.password);
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "Invalid credentials",
      });
    });

    it("should log in successfully if credentials are correct", async () => {
      req.body = { email: "test@test.com", password: "Password1" };

      const fakeUser = {
        _id: "12345",
        password: "hashedPassword",
        lastLogin: null,
        _doc: { email: req.body.email, name: "Test User" },
        save: jest.fn().mockResolvedValue(true),
      };

      User.findOne.mockResolvedValue(fakeUser);
      bcryptjs.compare.mockResolvedValue(true);

      await login(req, res);

      expect(User.findOne).toHaveBeenCalledWith({ email: req.body.email });
      expect(bcryptjs.compare).toHaveBeenCalledWith(req.body.password, fakeUser.password);
      expect(generateTokenAndSetCookie).toHaveBeenCalledWith(res, fakeUser._id);
      expect(fakeUser.save).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        success: true,
        message: "Logged in successfully",
        user: { ...fakeUser._doc, password: undefined },
      });
    });

  });
});
