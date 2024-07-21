import React from 'react';
const BackToTopButton = ({ isVisible }) => {
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      className={`back-to-top ${isVisible ? 'show' : ''}`}
      onClick={handleScrollToTop}
    >
      ↑
    </button>
  );
};

export default BackToTopButton;
