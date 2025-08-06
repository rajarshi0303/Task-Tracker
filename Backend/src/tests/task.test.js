import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import request from "supertest";
import app from "../app.js";
import User from "../models/user.model.js";
import Task from "../models/task.model.js";

let mongo;
let tokenCookies;
let userId;

const userData = {
  name: "Rajarshi",
  email: "test@example.com",
  password: "password123",
};

beforeAll(async () => {
  mongo = await MongoMemoryServer.create();
  const uri = mongo.getUri();

  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  process.env.ACCESS_TOKEN_SECRET = "TestAccessSecret123";
  process.env.REFRESH_TOKEN_SECRET = "TestRefreshSecret123";

  const res = await request(app).post("/api/auth/signup").send(userData);
  tokenCookies = res.headers["set-cookie"];
  userId = res.body.user.id;
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongo.stop();
});

afterEach(async () => {
  await Task.deleteMany();
});

describe("Task Routes", () => {
  const taskData = {
    title: "Test Task",
    dueDate: "2025-08-10",
    completed: false,
  };

  it("should create a task", async () => {
    const res = await request(app)
      .post("/api/tasks")
      .set("Cookie", tokenCookies)
      .send(taskData);

    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe(taskData.title);
    expect(res.body.user).toBe(userId);
  });

  it("should not create a task without title", async () => {
    const res = await request(app)
      .post("/api/tasks")
      .set("Cookie", tokenCookies)
      .send({});

    expect(res.statusCode).toBe(400);
  });

  it("should get all tasks for logged-in user", async () => {
    await request(app)
      .post("/api/tasks")
      .set("Cookie", tokenCookies)
      .send(taskData);

    const res = await request(app)
      .get("/api/tasks")
      .set("Cookie", tokenCookies);

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].title).toBe(taskData.title);
  });

  it("should filter completed tasks", async () => {
    await Task.create({
      ...taskData,
      completed: true,
      user: userId,
    });

    const res = await request(app)
      .get("/api/tasks?filter=completed")
      .set("Cookie", tokenCookies);

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].completed).toBe(true);
  });

  it("should filter pending tasks", async () => {
    await Task.create({
      ...taskData,
      completed: false,
      user: userId,
    });

    const res = await request(app)
      .get("/api/tasks?filter=pending")
      .set("Cookie", tokenCookies);

    expect(res.statusCode).toBe(200);
    expect(res.body[0].completed).toBe(false);
  });

  it("should search task by title", async () => {
    await Task.create({
      ...taskData,
      title: "Important Meeting",
      user: userId,
    });

    const res = await request(app)
      .get("/api/tasks?search=meeting")
      .set("Cookie", tokenCookies);

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
    expect(res.body[0].title).toMatch(/meeting/i);
  });

  it("should get task by id", async () => {
    const task = await Task.create({ ...taskData, user: userId });

    const res = await request(app)
      .get(`/api/tasks/${task._id}`)
      .set("Cookie", tokenCookies);

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe(task.title);
  });

  it("should return 404 for task not found", async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const res = await request(app)
      .get(`/api/tasks/${fakeId}`)
      .set("Cookie", tokenCookies);

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Task not found");
  });

  it("should update a task", async () => {
    const task = await Task.create({ ...taskData, user: userId });

    const res = await request(app)
      .put(`/api/tasks/${task._id}`)
      .set("Cookie", tokenCookies)
      .send({ title: "Updated Task", completed: true });

    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe("Updated Task");
    expect(res.body.completed).toBe(true);
  });

  it("should return 404 when updating non-existent task", async () => {
    const fakeId = new mongoose.Types.ObjectId();

    const res = await request(app)
      .put(`/api/tasks/${fakeId}`)
      .set("Cookie", tokenCookies)
      .send({ title: "Nothing" });

    expect(res.statusCode).toBe(404);
  });

  it("should delete a task", async () => {
    const task = await Task.create({ ...taskData, user: userId });

    const res = await request(app)
      .delete(`/api/tasks/${task._id}`)
      .set("Cookie", tokenCookies);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Task deleted");
  });

  it("should return 404 when deleting non-existent task", async () => {
    const fakeId = new mongoose.Types.ObjectId();

    const res = await request(app)
      .delete(`/api/tasks/${fakeId}`)
      .set("Cookie", tokenCookies);

    expect(res.statusCode).toBe(404);
    expect(res.body.message).toBe("Task not found");
  });

  it("should not allow unauthenticated access", async () => {
    const res = await request(app).get("/api/tasks");
    expect(res.statusCode).toBe(401);
  });
});
