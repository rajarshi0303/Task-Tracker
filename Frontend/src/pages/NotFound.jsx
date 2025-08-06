import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <h1 className="mb-4 text-6xl font-bold text-gray-800">404</h1>
      <p className="mb-6 text-gray-600">
        Page not found. The page you are looking for doesn't exist.
      </p>
      <Link
        to="/"
        className="rounded bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-600"
      >
        Go to Home
      </Link>
    </div>
  );
}
