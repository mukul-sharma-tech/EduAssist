import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer"; // ← Don't forget to import
import About from "./pages/About"; // Import the About page
import EduAI from "./pages/EduAI";
import "./App.css";
import HomePage from "./pages/HomePage";
import AssignmentUpload from "./pages/Assignment/AssignmentUpload";
import AssignmentSolver from "./pages/Assignment/AssignmentSolver";
import SolutionUpload from "./pages/AnswerChecker/SolutionUpload";
import AnswerEvaluator from "./pages/AnswerChecker/AnswerEvaluator";
import QuizUpload from "./pages/Quiz/QuizUpload";
import QuizResult from "./pages/Quiz/QuizResult";
import QuizPage from "./pages/Quiz/QuizPage";
import ChooseTopic from "./pages/explain/ChooseTopic"; // Import the ChooseTopic page
import StoryNarrator from "./pages/explain/StoryNarrator";
import MainVid from "./pages/Video/MainVid";

const App = () => {
  return (
    // <Router>
    //   <Navbar />
    //   <Routes>
    //     <Route path="/" element={<HomePage />} />
    //     <Route path="/about" element={<About />} />
    //     <Route path="/eduai" element={<EduAI />} />
    //     <Route path="/assignment" element={<AssignmentUpload />} />
    //     <Route path="/solve-assignment" element={<AssignmentSolver />} />
    //     <Route path="/AnsCheck" element={<SolutionUpload />} />
    //     <Route path="/evaluate-answer" element={<AnswerEvaluator />} />
    //     <Route path="/quiz-generate" element={<QuizUpload/>} />
    //     <Route path="/quiz" element={< QuizPage/>} />
    //     <Route path="/quiz-result" element={<QuizResult/>} />
    //     <Route path="/choose-topic" element={<ChooseTopic/>} />
    //     <Route path="/story" element={<StoryNarrator/>} />

    //   </Routes>
    //   <Footer />
    // </Router>
    <MainVid />
  );
};

export default App;
