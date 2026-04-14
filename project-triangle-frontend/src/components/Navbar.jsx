import React, { useState, useEffect, useRef, useCallback } from "react";
import { NavLink, Link } from "react-router-dom";
import { useUser } from "../context/UserContext";
import NotificationBell from "./NotificationBell";


// Reusable NavLinks component
const NavLinks = ({ isMobile, onClick, isLoggedIn }) => {
  const pathsBefore = ["/", "/projects", "/how-it-works", "/about"];
  const labelsBefore = ["Home", "Explore Projects", "How it works", "About Us"];

  const pathsAfter = ["/", "/projects", "/dashboard"];
  const labelsAfter = ["Home", "Explore Projects", "Dashboard"];

  const paths = isLoggedIn ? pathsAfter : pathsBefore;
  const labels = isLoggedIn ? labelsAfter : labelsBefore;

  return (
    <>
      {paths.map((path, i) => (
        <NavLink
          key={path}
          to={path}
          onClick={onClick}
          className={({ isActive }) =>
            `${isMobile ? "block" : "relative group"} transition-colors ${isActive ? "text-emerald-400" : "text-gray-200"
            } hover:text-emerald-400`
          }
        >
          {({ isActive }) => (
            <>
              {labels[i]}
              {!isMobile && (
                <span
                  className={`absolute left-0 -bottom-1 h-0.5 bg-gradient-to-r from-emerald-400 to-teal-400 transition-all duration-300 group-hover:w-full ${isActive ? "w-full" : "w-0"
                    }`}
                />
              )}
            </>
          )}
        </NavLink>
      ))}
    </>
  );
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [profileMenu, setProfileMenu] = useState(false);
  const { user, logout } = useUser();
  const menuRef = useRef();
  const firstItemRef = useRef();
  const lastItemRef = useRef();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Close dropdown on Esc key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setProfileMenu(false);
        if (document.activeElement instanceof HTMLElement) {
          document.activeElement.blur();
        }
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  // Trap focus inside dropdown
  const handleKeyDown = useCallback(
    (e) => {
      if (!profileMenu) return;
      if (e.key === "Tab") {
        if (e.shiftKey && document.activeElement === firstItemRef.current) {
          e.preventDefault();
          lastItemRef.current.focus();
        } else if (
          !e.shiftKey &&
          document.activeElement === lastItemRef.current
        ) {
          e.preventDefault();
          firstItemRef.current.focus();
        }
      }
    },
    [profileMenu]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <nav className="bg-gray-900 text-gray-100 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-lg md:text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent tracking-wide">
              Project<span className="text-white">Triangle</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 text-sm font-medium">
            <NavLinks isLoggedIn={!!user} />
          </div>

          {/* Profile / Auth */}
          <div className="hidden md:flex items-center space-x-4 relative">
            {!user ? (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 rounded-lg border border-emerald-500 text-emerald-400 hover:bg-emerald-500/10 transition-colors text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-400"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-medium hover:opacity-90 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-400"
                >
                  Sign Up
                </Link>
              </>
            ) : (

              <div
                className="relative flex items-center space-x-4" // Removed overflow-visible as it's not needed
                ref={menuRef}
              >
                {user && <NotificationBell />}
                <button
                  aria-label="User menu"
                  aria-expanded={profileMenu}
                  onClick={() => setProfileMenu(!profileMenu)}
                  className="flex items-center space-x-2 px-2 py-1 rounded-lg hover:bg-emerald-500/10 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition-colors"
                >
                  {user.avatar_url ? (
                    <img
                      src={user.avatar_url}
                      alt="User Avatar"
                      className="w-9 h-9 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center text-white font-semibold">
                      {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                    </div>
                  )}
                  <span className="text-sm font-medium">{user.name}</span>
                  <svg
                    className={`w-4 h-4 text-gray-400 transform transition-transform ${profileMenu ? "rotate-180" : "rotate-0"
                      }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {/* Dropdown Menu */}
                <div
                  role="menu"
                  className={`absolute right-0 top-full mt-2 w-48 bg-gray-900 text-gray-200 rounded-xl shadow-xl shadow-black/20 overflow-hidden border border-gray-700 transform transition-all duration-200 ease-out origin-top z-50 ${profileMenu
                    ? "scale-100 opacity-100"
                    : "scale-95 opacity-0 pointer-events-none"
                    }`}
                >
                  <Link
                    ref={firstItemRef}
                    to={`/profile/${user.id}`}
                    className="block px-5 py-2.5 text-sm hover:bg-emerald-500/10 hover:text-emerald-400 focus:outline-none focus:bg-emerald-500/20"
                    onClick={() => setProfileMenu(false)}
                  >
                    View Profile
                  </Link>

                  <Link
                    ref={firstItemRef}
                    to="/messages"
                    className="block px-5 py-2.5 text-sm hover:bg-emerald-500/10 hover:text-emerald-400 focus:outline-none focus:bg-emerald-500/20"
                    onClick={() => setProfileMenu(false)}
                  >
                    Messages
                  </Link>
                  <Link
                    to="/settings"
                    className="block px-5 py-2.5 text-sm hover:bg-emerald-500/10 hover:text-emerald-400 focus:outline-none focus:bg-emerald-500/20"
                    onClick={() => setProfileMenu(false)}
                  >
                    Settings
                  </Link>
                  <div className="border-t border-gray-700/60" />
                  <button
                    ref={lastItemRef}
                    onClick={() => {
                      logout();
                      setProfileMenu(false);
                    }}
                    className="w-full text-left px-5 py-2.5 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-500 font-medium focus:outline-none focus:bg-red-500/20"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden">
            <button
              aria-label="Toggle menu"
              onClick={() => setIsOpen(!isOpen)}
              aria-expanded={isOpen}
              className="focus:outline-none focus:ring-2 focus:ring-emerald-400 p-1 rounded-md transition-transform duration-300"
            >
              {isOpen ? (
                <svg
                  className="w-6 h-6 text-emerald-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="w-6 h-6 text-emerald-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden bg-gray-800 transform transition-all duration-300 ease-out origin-top overflow-hidden ${isOpen
          ? "max-h-screen opacity-100"
          : "max-h-0 opacity-0 pointer-events-none"
          }`}
      >
        <div className="px-4 pt-2 pb-3 space-y-2 text-sm">
          <NavLinks isMobile onClick={() => setIsOpen(false)} isLoggedIn={!!user} />

          {!user ? (
            <div className="pt-3 space-y-2">
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center px-4 py-2 rounded-lg border border-emerald-500 text-emerald-400 hover:bg-emerald-500/10 transition-colors text-sm font-medium"
              >
                Login
              </Link>
              <Link
                to="/register"
                onClick={() => setIsOpen(false)}
                className="block w-full text-center px-4 py-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-500 text-white text-sm font-medium hover:opacity-90 transition-colors"
              >
                Sign Up
              </Link>
            </div>
          ) : (
            <div className="pt-3 border-t border-gray-600/40 space-y-1">
              <Link
                to={`/profile/${user.id}`}
                onClick={() => setIsOpen(false)}
                className="block px-4 py-2 text-gray-200 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-md"
              >
                View Profile
              </Link>
              <Link
                to="/messages"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-2 text-gray-200 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-md"
              >
                Messages
              </Link>
              <Link
                to="/settings"
                onClick={() => setIsOpen(false)}
                className="block px-4 py-2 text-gray-200 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-md"
              >
                Settings
              </Link>
              <div className="border-t border-gray-600/40 my-1" />
              <button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                className="block w-full text-left px-4 py-2 text-red-400 hover:text-red-500 hover:bg-red-500/10 font-medium rounded-md"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;