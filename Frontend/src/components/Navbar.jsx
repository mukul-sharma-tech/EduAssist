import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { ChevronDown, Menu, X } from "lucide-react";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/clerk-react";
import RegisterAsStudent from "./auth/SavUser";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();
  const dropdownRef = useRef(null);
  const navRef = useRef(null);

  const isActive = (path) => location.pathname === path;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
    setDropdownOpen(false);
  }, [location]);

  return (
    <nav
      className="fixed top-0 w-full bg-gradient-to-r from-purple-900 to-indigo-900 text-white z-50 shadow-lg"
      ref={navRef}
    >
      <div className="container mx-auto flex items-center justify-between px-4 py-3 md:py-4">
        <Link to="/" className="text-2xl md:text-3xl font-extrabold tracking-tight">
          <span className="text-white">Edu</span>
          <span className="text-yellow-300">Assist</span>
        </Link>

        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1 focus:outline-none focus:ring-2 focus:ring-yellow-300 rounded"
          >
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        <div
          className={`${menuOpen
            ? "absolute left-0 right-0 top-full bg-gradient-to-b from-purple-900 to-indigo-900 shadow-xl px-4 py-3"
            : "hidden"
            } md:block md:relative md:bg-transparent md:shadow-none md:px-0 md:py-0`}
        >
          <ul
            className={`md:flex md:items-center md:space-x-6 space-y-3 md:space-y-0 text-base font-medium ${menuOpen ? "block" : "hidden md:flex"
              }`}
          >
            <li>
              <Link
                to="/"
                className={`block py-2 hover:text-yellow-300 transition ${isActive("/") ? "text-yellow-300 font-semibold" : ""
                  }`}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className={`block py-2 hover:text-yellow-300 transition ${isActive("/about") ? "text-yellow-300 font-semibold" : ""
                  }`}
              >
                About
              </Link>
            </li>
            <li>
              <Link
                to="/contact"
                className={`block py-2 hover:text-yellow-300 transition ${isActive("/contact") ? "text-yellow-300 font-semibold" : ""
                  }`}
              >
                Contact
              </Link>
            </li>

            <li className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center py-2 hover:text-yellow-300 transition"
              >
                Explore
                <ChevronDown
                  size={18}
                  className={`ml-1 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                />
              </button>
              {dropdownOpen && (
                <ul className="md:absolute mt-0 md:mt-2 bg-purple-800 rounded shadow-lg w-full md:w-44 text-sm">
                  {[
                    { name: "EduAI", path: "/EduAI" },
                    { name: "AnsCheck", path: "/ansCheck" },
                    { name: "QuizGenerate", path: "/quiz-generate" },
                    { name: "AIFriend", path: "/friend" },
                    { name: "Assignment", path: "/assignment" },
                    { name: "EasyLearn", path: "/choose-topic" },
                  ].map((item) => (
                    <li key={item.path}>
                      <Link
                        to={item.path}
                        className="block px-4 py-2 hover:bg-purple-700 transition"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>

            <li>
              <Link
                to="/MockInterview"
                className={`block py-2 hover:text-yellow-300 transition ${isActive("/MockInterview") ? "text-yellow-300 font-semibold" : ""
                  }`}
              >
                AI Teacher Convo
              </Link>
            </li>
          </ul>
        </div>

        <div className="flex items-center gap-3 ml-4">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="px-4 py-2 bg-yellow-300 text-purple-900 font-semibold rounded hover:bg-yellow-400 transition">
                Sign In
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <div className="scale-125">
              <UserButton afterSignOutUrl="/" />
            </div>
            <RegisterAsStudent />
          </SignedIn>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
