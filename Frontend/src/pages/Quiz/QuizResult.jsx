// import React from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';

// const QuizResult = () => {
//   const { state } = useLocation();
//   const { questions = [], userAnswers = {} } = state || {};
//   const navigate = useNavigate();

//   const score = questions.reduce((total, q, i) => {
//     return total + (userAnswers[i] === q.answer ? 1 : 0);
//   }, 0);

//   return (
//     <div className="min-h-screen bg-gray-950 text-white p-6">
//       <h1 className="text-3xl font-bold text-center mb-6">🎉 Quiz Results</h1>
//       <p className="text-center text-lg mb-4">You scored {score} / {questions.length}</p>

//       {questions.map((q, i) => (
//         <div key={i} className="mb-4 bg-white/10 p-4 rounded">
//           <p className="font-semibold">{i + 1}. {q.question}</p>
//           <p className="text-sm mt-1">
//             ✅ Correct Answer: <span className="text-green-400">{q.answer}</span><br />
//             🧍 Your Answer: <span className={userAnswers[i] === q.answer ? 'text-green-400' : 'text-red-400'}>{userAnswers[i] || 'Not answered'}</span>
//           </p>
//         </div>
//       ))}

//       <div className="flex justify-center mt-6">
//         <button
//           onClick={() => navigate('/')}
//           className="bg-blue-600 px-6 py-2 rounded hover:bg-blue-700"
//         >
//           🔁 Try Again
//         </button>
//       </div>
//     </div>
//   );
// };

// export default QuizResult;


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
//       className="min-h-screen bg-gradient-to-tr from-blue-900 to-purple-900 text-white p-6"
//     >
//       <div className="text-center mb-10">
//         <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-2">
//           <Trophy size={32} /> Quiz Results
//         </h1>
//         <p className="text-xl">🎯 You scored <span className="text-green-400 font-bold">{score} / {questions.length}</span></p>
//       </div>

//       <div className="space-y-4 max-w-3xl mx-auto">
//         {questions.map((q, i) => (
//           <motion.div
//             key={i}
//             className="bg-white/10 p-4 rounded shadow"
//             initial={{ opacity: 0, x: 10 }}
//             animate={{ opacity: 1, x: 0 }}
//             transition={{ delay: i * 0.1 }}
//           >
//             <p className="font-semibold">{i + 1}. {q.question}</p>
//             <p className="text-sm mt-1">
//               ✅ Correct Answer: <span className="text-green-400">{q.answer}</span><br />
//               🧍 Your Answer: <span className={userAnswers[i] === q.answer ? 'text-green-400' : 'text-red-400'}>
//                 {userAnswers[i] || 'Not answered'}
//               </span>
//             </p>
//           </motion.div>
//         ))}
//       </div>

//       <div className="flex justify-center mt-10">
//         <button
//           onClick={() => navigate('/quiz-generate')}
//           className="bg-blue-600 px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
//         >
//           <RotateCcw size={20} /> Try Again
//         </button>
//       </div>
//     </motion.div>
//   );
// };

// export default QuizResult;


import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Trophy, RotateCcw } from 'lucide-react';

const QuizResult = () => {
  const { state } = useLocation();
  const { questions = [], userAnswers = {} } = state || {};
  const navigate = useNavigate();

  const score = questions.reduce((total, q, i) => {
    return total + (userAnswers[i] === q.answer ? 1 : 0);
  }, 0);

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
        <p className="text-xl">🎯 You scored <span className="text-green-500 font-bold">{score} / {questions.length}</span></p>
      </div>

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
