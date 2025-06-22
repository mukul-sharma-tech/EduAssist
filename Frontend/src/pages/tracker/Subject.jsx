import { useState, useEffect } from "react";
import { useAuthFetch } from "../../utilites/api";
// import { useAuthFetch } from "./api";

export default function Subjects() {
  const [subs, setSubs] = useState([]);
  const [name, setName] = useState("");
  const api = useAuthFetch();

  useEffect(() => {
    api("/users/subjects", { method: "GET" }).then(setSubs);
  }, []);

  const add = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    const s = await api("/subjects", { method: "POST", body: { name } });
    setSubs([...subs, s]);
    setName("");
  };

  const remove = async (id) => {
    await api(`/subjects/${id}`, { method: "DELETE" });
    setSubs(subs.filter(s => s._id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-700 to-blue-600 p-6 text-white font-sans">
      <div className="max-w-2xl mx-auto bg-white/10 backdrop-blur-md rounded-xl shadow-lg p-8 border border-white/20">
        <h2 className="text-3xl font-bold mb-6 text-center">📚 Manage Your Subjects</h2>

        {/* Subject Add Form */}
        <form onSubmit={add} className="flex gap-3 items-center mb-6">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter a new subject"
            className="flex-grow p-3 rounded-md bg-white/80 text-black focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <button
            type="submit"
            className="px-5 py-3 bg-purple-500 hover:bg-purple-600 text-white rounded-md transition duration-200"
          >
            Add
          </button>
        </form>

        {/* Subject List */}
        <ul className="space-y-3">
          {subs.map((s) => (
            <li
              key={s._id}
              className="flex justify-between items-center bg-white/20 p-4 rounded-lg border border-white/10"
            >
              <span className="text-lg">{s.name}</span>
              <button
                onClick={() => remove(s._id)}
                className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-md text-sm"
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
