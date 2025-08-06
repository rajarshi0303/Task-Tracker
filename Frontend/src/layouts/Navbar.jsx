import React from "react";
import { Link } from "react-router-dom";
import ModeToggle from "@/theme/ModeToggle";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/store/useAuthStore";

export default function Navbar() {
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="fixed top-0 left-0 z-50 w-full bg-white shadow dark:bg-gray-900 dark:shadow-gray-800">
      <div className="mx-auto max-w-7xl space-y-4 p-4 md:p-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-primary text-2xl font-bold">
            Track Task
          </Link>
          <div className="flex items-center justify-between space-x-6">
            <ModeToggle />
            {user && (
              <button
                onClick={handleLogout}
                className="flex items-center rounded-md border-blue-500 bg-white py-1 text-blue-600 hover:bg-blue-50 md:gap-2 md:border-2 md:px-4 dark:border-blue-400 dark:bg-gray-900 dark:text-blue-300 dark:hover:bg-gray-800"
              >
                <svg
                  className="h-8 w-8 md:h-5 md:w-5"
                  data-slot="icon"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    clip-rule="evenodd"
                    fill-rule="evenodd"
                    d="M18.685 19.097A9.723 9.723 0 0 0 21.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 0 0 3.065 7.097A9.716 9.716 0 0 0 12 21.75a9.716 9.716 0 0 0 6.685-2.653Zm-12.54-1.285A7.486 7.486 0 0 1 12 15a7.486 7.486 0 0 1 5.855 2.812A8.224 8.224 0 0 1 12 20.25a8.224 8.224 0 0 1-5.855-2.438ZM15.75 9a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"
                  ></path>
                </svg>
                <span className="hidden md:block">
                  Hi, {user.name || "User"}
                </span>
              </button>
            )}
            {user && (
              <button
                onClick={handleLogout}
                className="rounded bg-red-500 px-4 py-1 text-white"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
