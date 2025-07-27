import React from 'react';
import { useNavigate } from 'react-router-dom'; 
const GetStarted = () => { 
  const navigate = useNavigate(); 

  const handleGetStartedClick = () => {
    navigate('/tool'); 
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-4">
      <h1 className="text-6xl md:text-8xl font-extrabold mb-8" style={{
        backgroundImage: 'linear-gradient(to right, #8A2BE2, #FF7F50)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}>
        SCENESOLVER
      </h1>
      <p className="text-xl md:text-2xl text-white font-medium mb-12 text-center">
        AI-Powered Crime Scene Analysis
      </p>
      <p className="text-lg md:text-xl text-gray-300 text-center max-w-2xl mb-12">
        Detects crime types, extracts evidence, and generates summaries from images.
      </p>

      <button
        onClick={handleGetStartedClick} 
        className="
          bg-purple-700 hover:bg-purple-800 text-white font-bold py-4 px-12 rounded-full
          transition-all duration-300 ease-in-out
          text-lg md:text-xl shadow-lg hover:shadow-xl
          transform hover:scale-105
        "
      >
        Get Started
      </button>
    </div>
  );
};

export default GetStarted;
