import { FaWhatsapp, FaEnvelope, FaInstagram, FaTwitter } from "react-icons/fa";

function Footer() {
  return (
    <footer className="w-full mt-8 mb-4 flex flex-col items-center">
      {/* Follow Us heading */}
      <h3 className="text-sm sm:text-base md:text-lg font-semibold text-gray-700 mb-2">
        Follow Us
      </h3>

      <div className="flex gap-2 sm:gap-3 md:gap-4 lg:gap-6">
        {/* WhatsApp */}
        <a
          href="https://wa.me/918428892641"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 bg-white hover:bg-green-50 text-green-600 
                     px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 
                     rounded-full shadow-md transition transform hover:scale-105 
                     text-[9px] sm:text-xs md:text-sm"
        >
          <FaWhatsapp className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
          <span>WhatsApp</span>
        </a>

        {/* Email */}
        <a
          href="mailto:yourname@example.com"
          className="flex items-center gap-1 bg-white hover:bg-pink-50 text-pink-600 
                     px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 
                     rounded-full shadow-md transition transform hover:scale-105 
                     text-[9px] sm:text-xs md:text-sm"
        >
          <FaEnvelope className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
          <span>Message</span>
        </a>

        {/* Instagram */}
        <a
          href="https://www.instagram.com/drashaqueen/?hl=en"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 bg-white hover:bg-purple-50 text-pink-500 
                     px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 
                     rounded-full shadow-md transition transform hover:scale-105 
                     text-[9px] sm:text-xs md:text-sm"
        >
          <FaInstagram className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
          <span>Instagram</span>
        </a>

        {/* Twitter */}
        <a
          href="https://twitter.com/yourpage"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 bg-white hover:bg-blue-50 text-sky-500 
                     px-2 py-1 sm:px-3 sm:py-1.5 md:px-4 md:py-2 
                     rounded-full shadow-md transition transform hover:scale-105 
                     text-[9px] sm:text-xs md:text-sm"
        >
          <FaTwitter className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5" />
          <span>Twitter</span>
        </a>
      </div>
    </footer>
  );
}

export default Footer;