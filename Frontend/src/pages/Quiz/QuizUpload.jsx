import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const QuizUpload = () => {
  const [pdfFile, setPdfFile] = useState(null);
  const [manualText, setManualText] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    setLoading(true);
    try {
      let content = manualText;

      if (pdfFile) {
        const formData = new FormData();
        formData.append('pdf', pdfFile);
        const res = await axios.post('http://localhost:5000/extract-text-pdf', formData);
        content = res.data.text;
      }

      navigate('/quiz', { state: { content } });
    } catch (err) {
      console.error(err);
      alert("❌ Failed to process input");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-4">📄 Quiz Generator</h1>

      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setPdfFile(e.target.files[0])}
        className="mb-4 text-sm file:bg-blue-600 file:text-white file:rounded file:px-3 file:py-1"
      />

      <textarea
        rows="10"
        placeholder="Or paste text here..."
        value={manualText}
        onChange={(e) => setManualText(e.target.value)}
        className="w-full max-w-xl bg-gray-800 text-white p-4 mb-4 rounded"
      />

      <button
        onClick={handleSubmit}
        className="bg-green-600 px-6 py-2 rounded hover:bg-green-700"
        disabled={loading}
      >
        {loading ? 'Generating Quiz...' : 'Generate Quiz'}
      </button>
    </div>
  );
};

export default QuizUpload;
