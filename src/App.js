import React, { useState } from 'react';
import Navbar from './components/Navbar';
import BuySection from './components/BuySection';
import AuthModal from './components/AuthModal';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [userEmail, setUserEmail] = useState(localStorage.getItem('userEmail') || '');
  const [showModal, setShowModal] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    setIsLoggedIn(false);
    setUserEmail('');
    setShowModal(true); // Open login modal after logout
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar setShowModal={setShowModal} isLoggedIn={isLoggedIn} onLogout={handleLogout} />

      {!isLoggedIn ? (
        <div className="relative h-screen w-full">
          <img
            src="/cosmo.jpg"
            alt="Cosmetology"
            className="absolute inset-0 w-full h-full object-cover z-0"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 z-10 flex flex-col items-center justify-center text-white text-center px-4">
            <h1 className="text-5xl md:text-6xl font-bold mb-4">Welcome to Cosmetology World</h1>
            <p className="text-xl md:text-2xl mb-6">Register or login to explore courses</p>
            <button
              onClick={() => setShowModal(true)}
              className="bg-pink-500 hover:bg-pink-600 text-white px-8 py-4 rounded shadow-lg transition text-lg"
            >
              Register / Login
            </button>
          </div>
        </div>
      ) : (
        <BuySection
          isLoggedIn={isLoggedIn}
          userEmail={userEmail}
          onLogout={handleLogout}
        />
      )}

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
    </div>
  );
}

export default App;
