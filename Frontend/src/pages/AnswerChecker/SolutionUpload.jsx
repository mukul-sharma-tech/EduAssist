import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FileUp, LoaderCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const SolutionUpload = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleUpload = async () => {
    if (!pdfFile) return;

    const formData = new FormData();
    formData.append('pdf', pdfFile);

    setIsLoading(true);
    try {
      const res = await axios.post('https://eduassist-nak8.onrender.com/extract-text-pdf', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const fullText = res.data.text;
      navigate('/evaluate-answer', { state: { extractedText: fullText } });
    } catch (err) {
      console.error('PDF Parse Error:', err);
      alert('❌ Failed to extract text from PDF.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-200 to-blue-300 text-gray-900 pt-20 pb-24 px-6 flex flex-col items-center justify-center"
    >
      <div className="bg-white/70 backdrop-blur-md border border-blue-200 shadow-2xl p-8 rounded-2xl text-center max-w-md w-full">
        <h1 className="text-3xl sm:text-4xl font-bold mb-4 flex items-center justify-center gap-2 text-blue-600">
          <FileUp /> Upload Answer PDF
        </h1>
        <p className="text-gray-700 mb-6 text-sm">
          AI will read and evaluate student answers from the uploaded PDF.
        </p>

        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setPdfFile(e.target.files[0])}
          className="mb-4 text-sm file:bg-blue-500 file:hover:bg-blue-600 file:text-white file:rounded-lg file:px-4 file:py-2 file:border-none"
        />

        <button
          onClick={handleUpload}
          className="bg-green-500 hover:bg-green-600 px-6 py-2 rounded-lg flex items-center justify-center gap-2 text-white w-full disabled:opacity-50"
          disabled={isLoading}
        >
          {isLoading ? <LoaderCircle className="animate-spin" /> : 'Evaluate Answers'}
        </button>
      </div>
    </motion.div>
  );
};

export default SolutionUpload;
