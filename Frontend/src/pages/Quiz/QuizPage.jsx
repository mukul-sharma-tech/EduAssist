// import React, { useEffect, useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { GoogleGenerativeAI } from '@google/generative-ai';

// const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY; // Replace in production with secure env

// const QuizPage = () => {
//   const { state } = useLocation();
//   const navigate = useNavigate();
//   const content = state?.content || '';
//   const [questions, setQuestions] = useState([]);
//   const [userAnswers, setUserAnswers] = useState({});
//   const [loading, setLoading] = useState(true);

//   const prompt = `Generate a multiple-choice quiz with 5 questions from the following content:\n\n"""${content}"""\n\nFor each question, include:\n- A clear question\n- Four options\n- The correct answer\nFormat as JSON:\n[\n { "question": "...", "options": ["A", "B", "C", "D"], "answer": "A" }, ...\n]`;

//   useEffect(() => {
//     const generateQuiz = async () => {
//       try {
//         const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
//         const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
//         const result = await model.generateContent([prompt]);
//         const text = await result.response.text();

//         const jsonText = text.match(/\[.*\]/s)?.[0]; // Extract JSON array
//         const quiz = JSON.parse(jsonText);
//         setQuestions(quiz);
//       } catch (err) {
//         console.error("Quiz Error:", err);
//         alert("❌ Failed to generate quiz.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     generateQuiz();
//   }, [content]);

//   const handleSubmit = () => {
//     navigate('/quiz-result', {
//       state: { questions, userAnswers },
//     });
//   };

//   if (loading) return <p className="text-white text-center mt-10">Generating quiz...</p>;

//   return (
//     <div className="min-h-screen bg-gray-950 text-white p-6">
//       <h1 className="text-2xl font-bold mb-6 text-center">📝 Quiz</h1>
//       {questions.map((q, index) => (
//         <div key={index} className="mb-6">
//           <p className="mb-2 font-semibold">{index + 1}. {q.question}</p>
//           {q.options.map((opt, i) => (
//             <label key={i} className="block mb-1">
//               <input
//                 type="radio"
//                 name={`q${index}`}
//                 value={opt}
//                 onChange={() =>
//                   setUserAnswers((prev) => ({ ...prev, [index]: opt }))
//                 }
//                 className="mr-2"
//               />
//               {opt}
//             </label>
//           ))}
//         </div>
//       ))}
//       <button
//         onClick={handleSubmit}
//         className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded"
//       >
//         ✅ Submit Quiz
//       </button>
//     </div>
//   );
// };

// export default QuizPage;



import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { motion } from 'framer-motion';
import { Brain, CheckCircle } from 'lucide-react';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const QuizPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const content = state?.content || '';
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState({});
  const [loading, setLoading] = useState(true);

  const prompt = `Generate a multiple-choice quiz with 5 questions from the following content:\n\n"""${content}"""\n\nFor each question, include:\n- A clear question\n- Four options\n- The correct answer\nFormat as JSON:\n[\n { "question": "...", "options": ["A", "B", "C", "D"], "answer": "A" }, ...\n]`;

  useEffect(() => {
    const generateQuiz = async () => {
      try {
        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent([prompt]);
        const text = await result.response.text();
        const jsonText = text.match(/\[.*\]/s)?.[0];
        const quiz = JSON.parse(jsonText);
        setQuestions(quiz);
      } catch (err) {
        console.error("Quiz Error:", err);
        alert("❌ Failed to generate quiz.");
      } finally {
        setLoading(false);
      }
    };

    generateQuiz();
  }, [content]);

  const handleSubmit = () => {
    navigate('/quiz-result', {
      state: { questions, userAnswers },
    });
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-purple-900 to-blue-900 text-white pt-20 pb-24 px-6"
      >
        <div className="text-center animate-pulse">
          <p className="text-2xl font-bold">⚙️ Generating quiz...</p>
          <p className="mt-2 text-sm text-gray-300">Please wait while your quiz is being prepared.</p>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="min-h-screen bg-gradient-to-tr from-purple-900 to-blue-900 text-white pt-20 pb-24 px-6"
    >
      <h1 className="text-3xl font-bold mb-6 text-center flex items-center justify-center gap-2">
        <Brain size={28} /> AI Generated Quiz
      </h1>

      <div className="max-w-3xl mx-auto space-y-6">
        {questions.map((q, index) => (
          <motion.div
            key={index}
            className="p-5 bg-white/10 rounded-lg shadow-md"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <p className="font-semibold mb-3">{index + 1}. {q.question}</p>
            {q.options.map((opt, i) => (
              <label key={i} className="block mb-2 cursor-pointer">
                <input
                  type="radio"
                  name={`q${index}`}
                  value={opt}
                  onChange={() => setUserAnswers((prev) => ({ ...prev, [index]: opt }))}
                  className="mr-2"
                />
                {opt}
              </label>
            ))}
          </motion.div>
        ))}
      </div>

      <div className="text-center mt-10">
        <button
          onClick={handleSubmit}
          className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg flex items-center gap-2 mx-auto"
        >
          <CheckCircle size={20} /> Submit Quiz
        </button>
      </div>
    </motion.div>
  );
};

export default QuizPage;
