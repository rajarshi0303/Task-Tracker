import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import axios from "@/lib/axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("/api/auth/login", { email, password });
      setUser(res.data.user);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Login failed. Try again.");
    }
  };
  return (
    <div>
      <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 px-4 dark:bg-gray-900">
        {error && (
          <div className="mb-4 rounded bg-red-100 px-4 py-2 text-sm text-red-600 dark:bg-red-200">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md rounded bg-white px-8 pt-6 pb-8 shadow-lg dark:bg-gray-800"
        >
          <h2 className="mb-6 text-center text-2xl font-bold text-gray-900 dark:text-white">
            Login
          </h2>

          <div className="mb-4">
            <label className="mb-2 block text-gray-700 dark:text-gray-200">
              Email
            </label>
            <input
              type="email"
              className="w-full rounded border px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-6">
            <label className="mb-2 block text-gray-700 dark:text-gray-200">
              Password
            </label>
            <input
              type="password"
              className="w-full rounded border px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full rounded bg-blue-600 px-4 py-2 font-bold text-white hover:bg-blue-700"
          >
            Login
          </button>

          <p className="mt-4 text-center text-sm text-gray-700 dark:text-gray-300">
            Don’t have an account?{" "}
            <Link to="/signup" className="text-blue-500 hover:underline">
              Sign up here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
