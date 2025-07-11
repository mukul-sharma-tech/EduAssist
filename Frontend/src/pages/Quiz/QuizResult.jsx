// import React from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import { Trophy, RotateCcw } from 'lucide-react';

// const QuizResult = () => {
//   const { state } = useLocation();
//   const { questions = [], userAnswers = {} } = state || {};
//   const navigate = useNavigate();

//   const score = questions.reduce((total, q, i) => {
//     return total + (userAnswers[i] === q.answer ? 1 : 0);
//   }, 0);

//   return (
//     <motion.div 
//       initial={{ opacity: 0, y: 40 }} 
//       animate={{ opacity: 1, y: 0 }}
//       className="min-h-screen bg-gradient-to-b from-blue-100 to-white text-gray-900 p-6"
//     >
//       <div className="text-center mb-10">
//         <h1 className="text-4xl font-bold mb-4 text-blue-700 flex items-center justify-center gap-2">
//           <Trophy size={32} /> <span className="text-blue-400">Quiz Results</span>
//         </h1>
//         <p className="text-xl">🎯 You scored <span className="text-green-500 font-bold">{score} / {questions.length}</span></p>
//       </div>

//       <div className="space-y-4 max-w-3xl mx-auto">
//         {questions.map((q, i) => (
//           <motion.div
//             key={i}
//             className="bg-white/70 backdrop-blur-md border border-blue-200 p-4 rounded-xl shadow"
//             initial={{ opacity: 0, x: 10 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ delay: i * 0.1 }}
//           >
//             <p className="font-semibold">{i + 1}. {q.question}</p>
//             <p className="text-sm mt-1">
//               ✅ Correct Answer: <span className="text-green-600 font-semibold">{q.answer}</span><br />
//               🧍 Your Answer: <span className={userAnswers[i] === q.answer ? 'text-green-600' : 'text-red-500 font-semibold'}>
//                 {userAnswers[i] || 'Not answered'}
//               </span>
//             </p>
//           </motion.div>
//         ))}
//       </div>

//       <div className="flex justify-center mt-10">
//         <button
//           onClick={() => navigate('/quiz-generate')}
//           className="bg-blue-500 px-6 py-2 rounded-xl hover:bg-blue-600 text-white font-semibold flex items-center gap-2"
//         >
//           <RotateCcw size={20} /> Try Again
//         </button>
//       </div>
//     </motion.div>
//   );
// };

// export default QuizResult;



// import React, { useEffect } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import { Trophy, RotateCcw } from 'lucide-react';
// import { supabase } from '../../lib/supabaseClient';

// const QuizResult = () => {
//   const { state } = useLocation();
//   const { questions = [], userAnswers = {}, content = '' } = state || {};
//   const navigate = useNavigate();

//   const score = questions.reduce((total, q, i) => {
//     return total + (userAnswers[i] === q.answer ? 1 : 0);
//   }, 0);

//   const email = localStorage.getItem("eduassist_user_email");

//   useEffect(() => {
//     const saveTraits = async () => {
//       if (!email || questions.length === 0) return;

//       // Step 1: Get student ID by email
//       const { data: studentData, error: studentError } = await supabase
//         .from("students")
//         .select("id")
//         .eq("email", email)
//         .single();

//       if (studentError || !studentData) {
//         console.error("❌ Student fetch error:", studentError);
//         return;
//       }

//       const student_id = studentData.id;

//       // Step 2: Derive strengths and weaknesses
//       const strengths = [];
//       const weaknesses = [];

//       questions.forEach((q, i) => {
//         const topic = q.question.slice(0, 80); // or customize this mapping
//         if (userAnswers[i] === q.answer) {
//           strengths.push(topic);
//         } else {
//           weaknesses.push(topic);
//         }
//       });

//       // Step 3: Save to student_traits (insert or update)
//       const { error: traitError } = await supabase
//         .from("student_traits")
//         .upsert(
//           [
//             {
//               student_id,
//               strengths,
//               weaknesses,
//             }
//           ],
//           { onConflict: ['student_id'] }
//         );

//       if (traitError) {
//         console.error("❌ Trait save error:", traitError);
//       } else {
//         console.log("✅ Student traits saved successfully.");
//       }
//     };

//     saveTraits();
//   }, [email, questions, userAnswers]);

//   return (
//     <motion.div 
//       initial={{ opacity: 0, y: 40 }} 
//       animate={{ opacity: 1, y: 0 }}
//       className="min-h-screen bg-gradient-to-b from-blue-100 to-white text-gray-900 p-6"
//     >
//       <div className="text-center mb-10">
//         <h1 className="text-4xl font-bold mb-4 text-blue-700 flex items-center justify-center gap-2">
//           <Trophy size={32} /> <span className="text-blue-400">Quiz Results</span>
//         </h1>
//         <p className="text-xl">🎯 You scored <span className="text-green-500 font-bold">{score} / {questions.length}</span></p>
//       </div>

//       <div className="space-y-4 max-w-3xl mx-auto">
//         {questions.map((q, i) => (
//           <motion.div
//             key={i}
//             className="bg-white/70 backdrop-blur-md border border-blue-200 p-4 rounded-xl shadow"
//             initial={{ opacity: 0, x: 10 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ delay: i * 0.1 }}
//           >
//             <p className="font-semibold">{i + 1}. {q.question}</p>
//             <p className="text-sm mt-1">
//               ✅ Correct Answer: <span className="text-green-600 font-semibold">{q.answer}</span><br />
//               🧍 Your Answer: <span className={userAnswers[i] === q.answer ? 'text-green-600' : 'text-red-500 font-semibold'}>
//                 {userAnswers[i] || 'Not answered'}
//               </span>
//             </p>
//           </motion.div>
//         ))}
//       </div>

//       <div className="flex justify-center mt-10">
//         <button
//           onClick={() => navigate('/quiz-generate')}
//           className="bg-blue-500 px-6 py-2 rounded-xl hover:bg-blue-600 text-white font-semibold flex items-center gap-2"
//         >
//           <RotateCcw size={20} /> Try Again
//         </button>
//       </div>
//     </motion.div>
//   );
// };

// export default QuizResult;


// import React, { useEffect, useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import { Trophy, RotateCcw } from 'lucide-react';
// import { supabase } from '../../lib/supabaseClient';

// const QuizResult = () => {
//   const { state } = useLocation();
//   const { questions = [], userAnswers = {}, content = '' } = state || {};
//   const navigate = useNavigate();

//   const [saveMessage, setSaveMessage] = useState(null); // Success or error alert message
//   const [saveStatus, setSaveStatus] = useState(null);   // "success" or "error"

//   const score = questions.reduce((total, q, i) => {
//     return total + (userAnswers[i] === q.answer ? 1 : 0);
//   }, 0);

//   const email = localStorage.getItem("eduassist_user_email");

//   useEffect(() => {
//     const saveTraits = async () => {
//       if (!email || questions.length === 0) return;

//       console.log("📧 Logged in email:", email);

//       // Step 1: Get student by email
//       const { data: studentData, error: studentError } = await supabase
//         .from("students")
//         .select("id")
//         .eq("email", email)
//         .single();

//       if (studentError || !studentData) {
//         console.error("❌ Student fetch error:", studentError?.message || studentError);
//         setSaveStatus("error");
//         setSaveMessage("❌ Failed to find student record.");
//         return;
//       }

//       const student_id = studentData.id;
//       console.log("🎓 Fetched student ID:", student_id);

//       // Step 2: Build strengths & weaknesses
//       const strengths = [];
//       const weaknesses = [];

//       questions.forEach((q, i) => {
//         const topic = q.question.slice(0, 80); // crude topic mapping
//         if (userAnswers[i] === q.answer) {
//           strengths.push(topic);
//         } else {
//           weaknesses.push(topic);
//         }
//       });

//       console.log("💾 Traits upsert payload:", {
//         student_id,
//         strengths,
//         weaknesses,
//       });

//       // Step 3: Upsert into student_traits
//       const { error: traitError } = await supabase
//         .from("student_traits")
//         .upsert(
//           [
//             {
//               student_id,
//               strengths,
//               weaknesses,
//             }
//           ],
//           { onConflict: ['student_id'] }
//         );

//       if (traitError) {
//         console.error("❌ Trait save error details:", traitError.message || traitError);
//         setSaveStatus("error");
//         setSaveMessage(`❌ Save failed: ${traitError.message || "Unknown error"}`);
//       } else {
//         console.log("✅ Student traits saved successfully.");
//         setSaveStatus("success");
//         setSaveMessage("✅ Your strengths and weaknesses have been saved!");
//       }
//     };

//     saveTraits();
//   }, [email, questions, userAnswers]);

//   return (
//     <motion.div 
//       initial={{ opacity: 0, y: 40 }} 
//       animate={{ opacity: 1, y: 0 }}
//       className="min-h-screen bg-gradient-to-b from-blue-100 to-white text-gray-900 p-6"
//     >
//       <div className="text-center mb-10">
//         <h1 className="text-4xl font-bold mb-4 text-blue-700 flex items-center justify-center gap-2">
//           <Trophy size={32} /> <span className="text-blue-400">Quiz Results</span>
//         </h1>
//         <p className="text-xl">
//           🎯 You scored <span className="text-green-500 font-bold">{score} / {questions.length}</span>
//         </p>
//       </div>

//       {/* ✅ Success / Error Alert */}
//       {saveMessage && (
//         <div
//           className={`max-w-2xl mx-auto mb-6 px-4 py-3 rounded-lg text-center font-medium ${
//             saveStatus === "success"
//               ? "bg-green-100 text-green-700 border border-green-300"
//               : "bg-red-100 text-red-700 border border-red-300"
//           }`}
//         >
//           {saveMessage}
//         </div>
//       )}

//       <div className="space-y-4 max-w-3xl mx-auto">
//         {questions.map((q, i) => (
//           <motion.div
//             key={i}
//             className="bg-white/70 backdrop-blur-md border border-blue-200 p-4 rounded-xl shadow"
//             initial={{ opacity: 0, x: 10 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ delay: i * 0.1 }}
//           >
//             <p className="font-semibold">{i + 1}. {q.question}</p>
//             <p className="text-sm mt-1">
//               ✅ Correct Answer: <span className="text-green-600 font-semibold">{q.answer}</span><br />
//               🧍 Your Answer: <span className={userAnswers[i] === q.answer ? 'text-green-600' : 'text-red-500 font-semibold'}>
//                 {userAnswers[i] || 'Not answered'}
//               </span>
//             </p>
//           </motion.div>
//         ))}
//       </div>

//       <div className="flex justify-center mt-10">
//         <button
//           onClick={() => navigate('/quiz-generate')}
//           className="bg-blue-500 px-6 py-2 rounded-xl hover:bg-blue-600 text-white font-semibold flex items-center gap-2"
//         >
//           <RotateCcw size={20} /> Try Again
//         </button>
//       </div>
//     </motion.div>
//   );
// };

// export default QuizResult;



// import React, { useEffect, useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import { Trophy, RotateCcw } from 'lucide-react';
// import { supabase } from '../../lib/supabaseClient';
// import { GoogleGenerativeAI } from '@google/generative-ai';

// const QuizResult = () => {
//   const { state } = useLocation();
//   const navigate = useNavigate();

//   const contentFromStorage = localStorage.getItem("eduassist_quiz_content") || '';
//   const { questions = [], userAnswers = {}, content = contentFromStorage } = state || {};

//   const [saveMessage, setSaveMessage] = useState(null);
//   const [saveStatus, setSaveStatus] = useState(null);

//   const score = questions.reduce((total, q, i) => {
//     return total + (userAnswers[i] === q.answer ? 1 : 0);
//   }, 0);

//   const email = localStorage.getItem("eduassist_user_email");

//   useEffect(() => {
//     const saveTraits = async () => {
//       if (!email || questions.length === 0) return;

//       console.log("📧 Logged in email:", email);
//       console.log("📝 Raw content:", content);

//       // Step 1: Get student ID by email
//       const { data: studentData, error: studentError } = await supabase
//         .from("students")
//         .select("id")
//         .eq("email", email)
//         .single();

//       if (studentError || !studentData) {
//         console.error("❌ Student fetch error:", studentError?.message || studentError);
//         setSaveStatus("error");
//         setSaveMessage("❌ Failed to find student record.");
//         return;
//       }

//       const student_id = studentData.id;
//       console.log("🎓 Fetched student ID:", student_id);

//       // Step 2: Extract topic from content
//       let topicName = content.trim().slice(0, 80); // fallback topic

//       if (content.length > 300) {
//         try {
//           const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
//           const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
//           const topicPrompt = `Summarize this content into a short topic name (max 5 words):\n\n"""${content}"""`;
//           const result = await model.generateContent([topicPrompt]);
//           const topicText = await result.response.text();
//           topicName = topicText.trim().replace(/^"|"$/g, '') || topicName;
//           console.log("📘 Gemini Extracted Topic:", topicName);
//         } catch (err) {
//           console.error("❌ Failed to extract topic from Gemini:", err);
//         }
//       }

//       // Step 3: Classify topic as strength/weakness
//       const strengths = score >= 3 ? [topicName] : [];
//       const weaknesses = score < 3 ? [topicName] : [];

//       console.log("💾 Final payload:", {
//         student_id,
//         strengths,
//         weaknesses,
//       });

//       // Step 4: Save to Supabase
//       const { error: traitError } = await supabase
//         .from("student_traits")
//         .upsert(
//           [
//             {
//               student_id,
//               strengths,
//               weaknesses,
//             }
//           ],
//           { onConflict: ['student_id'] }
//         );

//       if (traitError) {
//         console.error("❌ Trait save error:", traitError.message || traitError);
//         setSaveStatus("error");
//         setSaveMessage(`❌ Save failed: ${traitError.message || "Unknown error"}`);
//       } else {
//         console.log("✅ Student traits saved successfully.");
//         setSaveStatus("success");
//         setSaveMessage("✅ Your strengths and weaknesses have been saved!");
//         localStorage.removeItem("eduassist_quiz_content");
//       }
//     };

//     saveTraits();
//   }, [email, questions, userAnswers]);

//   return (
//     <motion.div
//       initial={{ opacity: 0, y: 40 }}
//       animate={{ opacity: 1, y: 0 }}
//       className="min-h-screen bg-gradient-to-b from-blue-100 to-white text-gray-900 p-6"
//     >
//       <div className="text-center mb-10">
//         <h1 className="text-4xl font-bold mb-4 text-blue-700 flex items-center justify-center gap-2">
//           <Trophy size={32} /> <span className="text-blue-400">Quiz Results</span>
//         </h1>
//         <p className="text-xl">
//           🎯 You scored <span className="text-green-500 font-bold">{score} / {questions.length}</span>
//         </p>
//       </div>

//       {saveMessage && (
//         <div
//           className={`max-w-2xl mx-auto mb-6 px-4 py-3 rounded-lg text-center font-medium ${
//             saveStatus === "success"
//               ? "bg-green-100 text-green-700 border border-green-300"
//               : "bg-red-100 text-red-700 border border-red-300"
//           }`}
//         >
//           {saveMessage}
//         </div>
//       )}

//       <div className="space-y-4 max-w-3xl mx-auto">
//         {questions.map((q, i) => (
//           <motion.div
//             key={i}
//             className="bg-white/70 backdrop-blur-md border border-blue-200 p-4 rounded-xl shadow"
//             initial={{ opacity: 0, x: 10 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ delay: i * 0.1 }}
//           >
//             <p className="font-semibold">{i + 1}. {q.question}</p>
//             <p className="text-sm mt-1">
//               ✅ Correct Answer: <span className="text-green-600 font-semibold">{q.answer}</span><br />
//               🧍 Your Answer: <span className={userAnswers[i] === q.answer ? 'text-green-600' : 'text-red-500 font-semibold'}>
//                 {userAnswers[i] || 'Not answered'}
//               </span>
//             </p>
//           </motion.div>
//         ))}
//       </div>

//       <div className="flex justify-center mt-10">
//         <button
//           onClick={() => navigate('/quiz-generate')}
//           className="bg-blue-500 px-6 py-2 rounded-xl hover:bg-blue-600 text-white font-semibold flex items-center gap-2"
//         >
//           <RotateCcw size={20} /> Try Again
//         </button>
//       </div>
//     </motion.div>
//   );
// };

// export default QuizResult;


import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, RotateCcw } from 'lucide-react';
import { supabase } from '../../lib/supabaseClient';
import { GoogleGenerativeAI } from '@google/generative-ai';

const QuizResult = () => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const contentFromStorage = localStorage.getItem("eduassist_quiz_content") || '';
  const { questions = [], userAnswers = {}, content = contentFromStorage } = state || {};

  const [saveMessage, setSaveMessage] = useState(null);
  const [saveStatus, setSaveStatus] = useState(null);

  const score = questions.reduce((total, q, i) => {
    return total + (userAnswers[i] === q.answer ? 1 : 0);
  }, 0);

  const email = localStorage.getItem("eduassist_user_email");

  useEffect(() => {
    const saveTraits = async () => {
      if (!email || questions.length === 0) return;

      console.log("📧 Logged in email:", email);
      console.log("📝 Raw content:", content);

      // Step 1: Get student ID
      const { data: studentData, error: studentError } = await supabase
        .from("students")
        .select("id")
        .eq("email", email)
        .single();

      if (studentError || !studentData) {
        console.error("❌ Student fetch error:", studentError?.message || studentError);
        setSaveStatus("error");
        setSaveMessage("❌ Failed to find student record.");
        return;
      }

      const student_id = studentData.id;

      // Step 2: Extract topic
      let topicName = content.trim().slice(0, 80); // fallback topic
      if (content.length > 300) {
        try {
          const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
          const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
          const topicPrompt = `Summarize this content into a short topic name (max 5 words):\n\n"""${content}"""`;
          const result = await model.generateContent([topicPrompt]);
          const topicText = await result.response.text();
          topicName = topicText.trim().replace(/^"|"$/g, '') || topicName;
        } catch (err) {
          console.error("❌ Topic extraction error:", err);
        }
      }

      const strengths = score >= 3 ? [topicName] : [];
      const weaknesses = score < 3 ? [topicName] : [];

      // Step 3: Fetch existing traits
      const { data: existingTraits, error: fetchError } = await supabase
        .from("student_traits")
        .select("strengths, weaknesses")
        .eq("student_id", student_id)
        .single();

      const existingStrengths = existingTraits?.strengths || [];
      const existingWeaknesses = existingTraits?.weaknesses || [];

      // Merge without duplicates
      const mergedStrengths = Array.from(new Set([...existingStrengths, ...strengths]));
      const mergedWeaknesses = Array.from(new Set([...existingWeaknesses, ...weaknesses]));

      // Step 4: Save to Supabase
      const { error: traitError } = await supabase
        .from("student_traits")
        .upsert(
          [
            {
              student_id,
              strengths: mergedStrengths,
              weaknesses: mergedWeaknesses,
            }
          ],
          { onConflict: ['student_id'] }
        );

      if (traitError) {
        console.error("❌ Trait save error:", traitError.message || traitError);
        setSaveStatus("error");
        setSaveMessage(`❌ Save failed: ${traitError.message || "Unknown error"}`);
      } else {
        setSaveStatus("success");
        setSaveMessage("✅ Your strengths and weaknesses have been saved!");
        localStorage.removeItem("eduassist_quiz_content");
      }

      // Auto-dismiss message
      setTimeout(() => {
        setSaveMessage(null);
        setSaveStatus(null);
      }, 5000);
    };

    saveTraits();
  }, [email, questions, userAnswers]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gradient-to-b from-blue-100 to-white text-gray-900 p-6"
    >
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-4 text-blue-700 flex items-center justify-center gap-2">
          <Trophy size={32} /> <span className="text-blue-400">Quiz Results</span>
        </h1>
        <p className="text-xl">
          🎯 You scored <span className="text-green-500 font-bold">{score} / {questions.length}</span>
        </p>
      </div>

      {saveMessage && (
        <div
          className={`max-w-2xl mx-auto mb-6 px-4 py-3 rounded-lg text-center font-medium ${
            saveStatus === "success"
              ? "bg-green-100 text-green-700 border border-green-300"
              : "bg-red-100 text-red-700 border border-red-300"
          }`}
        >
          {saveMessage}
        </div>
      )}

      <div className="space-y-4 max-w-3xl mx-auto">
        {questions.map((q, i) => (
          <motion.div
            key={i}
            className="bg-white/70 backdrop-blur-md border border-blue-200 p-4 rounded-xl shadow"
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <p className="font-semibold">{i + 1}. {q.question}</p>
            <p className="text-sm mt-1">
              ✅ Correct Answer: <span className="text-green-600 font-semibold">{q.answer}</span><br />
              🧍 Your Answer: <span className={userAnswers[i] === q.answer ? 'text-green-600' : 'text-red-500 font-semibold'}>
                {userAnswers[i] || 'Not answered'}
              </span>
            </p>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-center mt-10">
        <button
          onClick={() => navigate('/quiz-generate')}
          className="bg-blue-500 px-6 py-2 rounded-xl hover:bg-blue-600 text-white font-semibold flex items-center gap-2"
        >
          <RotateCcw size={20} /> Try Again
        </button>
      </div>
    </motion.div>
  );
};

export default QuizResult;
