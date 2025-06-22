// import React, { useEffect, useState } from 'react';
// import { useLocation } from 'react-router-dom';
// import { GoogleGenerativeAI } from '@google/generative-ai';
// import jsPDF from 'jspdf';

// const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY; // Replace in production with secure env

// const AssignmentSolver = () => {
//   const location = useLocation();
//   const extractedText = location?.state?.extractedText || '';
//   const [solution, setSolution] = useState('');
//   const [isLoading, setIsLoading] = useState(false);

//   const prompt = `Analyze the following assignment and provide comprehensive, step-by-step solutions:

// """
// ${extractedText}
// """

// Instructions:
// 1. Clearly identify each question
// 2. Solve each step-by-step
// 3. Use professional academic formatting
// 4. Include necessary explanations
// 5. Maintain a helpful and professional tone`;

//   useEffect(() => {
//     const generateSolution = async () => {
//       if (!extractedText) return;

//       try {
//         setIsLoading(true);
//         const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
//         const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

//         const result = await model.generateContent([prompt]); // 👈 pass as array
//         const text = await result.response.text();
//         setSolution(text);
//       } catch (err) {
//         console.error('Gemini Error:', err);
//         setSolution('❌ Failed to generate solution.');
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     generateSolution();
//   }, [extractedText]);

//   const downloadAsPDF = () => {
//     const doc = new jsPDF();
//     const lines = doc.splitTextToSize(solution, 180);
//     let y = 10;

//     lines.forEach((line) => {
//       if (y > 280) {
//         doc.addPage();
//         y = 10;
//       }
//       doc.text(line, 10, y);
//       y += 7;
//     });

//     doc.save('assignment-solution.pdf');
//   };

//   if (!extractedText) {
//     return (
//       <div className="min-h-screen bg-gray-900 text-white p-8 flex items-center justify-center">
//         <p className="text-xl text-red-400">⚠️ No assignment data found. Please upload again.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-950 text-white p-6">
//       <h1 className="text-2xl font-bold mb-6 text-center">📘 Assignment Solution</h1>

//       {isLoading ? (
//         <p className="text-center">✍️ Solving your assignment...</p>
//       ) : (
//         <>
//           <div className="bg-white/10 p-4 rounded-lg max-h-[70vh] overflow-y-auto overflow-x-auto mb-4 text-sm whitespace-pre-wrap">
//             {solution}
//           </div>

//           <div className="flex justify-center">
//             <button
//               onClick={downloadAsPDF}
//               className="bg-green-600 hover:bg-green-700 px-6 py-2 rounded text-white"
//             >
//               📥 Download as PDF
//             </button>
//           </div>
//         </>
//       )}
//     </div>
//   );
// };

// export default AssignmentSolver;


import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { GoogleGenerativeAI } from '@google/generative-ai';
import jsPDF from 'jspdf';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY; // Replace in production with secure env

const AssignmentSolver = () => {
  const location = useLocation();
  const extractedText = location?.state?.extractedText || '';
  const [solution, setSolution] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const prompt = `Analyze the following assignment and provide comprehensive, step-by-step solutions:

"""
${extractedText}
"""

Instructions:
1. Clearly identify each question
2. Solve each step-by-step
3. Use professional academic formatting
4. Include necessary explanations
5. Maintain a helpful and professional tone`;

  useEffect(() => {
    const generateSolution = async () => {
      if (!extractedText) return;
      setIsLoading(true);
      try {
        const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

        const result = await model.generateContent([prompt]);
        const text = await result.response.text();
        setSolution(text);
      } catch (err) {
        console.error('Gemini Error:', err);
        setSolution('❌ Failed to generate solution.');
      } finally {
        setIsLoading(false);
      }
    };

    generateSolution();
  }, [extractedText]);

  const downloadAsPDF = () => {
    const doc = new jsPDF();
    const lines = doc.splitTextToSize(solution, 180);
    let y = 10;

    lines.forEach((line) => {
      if (y > 280) {
        doc.addPage();
        y = 10;
      }
      doc.text(line, 10, y);
      y += 7;
    });

    doc.save('assignment-solution.pdf');
  };

  if (!extractedText) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center px-4">
        <p className="text-lg font-medium text-red-500">
          ⚠️ No assignment data found. Please upload a PDF again.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white p-6 flex flex-col">
      <h1 className="text-4xl font-extrabold text-center mb-4 text-blue-400 drop-shadow">
        ✅ AI-Powered Assignment Solution
      </h1>
      <p className="text-center text-gray-300 mb-6 max-w-2xl mx-auto">
        This solution was generated with detailed academic formatting and explanations.
      </p>

      {isLoading ? (
        <div className="flex justify-center items-center text-lg mt-10 text-blue-300 animate-pulse">
          ✍️ Solving your assignment...
        </div>
      ) : (
        <>
          <div className="bg-gray-800/60 p-6 rounded-xl shadow-lg text-sm whitespace-pre-wrap max-h-[70vh] overflow-y-auto font-mono border border-gray-700 mb-6">
            {solution}
          </div>

          <div className="flex justify-center">
            <button
              onClick={downloadAsPDF}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold px-6 py-2 rounded-lg transition duration-200"
            >
              📥 Download as PDF
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default AssignmentSolver;
