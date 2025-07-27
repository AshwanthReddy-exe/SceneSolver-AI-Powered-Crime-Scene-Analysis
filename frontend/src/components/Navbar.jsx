import React from 'react';
import { Link } from 'react-router-dom'; 

const Navbar = ({ scrollToHome, scrollToAbout, scrollToFeatures, scrollToGetStarted, scrollToTeam, handleLogout }) => {
  return (
    <nav className="fixed top-0 left-0 w-full bg-black bg-opacity-90 z-50 py-4 px-6 flex justify-between items-center shadow-lg rounded-b-xl">
      <div
        className="font-extrabold"
        style={{
          fontSize: '50px',
          fontFamily: 'cursive',
        }}
      >
        <span className="text-white">Scene</span>
        <span style={{ color: '#a418d1' }}>Solver</span>
      </div>

      {/* Navigation Links */}
      <div className="flex space-x-6 md:space-x-8">
        <button onClick={scrollToHome} className="text-white hover:text-orange-400 font-medium text-lg transition-colors duration-200 focus:outline-none">Home</button>
        <button onClick={scrollToAbout} className="text-white hover:text-orange-400 font-medium text-lg transition-colors duration-200 focus:outline-none">About</button>
        <button onClick={scrollToFeatures} className="text-white hover:text-orange-400 font-medium text-lg transition-colors duration-200 focus:outline-none">Features</button>
        <button onClick={scrollToGetStarted} className="text-white hover:text-orange-400 font-medium text-lg transition-colors duration-200 focus:outline-none">Get Started</button>
        <button onClick={scrollToTeam} className="text-white hover:text-orange-400 font-medium text-lg transition-colors duration-200 focus:outline-none">Team</button>
        
        {localStorage.getItem('token') ? (
          <button
            onClick={handleLogout}
            className="
              bg-orange-600 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded-full
              transition-all duration-300 ease-in-out shadow-md hover:shadow-lg
              transform hover:scale-105 focus:outline-none
            "
          >
            Logout
          </button>
        ) : (
          <Link to="/login" className="text-white hover:text-green-400 font-medium text-lg transition-colors duration-200 focus:outline-none flex items-center">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
