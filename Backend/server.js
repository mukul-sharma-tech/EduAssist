const express = require('express');
const multer = require('multer');
const pdfParse = require('pdf-parse');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const dotenv = require('dotenv');
const connectDB = require('./database/config');
const { default: userRouter } = require('./router/userRouter');
const { default: studyRouter } = require('./router/studyRouter');

// const { ClerkExpressRequireAuth } = require("@clerk/express");
// import { ClerkExpressWithAuth } from "@clerk/express";
// import { ClerkExpressWithAuth } from "@clerk/express";
dotenv.config();
// const { requireAuth, ClerkExpressWithAuth } = require("@clerk/express");
const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.use(cors({
  origin: 'http://localhost:5173', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());

app.post('/extract-pdf', upload.single('pdf'), async (req, res) => {
  try {
    const data = await pdfParse(req.file.buffer);
    const rawText = data.text;

    // Return first 5 non-empty lines
    const questions = rawText
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 0)
      .slice(0, 5);

    res.json({ questions });
  } catch (err) {
    console.error('Error parsing PDF:', err);
    res.status(500).json({ error: 'Failed to parse PDF.' });
  }
});

app.post('/extract-text-pdf', upload.single('pdf'), async (req, res) => {
  try {
    const data = await pdfParse(req.file.buffer);
    const rawText = data.text;

    res.json({ text: rawText });
  } catch (err) {
    console.error('Error parsing PDF:', err);
    res.status(500).json({ error: 'Failed to parse PDF.' });
  }
});
app.post("/generate-plan", async (req, res) => {
  const { subject, syllabus, deadline, startDate } = req.body;

  const prompt = `
You are a helpful AI that creates daily study plans.
The subject is: ${subject}
The syllabus includes: ${syllabus}
The study plan should start from: ${startDate}
The exam deadline is: ${deadline}

Generate a day-wise study schedule between ${startDate} and ${deadline}, dividing the syllabus smartly. Mention each day with its date and assigned topics. Be specific and concise.
  `;

  try {
    const result = await model.generateContent(prompt);
    const output = result.response.text();

    res.json({ plan: output });
  } catch (err) {
    console.error("Error generating study plan:", err);
    res.status(500).json({ error: "Failed to generate study plan" });
  }
});



const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.post("/chat", async (req, res) => {
  const { message, context = [] } = req.body;

  // Handle "open ..." command
  if (message.toLowerCase().startsWith("open ")) {
    const query = message.toLowerCase().replace("open ", "").trim();
    const domain = query.replace(/\s+/g, "");
    const directUrl = `https://${domain}.com`;
    const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;

    return res.json({
      response: `Opening ${query}...`,
      openUrl: directUrl,
      fallbackUrl: searchUrl,
    });
  }

  try {
    // Format chat history to Gemini format
    const formattedHistory = context.map(msg => ({
      role: msg.role === 'model' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    const chat = model.startChat({ history: formattedHistory });

    const result = await chat.sendMessage(message);
    const responseText = result.response.text();

    res.json({ response: responseText });
  } catch (error) {
    console.error("Gemini error:", error);
    res.status(500).json({ error: "Something went wrong!" });
  }
});


//adding the routes for the smart tracker 
console.log("CLERK_SECRET_KEY:", process.env.CLERK_SECRET_KEY);


app.use('/api/users',userRouter);
app.use('/api/subjects',studyRouter);

// database connection by rishabh
connectDB()
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


