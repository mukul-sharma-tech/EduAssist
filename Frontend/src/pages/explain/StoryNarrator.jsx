// import { useEffect, useState } from 'react';
// import { useLocation, useNavigate } from 'react-router-dom';
// import { Canvas } from '@react-three/fiber';
// import { OrbitControls } from '@react-three/drei';
// import { Avatar } from '../../components/Avatar';

// export default function StoryNarrator() {
//   const location = useLocation();
//   const navigate = useNavigate();
//   const { story = '', topic = '' } = location.state || {};

//   const [isSpeaking, setIsSpeaking] = useState(false);
//   const [animation, setAnimation] = useState('Idle');
//   const [language, setLanguage] = useState('english');

//   useEffect(() => {
//     if (!story) return;

//     const synth = window.speechSynthesis;
//     const utterance = new SpeechSynthesisUtterance(story);

//     if (language === 'hindi') {
//       utterance.lang = 'hi-IN';
//     } else if (language === 'hinglish') {
//       utterance.lang = 'hi-IN'; // Hinglish best with Hindi voice
//       utterance.text = story.replace(/[.,]/g, '').split(' ').map(w => /[a-zA-Z]/.test(w) ? w : '').join(' ');
//     } else {
//       utterance.lang = 'en-US';
//     }

//     utterance.onstart = () => {
//       setIsSpeaking(true);
//       setAnimation('Talking');
//     };
//     utterance.onend = () => {
//       setIsSpeaking(false);
//       setAnimation('Idle');
//     };

//     synth.cancel(); // stop previous
//     synth.speak(utterance);

//     return () => synth.cancel();
//   }, [story, language]);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-indigo-900 to-indigo-700 text-white flex flex-col items-center justify-center py-10">
//       <div className="mb-4 text-center">
//         <h1 className="text-3xl font-bold">{topic || 'Story Presentation'}</h1>
//         <p className="text-blue-300 mt-2">Narrated by your AI Avatar</p>

//         <div className="mt-4">
//           <label className="text-sm mr-2">Language:</label>
//           <select
//             className="text-black rounded px-2 py-1"
//             value={language}
//             onChange={(e) => setLanguage(e.target.value)}
//           >
//             <option value="english">English</option>
//             <option value="hindi">Hindi</option>
//             <option value="hinglish">Hinglish</option>
//           </select>
//         </div>
//       </div>

//       <div className="w-full max-w-5xl h-[60vh] bg-indigo-800 rounded-lg shadow-xl overflow-hidden">
//         <Canvas camera={{ position: [0, 1.5, 3], fov: 50 }}>
//           <ambientLight intensity={0.5} />
//           <directionalLight position={[2, 5, 2]} intensity={1} />
//           <Avatar isSpeaking={isSpeaking} animationName={animation} position={[0, -7, 0]} scale={4.5} />
//           <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 2.2} minPolarAngle={Math.PI / 2.5} />
//         </Canvas>
//       </div>

//       <div className="mt-6 text-center max-w-4xl px-6 text-white/90">
//         <h2 className="text-xl font-semibold mb-2">Story:</h2>
//         <p className="whitespace-pre-wrap leading-relaxed">{story}</p>
//       </div>

//       <button
//         onClick={() => navigate('/')}
//         className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full"
//       >
//         Go Back
//       </button>
//     </div>
//   );
// }


import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Avatar } from '../../components/Avatar';

export default function StoryNarrator() {
  const location = useLocation();
  const navigate = useNavigate();
  const { story = '', topic = '', language = 'english' } = location.state || {};

  const [isSpeaking, setIsSpeaking] = useState(false);
  const [animation, setAnimation] = useState('Idle');

  useEffect(() => {
    if (!story) return;

    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(story);

    if (language === 'hindi') {
      utterance.lang = 'hi-IN';
    } else if (language === 'hinglish') {
      utterance.lang = 'hi-IN';
      utterance.text = story.replace(/[.,]/g, '').split(' ').map(w => /[a-zA-Z]/.test(w) ? w : '').join(' ');
    } else {
      utterance.lang = 'en-US';
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      setAnimation('Talking');
    };
    utterance.onend = () => {
      setIsSpeaking(false);
      setAnimation('Idle');
    };

    synth.cancel();
    synth.speak(utterance);

    return () => synth.cancel();
  }, [story, language]);

  return (
    <div className="min-h-screen mt-16 bg-gradient-to-br from-indigo-900 to-indigo-700 text-white flex flex-col items-center justify-center py-10">
      <div className="mb-4 text-center">
        <h1 className="text-3xl font-bold">{topic || 'Story Presentation'}</h1>
        <p className="text-blue-300 mt-2">Narrated by your AI Avatar</p>
        <p className="mt-2 text-sm italic text-blue-200">Language: {language}</p>
      </div>

      <div className="w-full max-w-5xl h-[60vh] bg-indigo-800 rounded-lg shadow-xl overflow-hidden">
        <Canvas camera={{ position: [0, 1.5, 3], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[2, 5, 2]} intensity={1} />
          <Avatar isSpeaking={isSpeaking} animationName={animation} position={[0, -7, 0]} scale={4.5} />
          <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 2.2} minPolarAngle={Math.PI / 2.5} />
        </Canvas>
      </div>

      <div className="mt-6 text-center max-w-4xl px-6 text-white/90">
        <h2 className="text-xl font-semibold mb-2">Story:</h2>
        <p className="whitespace-pre-wrap leading-relaxed">{story}</p>
      </div>

      <button
        onClick={() => navigate('/choose-topic')}
        className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-full"
      >
        Go Back
      </button>
    </div>
  );
}
