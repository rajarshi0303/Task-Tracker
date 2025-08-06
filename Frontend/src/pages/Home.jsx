import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div>
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 px-4 transition-colors duration-300 dark:bg-gray-900">
        <h1 className="mb-4 text-center text-4xl font-bold text-gray-900 sm:text-5xl dark:text-white">
          Task Tracker App
        </h1>

        <p className="mb-8 max-w-xl text-center text-lg text-gray-700 dark:text-gray-300">
          Stay organized and manage your tasks effortlessly. Sign up to create,
          update, and track your daily tasks in one place.
        </p>

        <div className="flex gap-4">
          <Link
            to="/login"
            className="rounded bg-blue-600 px-6 py-2 text-white transition hover:bg-blue-700"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="rounded bg-gray-300 px-6 py-2 text-gray-900 transition hover:bg-gray-400 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
          >
            Signup
          </Link>
        </div>
      </div>
    </div>
  );
}
