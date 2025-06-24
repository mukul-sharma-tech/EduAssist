import { useEffect, useState } from "react";
import { useAuthFetch } from "../../utilites/api";

export default function StudyTracker() {
  const api = useAuthFetch();

  const [subjects, setSubjects] = useState([]);
  const [sessions, setSessions] = useState([]);

  const [newSubject, setNewSubject] = useState({ name: "", syllabus: "", deadline: "" });
  const [newSession, setNewSession] = useState({ subjectId: "", topic: "", duration: "" });

  // Fetch subjects on load
  useEffect(() => {
    api("/subjects/", { method: "GET" }).then(setSubjects);
  }, []);

  // Add new subject
  const addSubject = async (e) => {
    e.preventDefault();
    const s = await api("/subjects/", { method: "POST", body: newSubject });
    setSubjects([...subjects, s]);
    setNewSubject({ name: "", syllabus: "", deadline: "" });
  };

  // Delete subject
  const deleteSubject = async (id) => {
    await api(`/subjects/${id}`, { method: "DELETE" });
    setSubjects(subjects.filter(s => s._id !== id));
  };

  // Add new session
  const addSession = async (e) => {
    e.preventDefault();
    const s = await api("/subjects/sessions", { method: "POST", body: newSession });
    setSessions([...sessions, s]);
    setNewSession({ subjectId: "", topic: "", duration: "" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br mt-16 from-gray-700 to-zinc-600 p-6 text-white font-sans">
      <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-lg p-8 rounded-xl space-y-10">
        <h1 className="text-3xl font-bold text-center"> Smart Study Tracker</h1>

        {/* Subject Form */}
        <form onSubmit={addSubject} className="space-y-4">
          <h2 className="text-xl font-semibold">Add Subject</h2>
          <input
            placeholder="Subject Name"
            value={newSubject.name}
            onChange={e => setNewSubject({ ...newSubject, name: e.target.value })}
            className="w-full p-3 rounded-md text-black"
            required
          />
          <input
            placeholder="Syllabus (optional)"
            value={newSubject.syllabus}
            onChange={e => setNewSubject({ ...newSubject, syllabus: e.target.value })}
            className="w-full p-3 rounded-md text-black"
          />
          <input
            type="date"
            value={newSubject.deadline}
            onChange={e => setNewSubject({ ...newSubject, deadline: e.target.value })}
            className="w-full p-3 rounded-md text-black"
          />
          <button className="bg-purple-500 px-5 py-2 rounded-md hover:bg-purple-600">Add Subject</button>
        </form>

        {/* Subject List */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Subjects</h2>
          <ul className="space-y-3">
            {subjects.map(s => (
              <li key={s._id} className="bg-white/20 p-4 rounded-md flex justify-between items-center">
                <div>
                  <p className="font-bold">{s.name}</p>
                  <p className="text-sm">Deadline: {s.deadline || "None"}</p>
                </div>
                <button onClick={() => deleteSubject(s._id)} className="bg-red-500 px-4 py-2 rounded-md text-sm">
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Session Form */}
        <form onSubmit={addSession} className="space-y-4">
          <h2 className="text-xl font-semibold">Add Session</h2>
          <select
            value={newSession.subjectId}
            onChange={e => setNewSession({ ...newSession, subjectId: e.target.value })}
            className="w-full p-3 rounded-md text-black"
            required
          >
            <option value="">Select Subject</option>
            {subjects.map(sub => (
              <option key={sub._id} value={sub._id}>{sub.name}</option>
            ))}
          </select>
          <input
            placeholder="Topic"
            value={newSession.topic}
            onChange={e => setNewSession({ ...newSession, topic: e.target.value })}
            className="w-full p-3 rounded-md text-black"
            required
          />
          <input
            placeholder="Duration (in mins)"
            value={newSession.duration}
            onChange={e => setNewSession({ ...newSession, duration: e.target.value })}
            className="w-full p-3 rounded-md text-black"
            required
          />
          <button className="bg-blue-500 px-5 py-2 rounded-md hover:bg-blue-600">Add Session</button>
        </form>
      </div>
    </div>
  );
}
