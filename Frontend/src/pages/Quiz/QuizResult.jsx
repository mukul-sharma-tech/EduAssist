import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const QuizResult = () => {
  const { state } = useLocation();
  const { questions = [], userAnswers = {} } = state || {};
  const navigate = useNavigate();

  const score = questions.reduce((total, q, i) => {
    return total + (userAnswers[i] === q.answer ? 1 : 0);
  }, 0);

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <h1 className="text-3xl font-bold text-center mb-6">🎉 Quiz Results</h1>
      <p className="text-center text-lg mb-4">You scored {score} / {questions.length}</p>

      {questions.map((q, i) => (
        <div key={i} className="mb-4 bg-white/10 p-4 rounded">
          <p className="font-semibold">{i + 1}. {q.question}</p>
          <p className="text-sm mt-1">
            ✅ Correct Answer: <span className="text-green-400">{q.answer}</span><br />
            🧍 Your Answer: <span className={userAnswers[i] === q.answer ? 'text-green-400' : 'text-red-400'}>{userAnswers[i] || 'Not answered'}</span>
          </p>
        </div>
      ))}

      <div className="flex justify-center mt-6">
        <button
          onClick={() => navigate('/')}
          className="bg-blue-600 px-6 py-2 rounded hover:bg-blue-700"
        >
          🔁 Try Again
        </button>
      </div>
    </div>
  );
};

export default QuizResult;
