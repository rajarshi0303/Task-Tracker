import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "@/lib/axios";
import TaskFormModal from "@/components/task/TaskFormModal";
import { useSearchParams } from "react-router-dom";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [searchParams, setSearchParams] = useSearchParams();
  const filter = searchParams.get("filter") || "all";
  const searchQuery = searchParams.get("search") || "";

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `/api/tasks?filter=${filter}&search=${searchQuery}`,
      );
      setTasks(res.data);
    } catch (err) {
      console.log(err);
      setError("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreate = async (newTask) => {
    try {
      await axios.post("/api/tasks", newTask);
      fetchTasks();
    } catch (err) {
      console.log(err);
      alert("Failed to create task.");
    }
  };

  const handleUpdate = async (taskId, updatedTask) => {
    try {
      await axios.put(`/api/tasks/${taskId}`, updatedTask);
      fetchTasks();
    } catch (err) {
      console.log(err);
      alert("Failed to update task.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      await axios.delete(`api/tasks/${id}`);
      setTasks((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      console.log(err);
      alert("Failed to delete task.");
    }
  };

  const handleInputChange = async ({
    filterValue = filter,
    searchValue = searchQuery,
  }) => {
    try {
      setSearchParams({
        filter: filterValue,
        search: searchValue,
      });

      const res = await axios.get(
        `/api/tasks?filter=${filterValue}&search=${searchValue}`,
      );
      setTasks(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to load tasks");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 text-gray-900 dark:bg-gray-900 dark:text-white">
        <p className="text-lg">Loading tasks...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 text-red-500 dark:bg-gray-900">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 text-gray-900 sm:p-6 dark:bg-gray-900 dark:text-white">
      <div className="mx-auto max-w-7xl md:px-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold">Your Tasks</h2>

          <TaskFormModal
            onSave={handleCreate}
            trigger={
              <button
                type="button"
                className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
              >
                Add Task
              </button>
            }
          />
        </div>

        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center">
            <Select
              value={filter}
              onValueChange={(value) => {
                handleInputChange({ filterValue: value });
              }}
            >
              <SelectTrigger className="w-[150px] border border-gray-300 bg-white shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>

            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) =>
                handleInputChange({ searchValue: e.target.value })
              }
              className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            />
          </div>
        </div>

        {tasks.length === 0 ? (
          <div className="flex h-full items-center justify-center bg-gray-100 text-gray-500 dark:bg-gray-900 dark:text-gray-400">
            <p>No tasks found.</p>
          </div>
        ) : (
          <ul className="space-y-4">
            {tasks.map((task) => (
              <li
                key={task._id}
                className="flex items-center justify-between rounded border border-gray-300 bg-white p-4 dark:border-gray-700 dark:bg-gray-800"
              >
                <Link to={`/tasks/${task._id}`}>
                  <h3 className="text-lg font-medium">{task.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {task.dueDate
                      ? `Due: ${new Date(task.dueDate).toLocaleDateString()}`
                      : "No due date"}
                  </p>
                </Link>

                <div className="flex items-center gap-3">
                  <span
                    className={`rounded-full px-2 py-1 text-xs font-semibold ${
                      task.completed
                        ? "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-200"
                        : "bg-yellow-100 text-yellow-700 dark:bg-yellow-700 dark:text-yellow-200"
                    }`}
                  >
                    {task.completed ? "Completed" : "Pending"}
                  </span>

                  <TaskFormModal
                    isEdit
                    task={task}
                    trigger={
                      <button className="text-sm text-blue-500 hover:underline">
                        Edit
                      </button>
                    }
                    onSave={(updatedTask) =>
                      handleUpdate(task._id, updatedTask)
                    }
                  />

                  <button
                    className="text-sm text-red-500 hover:underline"
                    onClick={() => handleDelete(task._id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
