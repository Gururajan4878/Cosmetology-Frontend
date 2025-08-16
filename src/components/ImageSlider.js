// src/components/ImageSlider.js
import { useState, useEffect } from "react";

function ImageSlider() {
  const images = [
    "Images/image1.jpeg",
    "Images/image2.jpg",
    "Images/image3.jpg",
  ];

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % images.length);
    }, 3000); // 3 seconds auto-slide
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="w-full flex flex-col items-center my-8">
   {/* Heading styled like a badge */}
<h2
  className="
    inline-block 
    bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 
    text-white 
    px-3 py-1   /* reduced padding */
    rounded-full 
    shadow-md 
    text-xs sm:text-sm md:text-base   /* smaller text */
    font-semibold tracking-wide 
    mb-4
    transform transition-transform duration-300 hover:scale-105
  "
>
  Before & After – Glowing Face ✨
</h2>

      {/* Slider */}
      <div
        className="
          relative w-full 
          max-w-sm sm:max-w-md md:max-w-2xl lg:max-w-4xl 
          mx-auto 
          overflow-hidden rounded-lg sm:rounded-xl shadow-lg
        "
      >
        {/* Image container */}
        <div
          className="flex transition-transform duration-700 ease-in-out"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {images.map((src, index) => (
            <img
              key={index}
              src={src}
              alt={`Slide ${index}`}
              className="
                w-full 
                h-40 sm:h-56 md:h-72 lg:h-96 
                object-cover flex-shrink-0
              "
            />
          ))}
        </div>

        {/* Dots */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex gap-2">
          {images.map((_, index) => (
            <span
              key={index}
              className={`w-2 h-2 rounded-full ${
                index === current ? "bg-pink-500" : "bg-white/60"
              }`}
            ></span>
          ))}
        </div>
      </div>

      {/* Visit Us Section at Bottom */}
      <div
        className="
          bg-white/10 backdrop-blur-md 
          rounded-2xl 
          w-full 
          max-w-sm sm:max-w-md md:max-w-2xl lg:max-w-4xl 
          mx-auto mt-8 p-4 sm:p-6 md:p-8 text-left
        "
      >
        <h3 className="text-xs sm:text-sm md:text-base font-bold mb-2 sm:mb-3 text-pink-300">
          Visit Us
        </h3>
        <p className="text-[9px] sm:text-[10px] md:text-xs mb-2 sm:mb-3">
          📍 No.18, 4th Cross St E, Venkatasamy Nagar, Shenoy Nagar, Chennai,
          Tamil Nadu 600030
        </p>
        <p className="text-[9px] sm:text-[10px] md:text-xs">
          For appointments, connect with us via WhatsApp or Email below.
        </p>
      </div>
    </div>
  );
}

export default ImageSlider;