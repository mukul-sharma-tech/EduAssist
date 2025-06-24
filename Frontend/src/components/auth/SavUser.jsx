import { useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";

const RegisterAsStudent = () => {
  const { getToken } = useAuth();

  useEffect(() => {
    const registerUser = async () => {
      try {
        const token = await getToken();

        if (!token) {
          console.warn(" No token found. User might be signed out.");
          return;
        }

        const res = await fetch("http://localhost:5000/api/users/register", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ role: "student" })
        });

        const data = await res.json();
        console.log("✅ User saved:", data);
      } catch (error) {
        console.error("❌ Error saving user:", error);
      }
    };

    registerUser();
  }, [getToken]);

  return null; // This component has no UI
};

export default RegisterAsStudent;
