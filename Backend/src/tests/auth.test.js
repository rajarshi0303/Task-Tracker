import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import app from "../app.js";
import User from "../models/user.model.js";

let mongo;

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();
  await mongoose.connect(uri);
});

beforeAll(() => {
  process.env.ACCESS_TOKEN_SECRET = "Raju123XYZabcd";
  process.env.REFRESH_TOKEN_SECRET = "PatelWYXBqrst345";
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongo.stop();
});

afterEach(async () => {
  await User.deleteMany();
});

describe("Auth Routes", () => {
  const userData = {
    name: "Rajarshi",
    email: "test@example.com",
    password: "password123",
  };

  it("should register a user", async () => {
    const res = await request(app).post("/api/auth/signup").send(userData);

    expect(res.statusCode).toBe(201);
    expect(res.body.user.email).toBe(userData.email);
    expect(res.headers["set-cookie"]).toBeDefined();
  });

  it("should login a registered user", async () => {
    await request(app).post("/api/auth/signup").send(userData);

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: userData.email, password: userData.password });

    expect(res.statusCode).toBe(200);
    expect(res.body.user.email).toBe(userData.email);
    expect(res.headers["set-cookie"]).toBeDefined();
  });

  it("should not register a user with existing email", async () => {
    await request(app).post("/api/auth/signup").send(userData);
    const res = await request(app).post("/api/auth/signup").send(userData);

    expect(res.statusCode).toBe(400);
    expect(res.body.message).toBe("Email already exists");
  });

  it("should fail if required fields are missing", async () => {
    const res = await request(app).post("/api/auth/signup").send({
      name: "",
      email: "invalid-email",
      password: "",
    });

    expect(res.statusCode).toBe(400);
  });

  it("should not login with unregistered email", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "fake@example.com", password: "password123" });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("Invalid credentials");
  });

  it("should not login with incorrect password", async () => {
    await request(app).post("/api/auth/signup").send(userData);

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: userData.email, password: "wrongpassword" });

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("Invalid credentials");
  });
});

describe("Token Handling", () => {
  const userData = {
    name: "Rajarshi",
    email: "test@example.com",
    password: "password123",
  };

  it("should refresh tokens", async () => {
    const signupRes = await request(app)
      .post("/api/auth/signup")
      .send(userData);
    const cookies = signupRes.headers["set-cookie"];

    const res = await request(app)
      .get("/api/auth/refresh")
      .set("Cookie", cookies);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Tokens refreshed");
    expect(res.headers["set-cookie"]).toBeDefined();
  });

  it("should not refresh token if none is provided", async () => {
    const res = await request(app).get("/api/auth/refresh");

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("Refresh token missing");
  });

  it("should not refresh token if invalid", async () => {
    const res = await request(app)
      .get("/api/auth/refresh")
      .set("Cookie", "refreshToken=invalidtoken");

    expect(res.statusCode).toBe(403);
    expect(res.body.message).toBe("Refresh token expired or invalid");
  });
});

describe("GetMe", () => {
  const userData = {
    name: "Rajarshi",
    email: "test@example.com",
    password: "password123",
  };

  it("should return current user info if authenticated", async () => {
    const signupRes = await request(app)
      .post("/api/auth/signup")
      .send(userData);
    const cookies = signupRes.headers["set-cookie"];

    const res = await request(app).get("/api/auth/me").set("Cookie", cookies);

    expect(res.statusCode).toBe(200);
    expect(res.body.user.email).toBe(userData.email);
  });

  it("should return 401 if no access token", async () => {
    const res = await request(app).get("/api/auth/me");

    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("Access token missing");
  });
});

describe("Logout", () => {
  const userData = {
    name: "Rajarshi",
    email: "test@example.com",
    password: "password123",
  };

  it("should logout the user", async () => {
    const signupRes = await request(app)
      .post("/api/auth/signup")
      .send(userData);
    const cookies = signupRes.headers["set-cookie"];

    const res = await request(app)
      .post("/api/auth/logout")
      .set("Cookie", cookies);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Logged out");
    expect(res.headers["set-cookie"]).toBeDefined();
  });
});
