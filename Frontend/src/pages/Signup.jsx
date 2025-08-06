import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "@/lib/axios";
import { useAuthStore } from "@/store/useAuthStore";

export default function Signup() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    //console.log(formData);
    try {
      const res = await axios.post("/api/auth/signup", formData);
      setUser(res.data.user);
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Signup failed. Try again.");
    }
  };
  return (
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
          Sign Up
        </h2>

        <div className="mb-4">
          <label className="mb-2 block text-gray-700 dark:text-gray-200">
            Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full rounded border px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            required
          />
        </div>

        <div className="mb-4">
          <label className="mb-2 block text-gray-700 dark:text-gray-200">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full rounded border px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            required
          />
        </div>

        <div className="mb-6">
          <label className="mb-2 block text-gray-700 dark:text-gray-200">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full rounded border px-3 py-2 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full rounded bg-blue-600 px-4 py-2 font-bold text-white hover:bg-blue-700"
        >
          Sign Up
        </button>

        <p className="mt-4 text-center text-sm text-gray-700 dark:text-gray-300">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-500 hover:underline">
            Login here
          </Link>
        </p>
      </form>
    </div>
  );
}
