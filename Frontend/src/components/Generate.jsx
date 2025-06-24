import { useState } from "react";

function Generate() {
  const todayDate = new Date().toISOString().split("T")[0]; // "2025-06-24"
  const [subject, setSubject] = useState("");
  const [syllabus, setSyllabus] = useState("");
  const [deadline, setDeadline] = useState();
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState("");

  const handleGenerate = async () => {
    if (!subject || !syllabus || !deadline) return alert("Please fill all fields");

    setLoading(true);
    setPlan("");

    try {
      const res = await fetch("http://localhost:5000/generate-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject,
          syllabus,
          deadline,
          startDate: todayDate,  // sending today's date
        }),
      });

      const data = await res.json();
      setPlan(data.plan || "No plan generated.");
    } catch (err) {
      console.error("Error:", err);
      setPlan("Failed to generate plan.");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto mt-16 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4 text-center"> Study Planner</h1>

      <input
        type="text"
        placeholder="Enter Subject"
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        className="w-full border p-2 mb-3"
      />

      <textarea
        placeholder="Paste your syllabus here"
        value={syllabus}
        onChange={(e) => setSyllabus(e.target.value)}
        className="w-full border p-2 mb-3"
        rows={5}
      />

      <input
        type="date"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
        className="w-full border p-2 mb-4"
      />

      <button
        onClick={handleGenerate}
        className="bg-blue-600 text-white px-4 py-2 w-full rounded hover:bg-blue-700"
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate Plan"}
      </button>

      {plan && (
        <div className="mt-6 p-4 bg-gray-100 rounded whitespace-pre-wrap">
          <h2 className="text-lg font-semibold mb-2">Your Plan:</h2>
          {plan}
        </div>
      )}
    </div>
  );
}

export default Generate;
