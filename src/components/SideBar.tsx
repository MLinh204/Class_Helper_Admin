"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { logout } from "@/utils/api";

interface MenuItemProps {
  href: string;
  label: string;
  onClick?: () => void;
  active?: boolean;
}

const MenuItem = ({ href, label, onClick}: MenuItemProps) => (
  <li className="py-3 px-4 hover:bg-blue-100 w-full transition duration-200">
    <Link
      href={href}
      className={`block text-md font-semibold text-gray-700`}
      onClick={onClick}
    >
      {label}
    </Link>
  </li>
);

const NavLink = ({ href, label, active }: { href: string; label: string; active?: boolean }) => (
  <Link
    href={href}
    className={`mx-3 py-2 text-md font-medium ${
      active ? "text-blue-600 border-b-2 border-blue-600" : "text-gray-700 hover:text-blue-600"
    }`}
  >
    {label}
  </Link>
);

const SideBar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [settingsMenuOpen, setSettingsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <nav className="w-full bg-white shadow-md p-6 flex justify-between items-center border-b border-gray-200">
      {/* Left side - Settings Button */}
      <div className="relative">
        <button
          onClick={() => setSettingsMenuOpen(!settingsMenuOpen)}
          className="p-2 rounded-full hover:bg-gray-300 transition duration-200 focus:outline-none"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-7 w-7 text-gray-700"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
            />
          </svg>
        </button>

        {settingsMenuOpen && (
          <div className="absolute left-0 mt-3 py-3 w-60 bg-white rounded-lg shadow-lg border border-gray-300 z-20">
            <ul>
              <MenuItem href="/user" label="User Management" />
              <MenuItem href="/student-manage" label="Student Management" />
              <MenuItem href="/teacher" label="Teacher Management" />
              <MenuItem href="/attendance" label="Attendance Management" />
              <MenuItem href="/vocab" label="Vocab Management" />
              <MenuItem href="/registration" label="Registration List" />
            </ul>
          </div>
        )}
      </div>

      {/* Middle - Navigation Links */}
      <div className="hidden md:flex items-center">
        <NavLink href="/" label="Homepage" active={isActive('/')} />
        <NavLink href="/student" label="Student" active={isActive('/student')} />
        <NavLink href="/student/random" label="Random" active={isActive('/student/random')} />
      </div>

      {/* Right side - Mobile Navigation & Profile */}
      <div className="flex items-center">
        {/* Mobile Navigation Dropdown */}
        <div className="relative md:hidden mr-4">
          <button
            className="p-2 rounded-full hover:bg-gray-300 transition duration-200 focus:outline-none"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-6 w-6 text-gray-700"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </button>
        </div>

        {/* Profile Button */}
        <div className="relative">
          <button
            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            className="flex items-center focus:outline-none"
          >
            <div className="h-12 w-12 rounded-full bg-gray-400 flex items-center justify-center text-gray-800 text-lg font-semibold border-2 border-gray-500 shadow-md hover:bg-gray-500 transition duration-200">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </div>
          </button>

          {profileMenuOpen && (
            <div className="absolute right-0 mt-3 py-3 w-52 bg-white rounded-lg shadow-lg border border-gray-300 z-20">
              <ul>
                <MenuItem href="/profile" label="Profile Settings" />
                <li className="py-3 px-4 hover:bg-red-100 w-full transition duration-200">
                  <button
                    onClick={handleLogout}
                    className="block text-md font-semibold text-red-600 w-full text-left"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default SideBar;