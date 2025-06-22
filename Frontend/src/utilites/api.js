import { useAuth } from "@clerk/clerk-react";

export const useAuthFetch = () => {
  const { getToken } = useAuth();
  return async (url, options = {}) => {
    const token = await getToken();
    const res = await fetch("http://localhost:5000/api" + url, {
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(options.body),
      method: options.method,
    });
    return res.json();
  };
};
