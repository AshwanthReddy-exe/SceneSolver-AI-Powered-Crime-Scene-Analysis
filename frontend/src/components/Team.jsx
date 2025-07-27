import React from 'react';
import { FaLinkedin, FaEnvelope, FaGithub } from 'react-icons/fa'; // Importing icons

const teamMembers = [
  { name: "Arlagadda Akshay", linkedin: "https://www.linkedin.com/in/arlagadda-akshay-profile/", mail: "mailto:akshay.arlagadda@example.com", github: "https://github.com/akshay-repo" },
  { name: "Ritesh Kovid", linkedin: "https://www.linkedin.com/in/ritesh-kovid-profile/", mail: "mailto:ritesh.kovid@example.com", github: "https://github.com/ritesh-repo" },
  { name: "Aleti Preetham", linkedin: "https://www.linkedin.com/in/aleti-preetham-profile/", mail: "mailto:aleti.preetham@example.com", github: "https://github.com/preetham-repo" },
  { name: "Badam Varshitha", linkedin: "https://www.linkedin.com/in/badam-varshitha-profile/", mail: "mailto:badam.varshitha@example.com", github: "https://github.com/varshitha-repo" },
  { name: "Batchu Sai Nikhil", linkedin: "https://www.linkedin.com/in/batchu-nikhil-profile/", mail: "mailto:batchu.nikhil@example.com", github: "https://github.com/nikhil-repo" },
  { name: "Joseph", linkedin: "https://www.linkedin.com/in/joseph-profile/", mail: "mailto:joseph@example.com", github: "https://github.com/joseph-repo" },
];

const OurTeam = () => {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center py-16 px-4">
      {/* OUR TEAM heading with gradient text */}
      <h1 className="text-6xl md:text-7xl font-extrabold mb-4" style={{
        backgroundImage: 'linear-gradient(to right, #8A2BE2, #FF7F50)', // Purple to Orange gradient
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}>
        OUR TEAM
      </h1>

      <p className="text-xl md:text-2xl text-white font-medium mb-12 text-center">
        Meet the Investigators Behind SceneSolver
      </p>

      {/* Team Members Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center w-full max-w-6xl">
        {teamMembers.map((member, index) => (
          <div
            key={index}
            className="
              bg-gray-800 rounded-xl p-6 flex flex-col items-center justify-center
              text-white text-center shadow-lg
              w-full max-w-xs h-48
            "
          >
            <h3 className="text-xl md:text-2xl font-semibold mb-4">
              {member.name}
            </h3>
            <div className="flex space-x-4">
              <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-blue-500 transition-colors duration-200">
                <FaLinkedin size={28} />
              </a>
              <a href={member.mail} className="text-gray-400 hover:text-red-500 transition-colors duration-200">
                <FaEnvelope size={28} />
              </a>
              <a href={member.github} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-300 transition-colors duration-200">
                <FaGithub size={28} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OurTeam;
