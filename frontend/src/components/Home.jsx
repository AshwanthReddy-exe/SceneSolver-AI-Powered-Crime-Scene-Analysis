import React from 'react';

const Home = () => {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white p-4">
      <h1 className="text-6xl md:text-8xl font-extrabold mb-8" style={{
        backgroundImage: 'linear-gradient(to right, #8A2BE2, #FF7F50)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}>
        CLICK.<span className="text-orange-500"> SOLVE</span>
      </h1>
      <h2 className="text-3xl md:text-4xl font-semibold mb-6 text-center">
        Welcome to investigative world
      </h2>
      <p className="text-lg md:text-xl text-gray-300 text-center max-w-2xl">
        Here is your investigator - An AI powered intelligence system.
        The platform processes images to identify crime types, extract key visual
        evidence, and generate detailed crime scene summaries.
      </p>
    </div>
  );
};

export default Home;
