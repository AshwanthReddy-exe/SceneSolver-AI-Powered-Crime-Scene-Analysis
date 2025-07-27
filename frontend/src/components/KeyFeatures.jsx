import React, { useState } from 'react';

const FeatureBox = ({ title, description }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`
        bg-gray-800 rounded-xl p-6 flex flex-col items-center justify-center
        w-full md:w-80 h-64 text-center cursor-pointer
        transition-all duration-300 ease-in-out
        ${isHovered ? 'bg-orange-500 scale-105 shadow-lg' : 'bg-gray-800 scale-100'}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <h3 className="text-2xl md:text-3xl font-semibold mb-4 text-white"> {/* Explicitly set text to white */}
        {title}
      </h3>
      <p className="text-base text-white"> {/* Changed text-gray-300 to text-white */}
        {description}
      </p>
    </div>
  );
};

const KeyFeatures = () => {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center py-16 px-4">
      {/* KEY FEATURES heading with gradient text */}
      <h1 className="text-6xl md:text-7xl font-extrabold mb-4" style={{
        backgroundImage: 'linear-gradient(to right, #FF7F50, #8A2BE2)', // Orange to Purple gradient
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}>
        KEY FEATURES
      </h1>

      <p className="text-xl md:text-2xl text-white font-medium mb-12 text-center">
        AI-Powered Crime Scene Analysis
      </p>

      {/* Feature Boxes Container */}
      <div className="flex flex-col md:flex-row gap-8 justify-center items-center w-full max-w-6xl">
        <FeatureBox
          title="Crime Classification"
          description="Detects the type of crime from visual input."
        />
        <FeatureBox
          title="Evidence Detection"
          description="Identifies key objects like weapons, stains, etc."
        />
        <FeatureBox
          title="Summary Generation"
          description="Describes what happened in the scene."
        />
      </div>
    </div>
  );
};

export default KeyFeatures;
