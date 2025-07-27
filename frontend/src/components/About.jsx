import React from 'react';

const About = () => {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-4">
      {/* ABOUT heading with gradient text */}
      <h1 className="text-6xl md:text-7xl font-extrabold mb-8" style={{
        backgroundImage: 'linear-gradient(to right, #FF7F50, #8A2BE2)', // Orange to Purple gradient
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}>
        ABOUT
      </h1>

      {/* Description paragraph */}
      <p className="text-lg md:text-xl text-gray-300 text-center max-w-4xl leading-relaxed">
        SceneSolver is an AI-powered system that analyzes images or videos to detect and classify criminal
        activities. It extracts key frames, identifies evidence using object detection, and understands scenes using
        models. The system generates crime summaries in natural language to describe what's happening. All
        outputs are visualized and stored.
      </p>
    </div>
  );
};

export default About;
