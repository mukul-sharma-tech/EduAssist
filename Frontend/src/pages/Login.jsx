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


import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
    } else {
      const user = data.user;
      if (user?.email && user?.id) {
        localStorage.setItem("eduassist_user_email", user.email);

        // Check if the user is a registered teacher
        const { data: teacherData, error: teacherError } = await supabase
          .from("teachers")
          .select("*")
          .eq("auth_id", user.id)
          .single();

        if (!teacherError && teacherData) {
          localStorage.setItem("eduassist_is_teacher", "true");
          localStorage.setItem("eduassist_teacher_id", teacherData.teacher_id);
        } else {
          localStorage.setItem("eduassist_is_teacher", "false");
        }

        navigate("/");
      }
    }
  };

  useEffect(() => {
    const existingEmail = localStorage.getItem("eduassist_user_email");
    if (existingEmail) setEmail(existingEmail);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 to-indigo-900 p-4">
      <form onSubmit={handleLogin} className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6 text-purple-900">Login to EduAssist</h2>
        {error && <div className="text-red-600 text-sm mb-4">{error}</div>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 px-4 py-2 border border-purple-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
          required
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-6 px-4 py-2 border border-purple-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-600"
          required
        />

        <button
          type="submit"
          className="w-full bg-yellow-300 hover:bg-yellow-400 text-purple-900 font-semibold py-2 px-4 rounded transition"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
