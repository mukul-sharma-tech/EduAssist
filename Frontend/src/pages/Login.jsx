// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { supabase } from "../lib/supabaseClient";

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     const { error } = await supabase.auth.signInWithPassword({ email, password });
//     if (error) {
//       setError(error.message);
//     } else {
//       navigate("/");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 to-indigo-900 p-4">
//       <form onSubmit={handleLogin} className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full">
//         <h2 className="text-2xl font-bold mb-6 text-purple-900">Login to EduAssist</h2>

//         {error && <div className="text-red-600 text-sm mb-4">{error}</div>}

//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           className="w-full mb-4 px-4 py-2 border border-purple-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
//           required
//         />

//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           className="w-full mb-6 px-4 py-2 border border-purple-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
//           required
//         />

//         <button
//           type="submit"
//           className="w-full bg-yellow-300 hover:bg-yellow-400 text-purple-900 font-semibold py-2 px-4 rounded transition"
//         >
//           Login
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Login;








// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { supabase } from "../lib/supabaseClient";

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     const { data, error } = await supabase.auth.signInWithPassword({ email, password });
//     if (error) {
//       setError(error.message);
//     } else {
//       const userEmail = data.user?.email;
//       if (userEmail) {
//         localStorage.setItem("eduassist_user_email", userEmail);
//       }
//       navigate("/");
//     }
//   };

//   useEffect(() => {
//     const existingEmail = localStorage.getItem("eduassist_user_email");
//     if (existingEmail) setEmail(existingEmail);
//   }, []);

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 to-indigo-900 p-4">
//       <form onSubmit={handleLogin} className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full">
//         <h2 className="text-2xl font-bold mb-6 text-purple-900">Login to EduAssist</h2>

//         {error && <div className="text-red-600 text-sm mb-4">{error}</div>}

//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           className="w-full mb-4 px-4 py-2 border border-purple-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
//           required
//         />

//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           className="w-full mb-6 px-4 py-2 border border-purple-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
//           required
//         />

//         <button
//           type="submit"
//           className="w-full bg-yellow-300 hover:bg-yellow-400 text-purple-900 font-semibold py-2 px-4 rounded transition"
//         >
//           Login
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Login;


// import { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import { supabase } from "../lib/supabaseClient";

// const Login = () => {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     const { data, error } = await supabase.auth.signInWithPassword({ email, password });

//     if (error) {
//       setError(error.message);
//     } else {
//       const user = data.user;
//       if (user?.email && user?.id) {
//         localStorage.setItem("eduassist_user_email", user.email);

//         // Check if the user is a registered teacher
//         const { data: teacherData, error: teacherError } = await supabase
//           .from("teachers")
//           .select("*")
//           .eq("auth_id", user.id)
//           .single();

//         if (!teacherError && teacherData) {
//           localStorage.setItem("eduassist_is_teacher", "true");
//           localStorage.setItem("eduassist_teacher_id", teacherData.teacher_id);
//         } else {
//           localStorage.setItem("eduassist_is_teacher", "false");
//         }

//         navigate("/");
//       }
//     }
//   };

//   useEffect(() => {
//     const existingEmail = localStorage.getItem("eduassist_user_email");
//     if (existingEmail) setEmail(existingEmail);
//   }, []);

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 to-indigo-900 p-4">
//       <form onSubmit={handleLogin} className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full">
//         <h2 className="text-2xl font-bold mb-6 text-purple-900">Login to EduAssist</h2>
//         {error && <div className="text-red-600 text-sm mb-4">{error}</div>}

//         <input
//           type="email"
//           placeholder="Email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           className="w-full mb-4 px-4 py-2 border border-purple-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
//           required
//         />

//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           className="w-full mb-6 px-4 py-2 border border-purple-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
//           required
//         />

//         <button
//           type="submit"
//           className="w-full bg-yellow-300 hover:bg-yellow-400 text-purple-900 font-semibold py-2 px-4 rounded transition"
//         >
//           Login
//         </button>
//       </form>
//     </div>
//   );
// };

// export default Login;




import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg("");

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      console.error("Login error:", authError.message);
      setErrorMsg("❌ Invalid email or password.");
      return;
    }

    // ✅ Store email
    localStorage.setItem("eduassist_user_email", email);

    // 🔍 Check if user is teacher
    const { data: teacherData } = await supabase
      .from("teachers")
      .select("id")
      .eq("email", email)
      .single();

    if (teacherData) {
      localStorage.setItem("eduassist_is_teacher", "true");
      localStorage.setItem("eduassist_teacher_id", teacherData.id);
      navigate("/teacher-dashboard");
      return;
    }

    // 🔍 Check if user is student
    const { data: studentData } = await supabase
      .from("students")
      .select("id")
      .eq("email", email)
      .single();

    if (studentData) {
      localStorage.setItem("eduassist_is_student", "true");
      localStorage.setItem("eduassist_student_id", studentData.id);
      navigate("/student-dashboard");
      return;
    }

    setErrorMsg("❌ No matching teacher or student record found.");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-200 via-indigo-300 to-blue-200 flex justify-center items-center px-4">
      <div className="bg-white shadow-lg rounded-xl p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-center text-indigo-700">Login to EduAssist</h2>

        {errorMsg && (
          <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4 text-sm">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
