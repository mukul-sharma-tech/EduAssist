import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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
      const res = await axios.post('http://localhost:5000/extract-text-pdf', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const fullText = res.data.text;
      navigate('/evaluate-answer', { state: { extractedText: fullText } });
    } catch (err) {
      console.error('PDF Parse Error:', err);
      alert('Failed to extract text from PDF.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold mb-4 text-blue-400">📤 Upload Answer PDF</h1>
      <p className="mb-4 text-gray-300">AI will read and evaluate student answers from the uploaded PDF.</p>
      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setPdfFile(e.target.files[0])}
        className="mb-4 text-sm file:bg-blue-600 file:text-white file:rounded file:px-3 file:py-1"
      />
      <button
        onClick={handleUpload}
        className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded text-white disabled:opacity-50"
        disabled={isLoading}
      >
        {isLoading ? 'Extracting...' : 'Evaluate Answers'}
      </button>
    </div>
  );
};

export default SolutionUpload;