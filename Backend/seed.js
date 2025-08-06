import mongoose from "mongoose";
import User from "./src/models/user.model.js";
import Task from "./src/models/task.model.js";

const users = [
  {
    name: "Raj",
    email: "raj@gmail.com",
    password: "12345678",
    tasks: [
      {
        title: "Complete React testing setup",
        dueDate: new Date("2025-08-10"),
        completed: false,
      },
      {
        title: "Refactor TaskFormModal",
        dueDate: new Date("2025-08-12"),
        completed: true,
      },
      {
        title: "Finish frontend testing",
        dueDate: new Date("2025-08-10"),
        completed: false,
      },
      {
        title: "Update backend validation",
        dueDate: new Date("2025-08-12"),
        completed: true,
      },
      {
        title: "Prepare for MongoDB interview",
        dueDate: new Date("2025-08-15"),
        completed: false,
      },
    ],
  },
  {
    name: "Jane",
    email: "jane@gmail.com",
    password: "password456",
    tasks: [
      {
        title: "Write unit tests for Auth routes",
        dueDate: new Date("2025-08-14"),
        completed: false,
      },
      {
        title: "Update README with setup guide",
        dueDate: new Date("2025-08-15"),
        completed: true,
      },
    ],
  },
];

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");

    // Clear previous data
    await User.deleteMany();
    await Task.deleteMany();
    console.log("Cleared previous users and tasks");

    for (const userData of users) {
      const user = await User.create({
        name: userData.name,
        email: userData.email,
        password: userData.password,
      });

      const userTasks = userData.tasks.map((task) => ({
        ...task,
        user: user._id,
      }));

      await Task.insertMany(userTasks);
      console.log(`Inserted data for ${user.name}`);
    }

    console.log(" Test Users:");
    users.forEach(({ email, password }) => {
      console.log(`- ${email} | ${password}`);
    });

    process.exit(0);
  } catch (err) {
    console.error(" Error seeding database:", err);
    process.exit(1);
  }
};

seedDatabase();
