// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';

// const AssignmentUpload = () => {
//   const [pdfFile, setPdfFile] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleUpload = async () => {
//     if (!pdfFile) return;

//     const formData = new FormData();
//     formData.append('pdf', pdfFile);

//     setIsLoading(true);
//     try {
//       const res = await axios.post('http://localhost:5000/extract-text-pdf', formData, {
//         headers: { 'Content-Type': 'multipart/form-data' },
//       });

//       const fullText = res.data.text;

//       // Optional: Clean up first 5 non-empty lines only
//       const cleanedText = fullText
//         .split('\n')
//         .map(line => line.trim())
//         .filter(line => line.length > 0)
//         .slice(0, 5)
//         .join('\n');

//       // Send either fullText or cleanedText depending on your needs
//       navigate('/solve-assignment', { state: { extractedText: fullText } });
//     } catch (err) {
//       console.error('PDF Parse Error:', err);
//       alert('Failed to extract text from PDF.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-900 text-white p-6 flex flex-col items-center justify-center">
//       <h1 className="text-3xl font-semibold mb-6">Upload Assignment PDF</h1>
//       <input
//         type="file"
//         accept="application/pdf"
//         onChange={(e) => setPdfFile(e.target.files[0])}
//         className="mb-4 text-sm file:bg-blue-600 file:text-white file:rounded file:px-3 file:py-1"
//       />
//       <button
//         onClick={handleUpload}
//         className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded disabled:opacity-50"
//         disabled={isLoading}
//       >
//         {isLoading ? 'Extracting...' : 'Extract Text'}
//       </button>
//     </div>
//   );
// };

// export default AssignmentUpload;



import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AssignmentUpload = () => {
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

      navigate('/solve-assignment', { state: { extractedText: fullText } });
    } catch (err) {
      console.error('PDF Parse Error:', err);
      alert('❌ Failed to extract text from PDF.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex items-center justify-center px-6">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-lg">
        <h1 className="text-4xl font-extrabold text-center mb-6 text-blue-400">
          📘 Assignment PDF Uploader
        </h1>
        <p className="text-center text-sm text-gray-300 mb-6">
          Upload your assignment as a PDF file and get detailed solutions instantly using AI.
        </p>

        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setPdfFile(e.target.files[0])}
          className="block w-full text-sm mb-5 text-white file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-blue-600 file:hover:bg-blue-700"
        />

        <button
          onClick={handleUpload}
          disabled={isLoading}
          className="w-full bg-blue-500 hover:bg-blue-600 transition duration-200 text-white py-2 px-4 rounded-lg font-semibold disabled:opacity-60"
        >
          {isLoading ? '⏳ Extracting Text...' : '🚀 Solve Assignment'}
        </button>
      </div>
    </div>
  );
};

export default AssignmentUpload;
