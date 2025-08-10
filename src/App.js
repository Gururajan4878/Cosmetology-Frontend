import React, { useState } from 'react';
import BuySection from './components/BuySection';
import AuthModal from './components/AuthModal';
import { FaWhatsapp, FaEnvelope } from 'react-icons/fa';

function Navbar({ isLoggedIn, openLogin, onLogout }) {
  return (
    <nav className="bg-transparent border-none py-4 px-4 flex items-center justify-center z-20 relative">
      <div className="flex items-center gap-3 text-center">
        <h1 className="text-lg sm:text-xl md:text-2xl font-semibold text-white drop-shadow-lg tracking-wide break-words leading-tight max-w-full">
          𝒟𝓇. 𝒜𝓈𝒽𝒶 𝓆𝓊𝑒𝑒𝓃 | 𝓕𝓪𝓬𝓲𝓪𝓵 𝓐𝓮𝓼𝓽𝓱𝓮𝓽𝓲𝓬𝓼 & 𝓘𝓷𝓳𝓮𝓬𝓽𝓪𝓫𝓵𝓮𝓼
        </h1>
      </div>
    </nav>
  );
}

// ===== FOOTER =====
function Footer() {
  return (
    <footer className="bg-transparent border-none py-4 px-6 flex justify-center gap-6 z-10">
      <a
        href="https://wa.me/918428892641"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 bg-white hover:bg-green-50 text-green-600 px-5 py-3 rounded-full shadow-lg transition transform hover:scale-105"
      >
        <FaWhatsapp size={20} />
        <span className="font-medium">WhatsApp</span>
      </a>
      <a
        href="mailto:yourname@example.com"
        className="flex items-center gap-2 bg-white hover:bg-pink-50 text-pink-600 px-5 py-3 rounded-full shadow-lg transition transform hover:scale-105"
      >
        <FaEnvelope size={20} />
        <span className="font-medium">Message</span>
      </a>
    </footer>
  );
}

// ===== APP =====
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [userEmail, setUserEmail] = useState(localStorage.getItem('userEmail') || '');
  const [showModal, setShowModal] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    setIsLoggedIn(false);
    setUserEmail('');
    setShowModal(true);
  };

  return (
    <div
      className="min-h-screen flex flex-col relative"
      style={{
        backgroundImage: "url('/cosmo.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/70 z-0" />

      <div className="relative z-10 flex flex-col flex-grow">
        {/* Navbar */}
        <Navbar setShowModal={setShowModal} isLoggedIn={isLoggedIn} onLogout={handleLogout} />

        {/* Hero / Main Content */}
        {!isLoggedIn ? (
          <div className="flex-grow flex flex-col items-center justify-center text-white text-center px-6 md:px-12">
            <h6 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-4 tracking-tight drop-shadow-lg animate-fadeIn">
              Welcome to <span className="bg-gradient-to-r from-pink-300 via-purple-300 to-pink-300 bg-clip-text text-transparent animate-gradient">Cosmetology World</span>
            </h6>
            <p className="text-lg sm:text-xl md:text-2xl mb-8 opacity-90 animate-slideUp">
              Unlock beauty secrets — Register or Login to start learning today
            </p>

            <button
              onClick={() => setShowModal(true)}
              className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-4 rounded-full shadow-xl transition-all duration-300 transform hover:scale-105 text-lg font-semibold"
            >
              Register / Login
            </button>
          </div>
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

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}

export default App;