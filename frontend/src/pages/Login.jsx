import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { handleError, handleSuccess } from '../utils';

const Login = () => {
  const [loginInfo, setLoginInfo] = useState({
    email: '',
    password: ''
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(name, value);
    const copyLoginInfo = { ...loginInfo };
    copyLoginInfo[name] = value;
    setLoginInfo(copyLoginInfo);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const { email, password } = loginInfo;
    if (!email || !password) {
      return handleError('Email and password are required');
    }
    try {
      const url = `http://localhost:8080/auth/login`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(loginInfo)
      });
      const result = await response.json();
      const { success, message, jwtToken, name, error } = result;
      if (success) {
        handleSuccess(message);
        localStorage.setItem('token', jwtToken);
        localStorage.setItem('loggedInUser', name);
        setTimeout(() => {
          navigate('/dashboard'); // Corrected navigation target to /dashboard
        }, 1000);
      } else if (error) {
        const details = error?.details?.[0]?.message;
        handleError(details || "An error occurred during login.");
      } else if (!success) {
        handleError(message);
      }
      console.log(result);
    } catch (error) {
      handleError(error.message || "Network error or server unreachable.");
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        className="absolute inset-0 w-full h-full object-cover z-0"
        src="/background.mp4" // Assuming background.mp4 is in your public folder
        poster="https://placehold.co/1920x1080/000000/FFFFFF?text=Video+Loading" // Fallback image
      >
        Your browser does not support the video tag.
      </video>

      {/* Overlay to darken the video and make text more readable */}
      <div className="absolute inset-0 bg-black opacity-60 z-10"></div>

      {/* Content Container */}
      <div className="relative bg-gray-800 bg-opacity-90 rounded-xl shadow-lg p-8 md:p-10 w-full max-w-md text-white z-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">Login to SceneSolver</h2>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-lg font-medium mb-2">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full p-3 rounded-md bg-gray-700 border border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={loginInfo.email}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-lg font-medium mb-2">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full p-3 rounded-md bg-gray-700 border border-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={loginInfo.password}
              onChange={handleChange}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-purple-700 hover:bg-purple-800 text-white font-bold py-3 px-4 rounded-full transition-all duration-300 ease-in-out shadow-md hover:shadow-lg transform hover:scale-105"
          >
            Login
          </button>
        </form>
        <ToastContainer/>

        {/* Link to Sign Up page */}
        <p className="mt-6 text-center text-gray-400">
          Don't have an account?{' '}
          <Link to="/signup" className="text-purple-400 hover:text-purple-300 font-medium focus:outline-none ml-1">
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
