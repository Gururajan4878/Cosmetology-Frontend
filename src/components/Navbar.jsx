import React from 'react';

function Navbar({ isLoggedIn, openLogin, onLogout }) {
  return (
    <nav className="bg-blue-600 border-b-4 border-blue-800 py-4 px-6 shadow-md flex items-center justify-center">
      {/* Logo + Heading centered */}
      <div className="flex items-center gap-3">
        <img
          src="logo.png"
          alt="Logo"
          className="w-10 h-10 object-contain"
        />
        <h1 className="text-xl md:text-2xl font-semibold text-white whitespace-nowrap">
          𝒟𝓇. 𝒜𝓈𝒽𝒶 𝓆𝓊𝑒𝑒𝓃 | Facial Aesthetics & Injectables
        </h1>
      </div>
    </nav>
  );
}

export default Navbar;
