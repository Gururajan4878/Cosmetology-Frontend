import { FaWhatsapp, FaEnvelope } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="bg-transparent border-none py-3 px-6 flex justify-center gap-4 z-10">
      <a
        href="https://wa.me/918428892641"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2 bg-white hover:bg-gray-200 text-green-600 px-4 py-2 rounded-full shadow transition"
      >
        <FaWhatsapp size={20} />
        WhatsApp
      </a>
      <a
        href="mailto:yourname@example.com"
        className="flex items-center gap-2 bg-white hover:bg-gray-200 text-pink-600 px-4 py-2 rounded-full shadow transition"
      >
        <FaEnvelope size={20} />
        Message
      </a>
    </footer>
  );
}

export default Footer;