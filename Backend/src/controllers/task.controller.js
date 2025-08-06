import Task from "../models/task.model.js";

export const getTasks = async (req, res, next) => {
  try {
    const { filter, search } = req.query;

    const query = { user: req.user.id };

    if (filter === "completed") {
      query.completed = true;
    } else if (filter === "pending") {
      query.completed = false;
    }

    if (search) {
      query.title = { $regex: search, $options: "i" };
    }

    const tasks = await Task.find(query).sort({ createdAt: -1 });

    res.json(tasks);
  } catch (err) {
    next(err);
  }
};

export const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user.id });
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (err) {
    next(err);
  }
};

export const createTask = async (req, res, next) => {
  try {
    const { title, dueDate, completed } = req.body;
    const task = await Task.create({
      title,
      dueDate,
      completed,
      user: req.user.id,
    });
    res.status(201).json(task);
  } catch (err) {
    console.log(err);
    next(err);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user.id });
    if (!task) return res.status(404).json({ message: "Task not found" });

    task.title = req.body.title || task.title;
    task.dueDate = req.body.dueDate || task.dueDate;
    task.completed = req.body.completed ?? task.completed;

    const updated = await task.save();
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task deleted" });
  } catch (err) {
    next(err);
  }
};
