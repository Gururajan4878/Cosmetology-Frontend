import React from 'react';

function Navbar({ isLoggedIn, openLogin, onLogout }) {
  return (
    <nav className="relative bg-blue-600 border-b-4 border-blue-800 py-4 px-6 shadow-md">
      {/* Left: Contact and Mail */}
      <div className="absolute left-6 top-1/2 -translate-y-1/2 flex gap-4 text-white font-medium">
        <a
          href="https://wa.me/918428892641"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white hover:bg-gray-200 text-blue-600 px-4 py-2 rounded"
        >
          Contact
        </a>
        <a
          href="mailto:yourname@example.com"
          className="bg-white hover:bg-gray-200 text-blue-600 px-4 py-2 rounded"
        >
          Mail
        </a>
      </div>

      {/* Center: Logo + Heading */}
      <div className="flex items-center justify-center gap-3">
        <img
          src="logo.png" // replace with your logo path or URL
          alt="Logo"
          className="w-10 h-10 object-contain"
        />
        <h1 className="text-xl md:text-2xl font-semibold text-white">
          𝒟𝓇. 𝒜𝓈𝒽𝒶 𝓆𝓊𝑒𝑒𝓃| Facial Aesthetics & Injectables
        </h1>
      </div>
    </nav>
  );
}

export default Navbar;
