// src/App.js
import React, { useState } from 'react';
import MainPage from './components/MainPage';
import Footer from "./components/Footer";
import ImageSlider from "./components/ImageSlider";
import BuySection from "./components/BuySection";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));
  const [userEmail, setUserEmail] = useState(localStorage.getItem('userEmail') || '');
  const [userMobile, setUserMobile] = useState(localStorage.getItem('userMobile') || '');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userMobile');
    setIsLoggedIn(false);
    setUserEmail('');
    setUserMobile('');
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
      {/* Background overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/70 z-0" />

      {/* Content sits above the overlay */}
      <div className="relative z-10 flex-1 flex flex-col">
        {isLoggedIn ? (
          // 👉 When logged in, ONLY show BuySection
          <BuySection
            isLoggedIn={isLoggedIn}
            userEmail={userEmail}
            userMobile={userMobile}
            onLogout={handleLogout}
          />
        ) : (
          // 👉 When logged out, show your marketing site
          <>
            <MainPage
              isLoggedIn={isLoggedIn}
              setIsLoggedIn={setIsLoggedIn}
              userEmail={userEmail}
              setUserEmail={setUserEmail}
            />
            <ImageSlider />
            <Footer />
          </>
        )}
      </div>
    </div>
  );
}

export default App;