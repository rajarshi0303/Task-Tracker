import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "@/lib/axios";
import clsx from "clsx";

export default function TaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTask = async () => {
      try {
        const res = await axios.get(`/api/tasks/${id}`);
        setTask(res.data);
      } catch (err) {
        console.log(err);
        setError("Failed to load task.");
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id]);

  if (loading) return <p className="mt-10 text-center">Loading...</p>;
  if (error) return <p className="mt-10 text-center text-red-500">{error}</p>;
  if (!task) return null;

  return (
    <>
      <div className="mx-auto mt-36 max-w-xl px-4">
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-700 dark:bg-gray-800">
          <h2 className="mb-4 text-2xl font-semibold text-gray-800 dark:text-gray-100">
            Task Detail
          </h2>

          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200">
              Title
            </h3>
            <p className="text-gray-900 dark:text-gray-100">{task.title}</p>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200">
              Due Date
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              {task.dueDate
                ? new Date(task.dueDate).toLocaleDateString()
                : "No due date"}
            </p>
          </div>

          <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-200">
              Status
            </h3>
            <span
              className={clsx(
                "inline-block rounded-full px-3 py-1 text-sm font-medium",
                task.completed
                  ? "bg-green-100 text-green-700 dark:bg-green-800 dark:text-green-100"
                  : "bg-yellow-100 text-yellow-700 dark:bg-yellow-800 dark:text-yellow-100",
              )}
            >
              {task.completed ? "Completed" : "Incomplete"}
            </span>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={() => navigate(-1)}
              className="text-sm text-blue-500 hover:underline md:text-base"
            >
              ← Back
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
