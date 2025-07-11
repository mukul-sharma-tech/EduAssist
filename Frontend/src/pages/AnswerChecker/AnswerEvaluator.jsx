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
      <div className="min-h-screen bg-blue-100 flex items-center justify-center px-4 text-red-600">
        <p className="text-lg font-semibold">
          ⚠️ No answer data found. Please upload a PDF again.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-200 to-blue-300 text-gray-900 pt-20 pb-24 px-6"
    >
      <div className="text-center mb-6">
        <h1 className="text-3xl sm:text-4xl font-bold flex justify-center items-center gap-2 text-blue-600">
          <ScrollText /> Answer Evaluation Report
        </h1>
        <p className="text-gray-700 mt-2 max-w-2xl mx-auto text-sm">
          Evaluated using AI with detailed feedback, strengths, weaknesses, and per-question scoring.
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center text-lg mt-10 text-blue-600 animate-pulse">
          🧐 Analyzing answers...
        </div>
      ) : (
        <>
          <div className="bg-white/80 backdrop-blur border border-blue-200 p-6 rounded-lg shadow-md text-sm whitespace-pre-wrap max-h-[70vh] overflow-y-auto font-mono text-gray-800 mb-6">
            {evaluation}
          </div>

          <div className="flex justify-center">
            <button
              onClick={downloadAsPDF}
              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold px-6 py-2 rounded-lg flex items-center gap-2"
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
