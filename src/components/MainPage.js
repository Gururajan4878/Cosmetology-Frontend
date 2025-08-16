import React, { useState, useEffect } from 'react';
import BuySection from './BuySection';
import AuthModal from './AuthModal';
import OurTreatments from './OurTreatments';
import { FaWhatsapp, FaEnvelope, FaInstagram, FaTwitter } from "react-icons/fa";

// ===== NAVBAR =====
function Navbar({ openLogin }) {
  return (
    <nav className="bg-transparent py-3 px-4 sm:py-4 sm:px-6 flex items-center justify-between z-20 relative">
      <h1 className="text-sm sm:text-lg md:text-2xl font-semibold text-white drop-shadow-lg tracking-wide">
       𝒟𝓇. 𝒜𝓈𝒽𝒶 𝓆𝓊𝑒𝑒𝓃 | Facial Aesthetics & Injectables
      </h1>
      <button
        onClick={openLogin}
        className="bg-pink-500 hover:bg-pink-600 text-white px-3 py-1 sm:px-5 sm:py-2 rounded-full shadow-lg transition transform hover:scale-105 text-xs sm:text-sm font-medium"
      >
        Login
      </button>
    </nav>
  );
}

// ===== LANDING PAGE =====
function LandingPage() {
  return (
    <div className="flex flex-col flex-grow text-white text-center">
      {/* Hero Section */}
      <div className="flex flex-col items-center justify-center flex-grow px-4 sm:px-6 md:px-12">
        <h1 className="text-3xl sm:text-5xl md:text-7xl font-extrabold mb-4 sm:mb-6 tracking-tight drop-shadow-lg">
          Welcome to{" "}
          <span className="bg-gradient-to-r from-pink-300 via-purple-300 to-pink-300 bg-clip-text text-transparent animate-gradient">
            Cosmetology World
          </span>
        </h1>
        <p className="text-sm sm:text-lg md:text-2xl max-w-2xl mb-6 sm:mb-10 opacity-90">
          Discover advanced facial aesthetics, skin care, and injectable treatments to bring out your best look.
        </p>
      </div>
       {/* ✅ OurTreatments now imported */}
      <OurTreatments />
    </div>
  );
}

// ===== MAIN PAGE =====
function MainPage({ isLoggedIn, setIsLoggedIn, userEmail, setUserEmail }) {
  const [showModal, setShowModal] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    setIsLoggedIn(false);
    setUserEmail('');
  };

  return (
    <div className="relative z-10 flex flex-col flex-grow">
      {/* Navbar */}
      <Navbar openLogin={() => setShowModal(true)} />

      {/* Main Content */}
      {!isLoggedIn ? (
        <LandingPage openLogin={() => setShowModal(true)} />
      ) : (
        <BuySection
          isLoggedIn={isLoggedIn}
          userEmail={userEmail}
          onLogout={handleLogout}
        />
      )}

      {/* Auth Modal */}
      {showModal && (
        <AuthModal
          onClose={() => setShowModal(false)}
          onLogin={(email, token) => {
            setIsLoggedIn(true);
            setUserEmail(email);
            localStorage.setItem('userEmail', email);
            localStorage.setItem('token', token);
            setShowModal(false);
          }}
        />
      )}
     {/* Learn with Us Section */}
<div className="text-center my-6 sm:my-8">
  <p className="text-xs sm:text-sm md:text-base text-white max-w-2xl mx-auto mb-3 sm:mb-4">
    We provide professional courses to learn cosmetology at the most affordable prices.  
    Click <span className="font-semibold text-pink-300">“Learn with Us”</span> to explore more.
  </p>

  <button
    onClick={() => setShowModal(true)}
    className="bg-pink-500 hover:bg-pink-600 text-white px-6 sm:px-10 py-3 sm:py-4 rounded-full shadow-xl transition-all duration-300 transform hover:scale-105 text-sm sm:text-lg font-semibold"
  >
    Learn with Us
  </button>
</div>
    </div>
  );
}

export default MainPage;