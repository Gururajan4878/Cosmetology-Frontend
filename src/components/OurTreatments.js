// src/components/OurTreatments.js
import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function OurTreatments() {
  const settings = {
    dots: false,
    infinite: true,
    speed: 9000,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 0,
    cssEase: "linear",
    arrows: false,
    pauseOnHover: false,
    swipe: false,
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

  const loopedImages = [...treatmentImages, ...treatmentImages];

  return (
    <div className="w-full bg-white/10 backdrop-blur-md py-8">
      <div className="max-w-6xl mx-auto px-4 md:px-8">
        {/* Heading */}
        <h3 className="text-lg md:text-2xl font-bold mb-4 text-pink-300 text-left">
          Our Treatments
        </h3>

        {/* List */}
        <ul className="list-disc list-inside text-sm md:text-base space-y-1 text-white text-left mb-6">
          <li>Skin Rejuvenation</li>
          <li>Dermal Fillers</li>
          <li>Botox & Wrinkle Reduction</li>
          <li>Anti-Aging Therapy</li>
          <li>Acne & Scar Treatments</li>
        </ul>

        {/* Slider */}
        <Slider {...settings}>
          {loopedImages.map((img, index) => (
            <div key={index} className="px-2">
              <img
                src={img.src}
                alt={img.alt}
                className="rounded-xl shadow-lg w-full h-[300px] sm:h-[400px] md:h-[500px] object-cover"
              />
              <p className="text-left text-sm md:text-base mt-2 text-white">
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
