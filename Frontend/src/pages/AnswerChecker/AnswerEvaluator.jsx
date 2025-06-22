// import React, { useEffect, useState } from 'react';
// import { useLocation } from 'react-router-dom';
// import { GoogleGenerativeAI } from '@google/generative-ai';
// import jsPDF from 'jspdf';

// const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY; // Replace in production with secure env
// const AnswerEvaluator = () => {
//   const location = useLocation();
//   const extractedText = location?.state?.extractedText || '';
//   const [evaluation, setEvaluation] = useState('');
//   const [isLoading, setIsLoading] = useState(false);

//   const prompt = `
// You are an expert teacher evaluating student answers from a PDF submission. 
// Analyze the following content which contains questions and student answers:

// ${extractedText}

// Provide a detailed evaluation with:
// 1. Overall assessment of answer quality
// 2. Accuracy of each answer (identify questions if possible)
// 3. Key strengths in the responses
// 4. Areas needing improvement
// 5. Specific suggestions for each answer
// 6. Percentage score estimation for each question

// Format your response with clear headings and bullet points.
// `;

//   useEffect(() => {
//     const generateEvaluation = async () => {
//       if (!extractedText) return;
//       setIsLoading(true);
//       try {
//         const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
//         const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
//         const result = await model.generateContent([prompt]);
//         const text = await result.response.text();
//         setEvaluation(text);
//       } catch (err) {
//         console.error('Gemini Error:', err);
//         setEvaluation('❌ Failed to evaluate answers.');
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     generateEvaluation();
//   }, [extractedText]);

//   const downloadAsPDF = () => {
//     const doc = new jsPDF();
//     const lines = doc.splitTextToSize(evaluation, 180);
//     let y = 10;

//     lines.forEach((line) => {
//       if (y > 280) {
//         doc.addPage();
//         y = 10;
//       }
//       doc.text(line, 10, y);
//       y += 7;
//     });

//     doc.save('answer-evaluation.pdf');
//   };

//   if (!extractedText) {
//     return (
//       <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-4">
//         <p className="text-lg font-medium text-red-500">
//           ⚠️ No answer data found. Please upload a PDF again.
//         </p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-6 flex flex-col">
//       <h1 className="text-4xl font-extrabold text-center mb-4 text-yellow-400 drop-shadow">
//         🧠 Answer Evaluation Report
//       </h1>
//       <p className="text-center text-gray-300 mb-6 max-w-2xl mx-auto">
//         Evaluated using AI with detailed feedback, strengths, weaknesses, and per-question scoring.
//       </p>

//       {isLoading ? (
//         <div className="flex justify-center items-center text-lg mt-10 text-yellow-300 animate-pulse">
//           🧐 Analyzing answers...
//         </div>
//       ) : (
//         <>
//           <div className="bg-gray-800/60 p-6 rounded-xl shadow-lg text-sm whitespace-pre-wrap max-h-[70vh] overflow-y-auto font-mono border border-gray-700 mb-6">
//             {evaluation}
//           </div>

//           <div className="flex justify-center">
//             <button
//               onClick={downloadAsPDF}
//               className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-6 py-2 rounded-lg transition duration-200"
//             >
//               📥 Download Evaluation PDF
//             </button>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default AnswerEvaluator;


import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { GoogleGenerativeAI } from '@google/generative-ai';
import jsPDF from 'jspdf';
import { motion } from 'framer-motion';
import { ScrollText, Download } from 'lucide-react';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

const AnswerEvaluator = () => {
  const location = useLocation();
  const extractedText = location?.state?.extractedText || '';
  const [evaluation, setEvaluation] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const prompt = `
You are an expert teacher evaluating student answers from a PDF submission. 
Analyze the following content which contains questions and student answers:

${extractedText}

Provide a detailed evaluation with:
1. Overall assessment of answer quality
2. Accuracy of each answer (identify questions if possible)
3. Key strengths in the responses
4. Areas needing improvement
5. Specific suggestions for each answer
6. Percentage score estimation for each question

Format your response with clear headings and bullet points.
`;

  useEffect(() => {
    if (!extractedText) return;
    const generateEvaluation = async () => {
      setIsLoading(true);
      try {
        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const result = await model.generateContent([prompt]);
        const text = await result.response.text();
        setEvaluation(text);
      } catch (err) {
        console.error('Gemini Error:', err);
        setEvaluation('❌ Failed to evaluate answers.');
      } finally {
        setIsLoading(false);
      }
    };
    generateEvaluation();
  }, [extractedText]);

  const downloadAsPDF = () => {
    const doc = new jsPDF();
    const lines = doc.splitTextToSize(evaluation, 180);
    let y = 10;
    lines.forEach((line) => {
      if (y > 280) {
        doc.addPage();
        y = 10;
      }
      doc.text(line, 10, y);
      y += 7;
    });
    doc.save('answer-evaluation.pdf');
  };

  if (!extractedText) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-4">
        <p className="text-lg font-medium text-red-500">
          ⚠️ No answer data found. Please upload a PDF again.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-black text-white pt-20 pb-24 px-6"
    >
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold flex justify-center items-center gap-2 text-yellow-400 drop-shadow">
          <ScrollText /> Answer Evaluation Report
        </h1>
        <p className="text-gray-300 mt-2 max-w-2xl mx-auto">
          Evaluated using AI with detailed feedback, strengths, weaknesses, and per-question scoring.
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center text-lg mt-10 text-yellow-300 animate-pulse">
          🧐 Analyzing answers...
        </div>
      ) : (
        <>
          <div className="bg-white/10 p-6 rounded-lg shadow-lg text-sm whitespace-pre-wrap max-h-[70vh] overflow-y-auto font-mono border border-gray-700 mb-6">
            {evaluation}
          </div>

          <div className="flex justify-center">
            <button
              onClick={downloadAsPDF}
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold px-6 py-2 rounded-lg flex items-center gap-2"
            >
              <Download size={18} /> Download PDF
            </button>
          </div>
        </>
      )}
    </motion.div>
  );
};

export default AnswerEvaluator;
