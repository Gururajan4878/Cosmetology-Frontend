import React from 'react';
import bannerImg from '../assets/cosmetology-banner.png';
import { FaWhatsapp } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';

const BannerSection = () => {
  return (
    <div className="bg-white rounded-xl shadow-lg flex flex-col md:flex-row-reverse max-w-5xl mx-4 md:mx-auto overflow-hidden mt-10">
      <div className="md:w-1/2">
        <img
          src={bannerImg}
          alt="Cosmetology Banner"
          className="object-cover w-full h-full"
        />
      </div>
      <div className="md:w-1/2 p-8 flex flex-col justify-center bg-purple-50">
        <h4 className="text-pink-400 uppercase text-sm font-semibold tracking-wide">
          Start Your Career in Beauty
        </h4>
        <h1 className="text-4xl font-bold text-purple-800 mt-2">
          Cosmetology Course
        </h1>
        <p className="text-gray-600 mt-4">
          Become a certified cosmetologist and advance your beauty career.
        </p>
        <div className="flex gap-4 mt-6">
          <a
            href="https://wa.me/918428892641"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-green-500 text-white px-5 py-2 rounded-lg hover:bg-green-600"
          >
            <FaWhatsapp size={20} />
            Contact Us
          </a>
          <a
            href="mailto:rgururajan4878@gmail.com"
            className="flex items-center gap-2 border-2 border-purple-800 text-purple-800 px-5 py-2 rounded-lg hover:bg-purple-800 hover:text-white"
          >
            <MdEmail size={20} />
            Email Us
          </a>
        </div>
      </div>
    </div>
  );
};

export default BannerSection;
