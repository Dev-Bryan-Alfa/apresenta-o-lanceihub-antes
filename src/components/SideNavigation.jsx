import React from 'react';

const SideNavigation = ({ sections }) => {
  const darkBackground = "#010821";
  const purpleAccent = "#5524E8";
  const purpleHover = "#6024AF";
  const greenAccent = "#07D99D";

  const handleScrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  return (
    <div className="fixed right-2 top-1/2 transform -translate-y-1/2 z-50 w-32"> {/* Reduzindo a largura */}
      <div
        className="bg-opacity-90 backdrop-blur-sm rounded-2xl p-4 border shadow-lg"
        style={{
          backgroundColor: darkBackground,
          borderColor: purpleAccent,
          zIndex: 1000,
        }}
      >
        <h3
          className="text-sm font-bold mb-3 text-center select-none"
          style={{ color: greenAccent }}
        >
          Navegação
        </h3>
        <nav className="space-y-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => handleScrollToSection(section.id)}
              className="w-full text-left px-3 py-2 text-xs rounded-lg transition-all duration-200 hover:text-white"
              style={{
                color: 'white',
                backgroundColor: 'transparent',
                border: `1px solid ${purpleAccent}30`,
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = `${purpleHover}20`;
                e.target.style.transform = 'translateX(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.transform = 'translateX(0)';
              }}
            >
              {section.title}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default SideNavigation;
