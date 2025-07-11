// import { useState, useEffect, useRef } from "react";
// import { Link, useLocation } from "react-router-dom";
// import { ChevronDown, Menu, X } from "lucide-react";

// const Navbar = () => {
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const location = useLocation();
//   const dropdownRef = useRef(null);
//   const navRef = useRef(null);

//   const isActive = (path) => location.pathname === path;

//   // Close dropdown when clicking outside
//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setDropdownOpen(false);
//       }
//     };

//     document.addEventListener("mousedown", handleClickOutside);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//     };
//   }, []);

//   // Close menu when navigating
//   useEffect(() => {
//     setMenuOpen(false);
//     setDropdownOpen(false);
//   }, [location]);

//   return (
//     <nav
//       className="fixed top-0 w-full bg-gradient-to-r from-purple-900 to-indigo-900 text-white z-50 shadow-lg"
//       ref={navRef}
//     >
//       <div className="container mx-auto flex items-center justify-between px-4 py-3 md:py-4">
//         {/* Logo */}
//         <Link to="/" className="text-2xl md:text-3xl font-extrabold tracking-tight">
//           <span className="text-white">Edu</span>
//           <span className="text-yellow-300">Assist</span>
//         </Link>

//         {/* Mobile Menu Button */}
//         <div className="md:hidden">
//           <button
//             onClick={() => setMenuOpen(!menuOpen)}
//             className="p-1 focus:outline-none focus:ring-2 focus:ring-yellow-300 rounded"
//             aria-label="Toggle menu"
//           >
//             {menuOpen ? <X size={28} /> : <Menu size={28} />}
//           </button>
//         </div>

//         {/* Nav Links */}
//         <div
//           className={`${menuOpen
//             ? "absolute left-0 right-0 top-full bg-gradient-to-b from-purple-900 to-indigo-900 shadow-xl px-4 py-3"
//             : "hidden"
//             } md:block md:relative md:bg-transparent md:shadow-none md:px-0 md:py-0`}
//         >
//           <ul
//             className={`md:flex md:items-center md:space-x-6 space-y-3 md:space-y-0 text-base font-medium ${menuOpen ? "block" : "hidden md:flex"
//               }`}
//           >
//             <li>
//               <Link
//                 to="/"
//                 className={`block py-2 hover:text-yellow-300 transition ${isActive("/") ? "text-yellow-300 font-semibold" : ""
//                   }`}
//               >
//                 Home
//               </Link>
//             </li>
//             <li>
//               <Link
//                 to="/about"
//                 className={`block py-2 hover:text-yellow-300 transition ${isActive("/about") ? "text-yellow-300 font-semibold" : ""
//                   }`}
//               >
//                 About
//               </Link>
//             </li>

//             <li>
//               <a
//                 href="https://eduassist-video-platform.onrender.com/"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className={`block py-2 hover:text-yellow-300 transition ${isActive("/contact") ? "text-yellow-300 font-semibold" : ""}`}
//               >
//                 Video Calling
//               </a>
//             </li>

//             <li>
//               <a
//                 href="https://www.abc.com/"
//                 target="_blank"
//                 rel="noopener noreferrer"
//                 className={`block py-2 hover:text-yellow-300 transition ${isActive("/contact") ? "text-yellow-300 font-semibold" : ""}`}
//               >
//                 WorkFlow Tracker
//               </a>
//             </li>



//             {/* Dropdown */}
//             <li className="relative" ref={dropdownRef}>
//               <button
//                 onClick={() => setDropdownOpen(!dropdownOpen)}
//                 className="flex items-center py-2 hover:text-yellow-300 transition w-full md:w-auto"
//               >
//                 Explore
//                 <ChevronDown
//                   size={18}
//                   className={`ml-1 transition-transform ${dropdownOpen ? "rotate-180" : ""
//                     }`}
//                 />
//               </button>
//               {dropdownOpen && (
//                 <ul className="md:absolute mt-0 md:mt-2 bg-purple-800 rounded shadow-lg w-full md:w-44 text-sm">
//                   {[
//                     { name: "EduAI", path: "/EduAI" },
//                     { name: "AnsCheck", path: "/ansCheck" },
//                     { name: "QuizGenerate", path: "/quiz-generate" },
//                     // { name: "AIFriend", path: "/friend" },
//                     { name: "Assignment", path: "/assignment" },
//                     { name: "EasyLearn", path: "/choose-topic" },
//                   ].map((item) => (
//                     <li key={item.path}>
//                       <Link
//                         to={item.path}
//                         className="block px-4 py-2 hover:bg-purple-700 transition"
//                       >
//                         {item.name}
//                       </Link>
//                     </li>
//                   ))}
//                 </ul>
//               )}
//             </li>

//             <li>
//               <Link
//                 to="/oral-assess-choose-subject"
//                 className={`block py-2 hover:text-yellow-300 transition ${isActive("/MockInterview") ? "text-yellow-300 font-semibold" : ""
//                   }`}
//               >
//                 AI Teacher Convo
//               </Link>
//             </li>
//             {/* <li className="pt-2 md:pt-0 border-t border-purple-700 md:border-t-0">
//               <Link
//                 to="/login"
//                 className="block px-4 py-2 border border-white rounded hover:bg-white hover:text-purple-900 transition text-center"
//               >
//                 Teacher Login
//               </Link>
//             </li> */}
//             <li>
//               <Link
//                 to="/register"
//                 className="block px-4 py-2 bg-yellow-300 text-purple-900 font-semibold rounded hover:bg-yellow-400 transition text-center mt-2 md:mt-0"
//               >
//                 Register
//               </Link>
//             </li>
//           </ul>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;




// import { useState, useEffect, useRef } from "react";
// import { Link, useLocation } from "react-router-dom";
// import { ChevronDown, Menu, X } from "lucide-react";
// import { supabase } from "../lib/supabaseClient";

// const Navbar = () => {
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [userEmail, setUserEmail] = useState("");
//   const location = useLocation();
//   const dropdownRef = useRef(null);
//   const navRef = useRef(null);

//   const isActive = (path) => location.pathname === path;

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setDropdownOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   useEffect(() => {
//     setMenuOpen(false);
//     setDropdownOpen(false);
//   }, [location]);

//   useEffect(() => {
//     const fetchUser = async () => {
//       const { data: { user } } = await supabase.auth.getUser();
//       if (user) setUserEmail(user.email);
//     };
//     fetchUser();
//   }, []);

//   const getInitials = (email) => {
//     if (!email) return "U";
//     return email[0].toUpperCase();
//   };

//   return (
//     <nav className="fixed top-0 w-full bg-gradient-to-r from-purple-900 to-indigo-900 text-white z-50 shadow-lg" ref={navRef}>
//       <div className="container mx-auto flex items-center justify-between px-4 py-3 md:py-4">
//         <div className="flex items-center gap-4">
//           <Link to="/" className="text-2xl md:text-3xl font-extrabold tracking-tight">
//             <span className="text-white">Edu</span>
//             <span className="text-yellow-300">Assist</span>
//           </Link>
//         </div>

//         {/* User Profile */}
//         {userEmail && (
//           <div className="hidden md:flex items-center gap-3">
//             <div className="w-8 h-8 rounded-full bg-yellow-300 text-purple-900 font-bold flex items-center justify-center">
//               {getInitials(userEmail)}
//             </div>
//             <span className="text-yellow-300 text-sm font-medium">{userEmail}</span>
//           </div>
//         )}

//         <div className="md:hidden">
//           <button
//             onClick={() => setMenuOpen(!menuOpen)}
//             className="p-1 focus:outline-none focus:ring-2 focus:ring-yellow-300 rounded"
//             aria-label="Toggle menu"
//           >
//             {menuOpen ? <X size={28} /> : <Menu size={28} />}
//           </button>
//         </div>

//         <div className={`$ {
//             menuOpen ? "absolute left-0 right-0 top-full bg-gradient-to-b from-purple-900 to-indigo-900 shadow-xl px-4 py-3" : "hidden"
//           } md:block md:relative md:bg-transparent md:shadow-none md:px-0 md:py-0`}>
//           <ul className={`md:flex md:items-center md:space-x-6 space-y-3 md:space-y-0 text-base font-medium ${menuOpen ? "block" : "hidden md:flex"}`}>
//             <li>
//               <Link to="/" className={`block py-2 hover:text-yellow-300 transition ${isActive("/") ? "text-yellow-300 font-semibold" : ""}`}>
//                 Home
//               </Link>
//             </li>
//             <li>
//               <Link to="/about" className={`block py-2 hover:text-yellow-300 transition ${isActive("/about") ? "text-yellow-300 font-semibold" : ""}`}>
//                 About
//               </Link>
//             </li>
//             <li>
//               <a href="https://eduassist-video-platform.onrender.com/" target="_blank" rel="noopener noreferrer" className="block py-2 hover:text-yellow-300 transition">
//                 Video Calling
//               </a>
//             </li>
//             <li>
//               <a href="https://www.abc.com/" target="_blank" rel="noopener noreferrer" className="block py-2 hover:text-yellow-300 transition">
//                 WorkFlow Tracker
//               </a>
//             </li>
//             <li className="relative" ref={dropdownRef}>
//               <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center py-2 hover:text-yellow-300 transition w-full md:w-auto">
//                 Explore
//                 <ChevronDown size={18} className={`ml-1 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
//               </button>
//               {dropdownOpen && (
//                 <ul className="md:absolute mt-0 md:mt-2 bg-purple-800 rounded shadow-lg w-full md:w-44 text-sm">
//                   {[{ name: "EduAI", path: "/EduAI" }, { name: "AnsCheck", path: "/ansCheck" }, { name: "QuizGenerate", path: "/quiz-generate" }, { name: "Assignment", path: "/assignment" }, { name: "EasyLearn", path: "/choose-topic" }].map((item) => (
//                     <li key={item.path}>
//                       <Link to={item.path} className="block px-4 py-2 hover:bg-purple-700 transition">
//                         {item.name}
//                       </Link>
//                     </li>
//                   ))}
//                 </ul>
//               )}
//             </li>
//             <li>
//               <Link to="/oral-assess-choose-subject" className={`block py-2 hover:text-yellow-300 transition ${isActive("/MockInterview") ? "text-yellow-300 font-semibold" : ""}`}>
//                 AI Teacher Convo
//               </Link>
//             </li>
//             {!userEmail && (
//               <li>
//                 <Link to="/register" className="block px-4 py-2 bg-yellow-300 text-purple-900 font-semibold rounded hover:bg-yellow-400 transition text-center mt-2 md:mt-0">
//                   Register
//                 </Link>
//               </li>
//             )}
//             {!userEmail && (
//               <li>
//                 <Link to="/login" className="block px-4 py-2 bg-yellow-300 text-purple-900 font-semibold rounded hover:bg-yellow-400 transition text-center mt-2 md:mt-0">
//                   Login
//                 </Link>
//               </li>
//             )}

//           </ul>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;


// import { useState, useEffect, useRef } from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { ChevronDown, Menu, X } from "lucide-react";
// import { supabase } from "../lib/supabaseClient";

// const Navbar = () => {
//   const [menuOpen, setMenuOpen] = useState(false);
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const [userEmail, setUserEmail] = useState("");
//   const location = useLocation();
//   const navigate = useNavigate();
//   const dropdownRef = useRef(null);
//   const navRef = useRef(null);

//   const isActive = (path) => location.pathname === path;

//   useEffect(() => {
//     const handleClickOutside = (event) => {
//       if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
//         setDropdownOpen(false);
//       }
//     };
//     document.addEventListener("mousedown", handleClickOutside);
//     return () => document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   useEffect(() => {
//     setMenuOpen(false);
//     setDropdownOpen(false);
//   }, [location]);

//   useEffect(() => {
//     const fetchUser = async () => {
//       const { data: { user } } = await supabase.auth.getUser();
//       if (user) setUserEmail(user.email);
//     };
//     fetchUser();
//   }, []);

//   const handleSignOut = async () => {
//     await supabase.auth.signOut();
//     localStorage.removeItem("eduassist_user_email");
//     setUserEmail("");
//     navigate("/login");
//   };

//   const getInitials = (email) => {
//     if (!email) return "U";
//     return email[0].toUpperCase();
//   };

//   return (
//     <nav className="fixed top-0 w-full bg-gradient-to-r from-purple-900 to-indigo-900 text-white z-50 shadow-lg" ref={navRef}>
//       <div className="container mx-auto flex items-center justify-between px-4 py-3 md:py-4">
//         <div className="flex items-center gap-4">
//           <Link to="/" className="text-2xl md:text-3xl font-extrabold tracking-tight">
//             <span className="text-white">Edu</span>
//             <span className="text-yellow-300">Assist</span>
//           </Link>
//         </div>


//         <div className="md:hidden">
//           <button
//             onClick={() => setMenuOpen(!menuOpen)}
//             className="p-1 focus:outline-none focus:ring-2 focus:ring-yellow-300 rounded"
//             aria-label="Toggle menu"
//           >
//             {menuOpen ? <X size={28} /> : <Menu size={28} />}
//           </button>
//         </div>

//         <div className={`${
//           menuOpen ? "absolute left-0 right-0 top-full bg-gradient-to-b from-purple-900 to-indigo-900 shadow-xl px-4 py-3" : "hidden"
//         } md:block md:relative md:bg-transparent md:shadow-none md:px-0 md:py-0`}>
//           <ul className={`md:flex md:items-center md:space-x-6 space-y-3 md:space-y-0 text-base font-medium ${menuOpen ? "block" : "hidden md:flex"}`}>
//             <li>
//               <Link to="/" className={`block py-2 hover:text-yellow-300 transition ${isActive("/") ? "text-yellow-300 font-semibold" : ""}`}>
//                 Home
//               </Link>
//             </li>
//             <li>
//               <Link to="/about" className={`block py-2 hover:text-yellow-300 transition ${isActive("/about") ? "text-yellow-300 font-semibold" : ""}`}>
//                 About
//               </Link>
//             </li>
//             <li>
//               <a href="https://eduassist-video-platform.onrender.com/" target="_blank" rel="noopener noreferrer" className="block py-2 hover:text-yellow-300 transition">
//                 Video Calling
//               </a>
//             </li>
//             <li>
//               <a href="https://www.abc.com/" target="_blank" rel="noopener noreferrer" className="block py-2 hover:text-yellow-300 transition">
//                 WorkFlow Tracker
//               </a>
//             </li>
//             <li className="relative" ref={dropdownRef}>
//               <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center py-2 hover:text-yellow-300 transition w-full md:w-auto">
//                 Explore
//                 <ChevronDown size={18} className={`ml-1 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
//               </button>
//               {dropdownOpen && (
//                 <ul className="md:absolute mt-0 md:mt-2 bg-purple-800 rounded shadow-lg w-full md:w-44 text-sm">
//                   {[{ name: "EduAI", path: "/EduAI" }, { name: "AnsCheck", path: "/ansCheck" }, { name: "QuizGenerate", path: "/quiz-generate" }, { name: "Assignment", path: "/assignment" }, { name: "EasyLearn", path: "/choose-topic" }].map((item) => (
//                     <li key={item.path}>
//                       <Link to={item.path} className="block px-4 py-2 hover:bg-purple-700 transition">
//                         {item.name}
//                       </Link>
//                     </li>
//                   ))}
//                 </ul>
//               )}
//             </li>
//             <li>
//               <Link to="/oral-assess-choose-subject" className={`block py-2 hover:text-yellow-300 transition ${isActive("/MockInterview") ? "text-yellow-300 font-semibold" : ""}`}>
//                 AI Teacher Convo
//               </Link>
//             </li>
//             {!userEmail && (
//               <li>
//                 <Link to="/register" className="block px-4 py-2 bg-yellow-300 text-purple-900 font-semibold rounded hover:bg-yellow-400 transition text-center mt-2 md:mt-0">
//                   Register
//                 </Link>
//               </li>
//             )}
//             {!userEmail && (
//               <li>
//                 <Link to="/login" className="block px-4 py-2 bg-yellow-300 text-purple-900 font-semibold rounded hover:bg-yellow-400 transition text-center mt-2 md:mt-0">
//                   Login
//                 </Link>
//               </li>
//             )}
//                     {/* User Profile */}
//         {userEmail && (
//           <div className="hidden md:flex items-center gap-3">
//             <div className="w-8 h-8 rounded-full bg-yellow-300 text-purple-900 font-bold flex items-center justify-center">
//               {getInitials(userEmail)}
//             </div>
//             <span className="text-yellow-300 text-sm font-medium">{userEmail}</span>
//             <button
//               onClick={handleSignOut}
//               className="ml-3 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm"
//             >
//               Sign Out
//             </button>
//           </div>
//         )}

//           </ul>
//         </div>
//       </div>
//     </nav>
//   );
// };

// export default Navbar;





import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { ChevronDown, Menu, X } from "lucide-react";
import { supabase } from "../lib/supabaseClient";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [isTeacher, setIsTeacher] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

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

  useEffect(() => {
    const storedEmail = localStorage.getItem("eduassist_user_email");
    const teacherFlag = localStorage.getItem("eduassist_is_teacher");

    if (storedEmail) setUserEmail(storedEmail);
    if (teacherFlag === "true") setIsTeacher(true);
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    localStorage.removeItem("eduassist_user_email");
    localStorage.removeItem("eduassist_is_teacher");
    localStorage.removeItem("eduassist_teacher_id");
    setUserEmail("");
    setIsTeacher(false);
    navigate("/login");
  };

  const getInitials = (email) => {
    if (!email) return "U";
    return email[0].toUpperCase();
  };

  return (
    <nav className="fixed top-0 w-full bg-gradient-to-r from-purple-900 to-indigo-900 text-white z-50 shadow-lg">
      <div className="container mx-auto flex items-center justify-between px-4 py-3 md:py-4">
        <Link to="/" className="text-2xl font-extrabold tracking-tight">
          <span className="text-white">Edu</span>
          <span className="text-yellow-300">Assist</span>
        </Link>

        {userEmail && (
          <div className="hidden md:flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-yellow-300 text-purple-900 font-bold flex items-center justify-center">{getInitials(userEmail)}</div>
            <span className="text-yellow-300 text-sm font-medium">{userEmail}</span>
            <button onClick={handleSignOut} className="ml-3 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm">Sign Out</button>
          </div>
        )}

        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="p-1 focus:outline-none focus:ring-2 focus:ring-yellow-300 rounded"
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        <div className={`${menuOpen ? "absolute left-0 right-0 top-full bg-gradient-to-b from-purple-900 to-indigo-900 shadow-xl px-4 py-3" : "hidden"
          } md:block md:relative md:bg-transparent md:shadow-none md:px-0 md:py-0`}>
          <ul className={`md:flex md:items-center md:space-x-6 space-y-3 md:space-y-0 text-base font-medium ${menuOpen ? "block" : "hidden md:flex"}`}>

            <li><Link to="/" className={`block py-2 hover:text-yellow-300 transition ${isActive("/") ? "text-yellow-300 font-semibold" : ""}`}>Home</Link></li>
            <li><Link to="/about" className={`block py-2 hover:text-yellow-300 transition ${isActive("/about") ? "text-yellow-300 font-semibold" : ""}`}>About</Link></li>
            <li><a href="https://eduassist-video-platform.onrender.com/" target="_blank" rel="noopener noreferrer" className="block py-2 hover:text-yellow-300 transition">Video Calling</a></li>
            <li><a href="https://www.abc.com/" target="_blank" rel="noopener noreferrer" className="block py-2 hover:text-yellow-300 transition">WorkFlow Tracker</a></li>

            <li className="relative" ref={dropdownRef}>
              <button onClick={() => setDropdownOpen(!dropdownOpen)} className="flex items-center py-2 hover:text-yellow-300 transition w-full md:w-auto">
                Explore <ChevronDown size={18} className={`ml-1 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
              </button>
              {dropdownOpen && (
                <ul className="md:absolute mt-0 md:mt-2 bg-purple-800 rounded shadow-lg w-full md:w-44 text-sm">
                  {[{ name: "EduAI", path: "/EduAI" }, { name: "AnsCheck", path: "/ansCheck" }, { name: "QuizGenerate", path: "/quiz-generate" }, { name: "Assignment", path: "/assignment" }, { name: "EasyLearn", path: "/choose-topic" }].map((item) => (
                    <li key={item.path}>
                      <Link to={item.path} className="block px-4 py-2 hover:bg-purple-700 transition">{item.name}</Link>
                    </li>
                  ))}
                </ul>
              )}
            </li>

            <li><Link to="/oral-assess-choose-subject" className={`block py-2 hover:text-yellow-300 transition ${isActive("/MockInterview") ? "text-yellow-300 font-semibold" : ""}`}>AI Teacher Convo</Link></li>

            {/* 🧑‍🏫 Teacher Dashboard Link */}
            {isTeacher && (
              <li>
                <Link to="/teacher-dashboard" className={`block py-2 hover:text-yellow-300 transition ${isActive("/teacher-dashboard") ? "text-yellow-300 font-semibold" : ""}`}>
                  Dashboard
                </Link>
              </li>
            )}

            {!userEmail && (
              <>
                <li><Link to="/register" className="block px-4 py-2 bg-yellow-300 text-purple-900 font-semibold rounded hover:bg-yellow-400 transition text-center mt-2 md:mt-0">Register</Link></li>
                <li><Link to="/login" className="block px-4 py-2 bg-yellow-300 text-purple-900 font-semibold rounded hover:bg-yellow-400 transition text-center mt-2 md:mt-0">Login</Link></li>
              </>
            )}

          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
