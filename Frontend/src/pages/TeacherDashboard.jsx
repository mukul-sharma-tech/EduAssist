// import { useEffect, useState } from "react";
// import { supabase } from "../lib/supabaseClient";
// import axios from "axios";

// const TeacherDashboard = () => {
//   const [teacherId, setTeacherId] = useState("");
//   const [authId, setAuthId] = useState("");
//   const [students, setStudents] = useState([]);

//   const [syllabusFile, setSyllabusFile] = useState(null);
//   const [extractedSyllabus, setExtractedSyllabus] = useState("");
//   const [notesList, setNotesList] = useState([""]);

//   const [subject, setSubject] = useState("");
//   const [className, setClassName] = useState("");

//   useEffect(() => {
//     const storedTeacherId = localStorage.getItem("eduassist_teacher_id");
//     if (storedTeacherId) setTeacherId(storedTeacherId);

//     supabase.auth.getUser().then((res) => {
//       if (res.data?.user?.id) setAuthId(res.data.user.id);
//     });
//   }, []);

//   useEffect(() => {
//     const fetchStudents = async () => {
//       if (!teacherId) return;
//       const { data, error } = await supabase
//         .from("students")
//         .select("*")
//         .contains("teacher_ids", [teacherId]);

//       if (!error) setStudents(data);
//       else console.error("Error fetching students:", error);
//     };

//     fetchStudents();
//   }, [teacherId]);

//   const handleSyllabusUpload = async () => {
//     if (!syllabusFile || !subject || !className) return alert("Fill all fields");

//     const formData = new FormData();
//     formData.append("pdf", syllabusFile);

//     try {
//       const response = await axios.post("http://localhost:5000/extract-text-pdf", formData);
//       const text = response.data.text;
//       setExtractedSyllabus(text);

//       const { error } = await supabase.from("subject_materials").insert([
//         {
//           subject,
//           class: className,
//           syllabus: text,
//           notes: [],
//           policy: "Public",
//           teacher_id: teacherId,
//           auth_id: authId,
//         },
//       ]);

//       if (error) throw error;
//       alert("Syllabus uploaded successfully!");
//     } catch (err) {
//       console.error("Error uploading syllabus:", err.message);
//     }
//   };

//   const handleNotesUpload = async () => {
//     if (!notesList.length || !subject || !className) return alert("Fill all fields");

//     const cleanNotes = notesList.filter((n) => n.trim() !== "");
//     if (cleanNotes.length === 0) return alert("At least one note is required");

//     try {
//       const { error } = await supabase.from("subject_materials").insert([
//         {
//           subject,
//           class: className,
//           syllabus: "",
//           notes: cleanNotes,
//           policy: "Public",
//           teacher_id: teacherId,
//           auth_id: authId,
//         },
//       ]);

//       if (error) throw error;
//       alert("Notes uploaded successfully!");
//     } catch (err) {
//       console.error("Error uploading notes:", err.message);
//     }
//   };

//   const updateNote = (index, value) => {
//     const updated = [...notesList];
//     updated[index] = value;
//     setNotesList(updated);
//   };

//   const addNoteField = () => setNotesList([...notesList, ""]);
//   const removeNoteField = (index) =>
//     setNotesList(notesList.filter((_, i) => i !== index));

//   return (
//     <div className="p-6 max-w-5xl mx-auto">
//       <h2 className="text-3xl font-bold mb-6 text-purple-800">Teacher Dashboard</h2>

//       {/* Upload Syllabus */}
//       <div className="bg-white p-6 rounded shadow mb-6">
//         <h3 className="text-xl font-semibold mb-4">Upload Syllabus (PDF)</h3>

//         <input
//           type="text"
//           placeholder="Subject"
//           value={subject}
//           onChange={(e) => setSubject(e.target.value)}
//           className="border px-4 py-2 rounded w-full mb-3"
//         />
//         <input
//           type="text"
//           placeholder="Class"
//           value={className}
//           onChange={(e) => setClassName(e.target.value)}
//           className="border px-4 py-2 rounded w-full mb-3"
//         />
//         <input
//           type="file"
//           accept="application/pdf"
//           onChange={(e) => setSyllabusFile(e.target.files[0])}
//           className="mb-3"
//         />
//         <button
//           onClick={handleSyllabusUpload}
//           className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800"
//         >
//           Upload & Extract
//         </button>

//         {extractedSyllabus && (
//           <div className="mt-4 p-3 bg-gray-100 border rounded">
//             <h4 className="font-semibold mb-1">Extracted Syllabus:</h4>
//             <pre className="whitespace-pre-wrap">{extractedSyllabus}</pre>
//           </div>
//         )}
//       </div>

//       {/* Upload Notes */}
//       <div className="bg-white p-6 rounded shadow mb-6">
//         <h3 className="text-xl font-semibold mb-4">Upload Notes (URLs or File Links)</h3>
//         {notesList.map((note, i) => (
//           <div key={i} className="flex gap-2 mb-2">
//             <input
//               type="text"
//               placeholder={`Note ${i + 1} (URL)`}
//               value={note}
//               onChange={(e) => updateNote(i, e.target.value)}
//               className="flex-1 border px-3 py-2 rounded"
//             />
//             {notesList.length > 1 && (
//               <button onClick={() => removeNoteField(i)} className="text-red-600">Remove</button>
//             )}
//           </div>
//         ))}
//         <button
//           onClick={addNoteField}
//           className="text-sm text-purple-600 underline mb-4"
//         >
//           + Add Another Note
//         </button>
//         <br />
//         <button
//           onClick={handleNotesUpload}
//           className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
//         >
//           Upload Notes
//         </button>
//       </div>

//       {/* My Students */}
//       <div className="bg-white p-6 rounded shadow">
//         <h3 className="text-xl font-semibold mb-4">My Students</h3>
//         {students.length === 0 ? (
//           <p>No students assigned.</p>
//         ) : (
//           <ul className="space-y-2">
//             {students.map((student) => (
//               <li key={student.id} className="border-b py-2">
//                 <strong>{student.name}</strong> — Class: {student.class}, Roll No: {student.roll_no}
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </div>
//   );
// };

// export default TeacherDashboard;




import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import axios from "axios";

const TeacherDashboard = () => {
  const [teacherId, setTeacherId] = useState("");
  const [authId, setAuthId] = useState("");

  const [subject, setSubject] = useState("");
  const [className, setClassName] = useState("");
  const [syllabusPDF, setSyllabusPDF] = useState(null);
  const [notesPDF, setNotesPDF] = useState(null);
  const [extractedSyllabus, setExtractedSyllabus] = useState("");

  // Load IDs
  useEffect(() => {
    const storedTeacherId = localStorage.getItem("eduassist_teacher_id");
    if (storedTeacherId) setTeacherId(storedTeacherId);

    supabase.auth.getUser().then((res) => {
      if (res.data?.user?.id) setAuthId(res.data.user.id);
    });
  }, []);

  // Upload notes PDF to Supabase Storage
  const uploadNotesPDF = async (file) => {
    const fileName = `notes/${Date.now()}-${file.name}`;
    const { error } = await supabase.storage
      .from("materials")
      .upload(fileName, file);

    if (error) throw error;

    const { data } = supabase.storage
      .from("materials")
      .getPublicUrl(fileName);

    return data.publicUrl;
  };

  // Handle full form submission
const handleUpload = async () => {
  if (!subject || !className || !syllabusPDF || !notesPDF)
    return alert("Please fill all fields and upload both PDFs.");

  try {
    // 1. Extract text from syllabus PDF
    const syllabusForm = new FormData();
    syllabusForm.append("pdf", syllabusPDF);
    const syllabusRes = await axios.post(
      "http://localhost:5000/extract-text-pdf",
      syllabusForm
    );
    const syllabusText = syllabusRes.data.text;
    setExtractedSyllabus(syllabusText);

    // 2. Extract text from notes PDF
    const notesForm = new FormData();
    notesForm.append("pdf", notesPDF);
    const notesRes = await axios.post(
      "http://localhost:5000/extract-text-pdf",
      notesForm
    );
    const notesText = notesRes.data.text;

    // 3. Save to Supabase DB
    const { error } = await supabase.from("subject_materials").insert([
      {
        subject,
        class: className,
        syllabus: syllabusText,
        notes: [notesText], // Stored as array of extracted text(s)
        policy: "Public",
        teacher_id: teacherId,
        auth_id: authId,
      },
    ]);

    if (error) throw error;
    alert("✅ Materials uploaded and extracted successfully!");
  } catch (err) {
    console.error("❌ Upload failed:", err.message);
    alert("Failed to upload or extract materials.");
  }
};

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold mb-6 text-purple-800">Teacher Dashboard</h2>

      {/* Upload Form */}
      <div className="bg-white p-6 rounded shadow">
        <h3 className="text-xl font-semibold mb-4">Upload Syllabus & Notes (PDF)</h3>

        <input
          type="text"
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="border px-4 py-2 rounded w-full mb-3"
        />
        <input
          type="text"
          placeholder="Class"
          value={className}
          onChange={(e) => setClassName(e.target.value)}
          className="border px-4 py-2 rounded w-full mb-3"
        />

        <label className="font-medium block mb-1">Syllabus PDF</label>
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setSyllabusPDF(e.target.files[0])}
          className="mb-4"
        />

        <label className="font-medium block mb-1">Notes PDF</label>
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setNotesPDF(e.target.files[0])}
          className="mb-6"
        />

        <button
          onClick={handleUpload}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
        >
          Upload & Save Materials
        </button>

        {/* {extractedSyllabus && (
          <div className="mt-6 p-4 bg-gray-100 border rounded">
            <h4 className="font-semibold mb-2">Extracted Syllabus Text:</h4>
            <pre className="whitespace-pre-wrap text-sm">{extractedSyllabus}</pre>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default TeacherDashboard;
