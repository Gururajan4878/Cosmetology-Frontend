// src/components/OurTreatments.js
import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function OurTreatments() {
  const settings = {
    dots: false,
    infinite: true, // required for looping
    speed: 4000,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 0,
    cssEase: "linear",
    arrows: false,
    pauseOnHover: false,
    swipe: false, // disable swipe for smooth rotation
    responsive: [
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } },
    ],
  };

  const treatmentImages = [
    { src: "/Images/skin-rejuvenation.jpg", alt: "Skin Rejuvenation" },
    { src: "/Images/fillers.jpg", alt: "Dermal Fillers" },
    { src: "/Images/botox.jpg", alt: "Botox & Wrinkle Reduction" },
    { src: "/Images/anti-aging.jpg", alt: "Anti-Aging Therapy" },
  ];

  // Duplicate list to make it seamless
  const loopedImages = [...treatmentImages, ...treatmentImages];

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl mx-4 sm:mx-6 md:mx-20 my-8 p-4 sm:p-6 md:p-8 text-left">
      <h3 className="text-sm sm:text-base md:text-xl font-bold mb-2 sm:mb-4 text-pink-300">
        Our Treatments
      </h3>

      <ul className="list-disc pl-4 text-[10px] sm:text-xs md:text-sm space-y-1 text-white">
        <li>Skin Rejuvenation</li>
        <li>Dermal Fillers</li>
        <li>Botox & Wrinkle Reduction</li>
        <li>Anti-Aging Therapy</li>
        <li>Acne & Scar Treatments</li>
      </ul>

      <div className="mt-6">
        <Slider {...settings}>
          {loopedImages.map((img, index) => (
            <div key={index} className="px-2">
              <img
                src={img.src}
                alt={img.alt}
                className="rounded-xl shadow-lg w-full h-48 sm:h-64 object-cover"
              />
              <p className="text-center text-xs sm:text-sm mt-2 text-white">
                {img.alt}
              </p>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
}

export default OurTreatments;