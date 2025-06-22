import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import jsPDF from 'jspdf'; // 🆕 added

const EduAI = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatBoxRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem('eduai-chat');
    if (saved) setMessages(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('eduai-chat', JSON.stringify(messages));
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    chatBoxRef.current?.scrollTo({
      top: chatBoxRef.current.scrollHeight,
      behavior: 'smooth',
    });
  };

  const formatContext = () =>
    messages.map((msg) => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      content: msg.text,
    }));

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = { sender: 'user', text: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/chat', {
        message: input,
        context: [...formatContext(), { role: 'user', content: input }],
      });

      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: response.data.response },
      ]);
    } catch (error) {
      console.error('Chat Error:', error);
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: '❌ Sorry, I could not process your request.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
    setInput('');
    localStorage.removeItem('eduai-chat');
  };

  const handlePDFUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || file.type !== 'application/pdf') return;

    const formData = new FormData();
    formData.append('pdf', file);

    setIsLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/extract-text-pdf', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const extractedText = res.data.text?.trim();
      if (!extractedText) throw new Error('No text extracted.');

      const userMessage = { sender: 'user', text: extractedText };
      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);

      const response = await axios.post('http://localhost:5000/chat', {
        message: extractedText,
        context: [...formatContext(), { role: 'user', content: extractedText }],
      });

      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: response.data.response },
      ]);
    } catch (error) {
      console.error('PDF Error:', error);
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: '❌ Failed to process the PDF.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // 🆕 Download single message
  const downloadMessagePDF = (text, index) => {
    const doc = new jsPDF();
    doc.text(text, 10, 10);
    doc.save(`response-${index + 1}.pdf`);
  };

  // 🆕 Download full chat
  const downloadFullChat = () => {
    const doc = new jsPDF();
    let y = 10;
    messages.forEach((msg, index) => {
      const sender = msg.sender === 'user' ? 'You' : 'EduAI';
      const lines = doc.splitTextToSize(`${sender}: ${msg.text}`, 180);
      if (y + lines.length * 10 > 280) {
        doc.addPage();
        y = 10;
      }
      doc.text(lines, 10, y);
      y += lines.length * 10;
    });
    doc.save('eduai-full-chat.pdf');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-800 to-blue-900 px-2 py-6 sm:px-4">
      <div className="mt-8 sm:mt-12 max-w-full sm:max-w-2xl mx-auto rounded-2xl bg-white/10 backdrop-blur border border-white/20 shadow-lg p-4 sm:p-6 text-white">
        <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-4">
          Edu<span className="text-yellow-300">AI</span> 🤖
        </h2>

        <div
          ref={chatBoxRef}
          className="bg-white/10 rounded-xl p-3 h-[60vh] overflow-y-auto space-y-2 scroll-smooth text-sm sm:text-base"
        >
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`relative p-2 sm:p-3 rounded-lg max-w-[85%] break-words ${
                msg.sender === 'user'
                  ? 'ml-auto bg-purple-500 text-white'
                  : 'mr-auto bg-yellow-300 text-black'
              }`}
            >
              {msg.text}

              {msg.sender === 'bot' && (
                <button
                  onClick={() => downloadMessagePDF(msg.text, idx)}
                  className="absolute top-1 right-1 text-xs bg-white/50 hover:bg-white/70 text-black rounded px-1"
                  title="Download response as PDF"
                >
                  ⬇️
                </button>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="mr-auto p-2 bg-yellow-300 text-black rounded-lg max-w-[85%] animate-pulse">
              Typing...
            </div>
          )}
        </div>

        <div className="mt-3 space-y-3">
          <div className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              className="flex-1 p-2 sm:p-3 rounded-lg bg-white/10 border border-white/20 placeholder-white/70 text-white focus:outline-none"
              placeholder="Type your message..."
            />
            <button
              onClick={sendMessage}
              disabled={isLoading}
              className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 sm:px-5 sm:py-2 rounded-lg disabled:opacity-50"
            >
              Send
            </button>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-2">
            <input
              type="file"
              accept="application/pdf"
              onChange={handlePDFUpload}
              className="text-white text-xs file:text-xs file:px-3 file:py-1 file:rounded-lg file:bg-white/20 hover:file:bg-white/30"
            />
            <div className="flex gap-2">
              <button
                onClick={clearChat}
                className="bg-red-600 hover:bg-red-700 text-white text-sm px-4 py-1.5 rounded-lg"
              >
                Clear Chat
              </button>
              <button
                onClick={downloadFullChat}
                className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-1.5 rounded-lg"
              >
                Download Full Chat
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EduAI;
