import React, { useState } from 'react';

const ScrollingWords = () => {
  const words = ["EXPLOSION", "SHOOTING", "FIGHTING", "SHOPLIFTING", "ROBBERY"];

  return (
    <div className="w-full overflow-hidden whitespace-nowrap py-4 bg-black">
      {/* Container for the scrolling animation */}
      <div className="inline-block animate-scroll-rtl" style={{ animationDuration: '90s' }}> {/* Adjust duration as needed */}
        {/* Repeat words multiple times to ensure continuous scrolling */}
        {[...Array(5)].map((_, repeatIndex) => ( // Repeat the entire set of words 5 times
          <React.Fragment key={repeatIndex}>
            {words.map((word, index) => (
              <WordItem key={`${repeatIndex}-${index}`} word={word} />
            ))}
          </React.Fragment>
        ))}
      </div>
      {/* Duplicate the content to create a seamless loop */}
      <div className="inline-block animate-scroll-rtl" style={{ animationDuration: '90s', animationDelay: '-30s' }}> {/* Half duration delay for seamless loop */}
        {[...Array(5)].map((_, repeatIndex) => (
          <React.Fragment key={repeatIndex + 5}>
            {words.map((word, index) => (
              <WordItem key={`${repeatIndex + 5}-${index}`} word={word} />
            ))}
          </React.Fragment>
        ))}
      </div>

      {/* Tailwind CSS keyframes for the scrolling animation */}
      <style>
        {`
        @keyframes scroll-rtl {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-100%);
          }
        }

        .animate-scroll-rtl {
          animation: scroll-rtl linear infinite;
        }
        `}
      </style>
    </div>
  );
};

// Sub-component to handle individual word hover effect
const WordItem = ({ word }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <span
      className={`
        inline-block text-6xl md:text-8xl lg:text-9xl font-extrabold mx-8 tracking-widest
        transition-all duration-300 ease-in-out cursor-pointer
        ${isHovered ? 'text-green-400' : 'text-transparent'}
      `}
      style={{
        WebkitTextStroke: isHovered ? '2px #86EFAC' : '2px #86EFAC', // Green stroke
        WebkitTextFillColor: isHovered ? '#86EFAC' : 'transparent', // Fill with green on hover
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {word}
    </span>
  );
};

export default ScrollingWords;
