import React, { useEffect, useState } from "react";
import api from "../utils/Api";
import { FaSignOutAlt } from "react-icons/fa";
import VideoArea from "./VideoArea"; // ✅ Import VideoArea

const BuySection = ({ isLoggedIn, userEmail, userMobile, onLogout }) => {
  const [hasPaid, setHasPaid] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);

  const videos = [
    {
      id: "1",
      title: "Bridal Makeup Course",
      description:
        "Learn advanced bridal makeup techniques including HydraFacial glow treatments, perfect for special occasions.",
      preview: "/Videos/thumb3.jpg",
      price: 1,
      cloudinaryUrl:
        "https://res.cloudinary.com/da1zjccsw/video/upload/v1755242974/GlowUpwith_sylfws.mp4",
    },
  ];

  // fetch payment status
  useEffect(() => {
    if (!selectedVideo) return;
    const fetchStatus = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await api.get(`/api/payment/status?videoId=${selectedVideo.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHasPaid(res.data.hasPaid);
      } catch (err) {
        console.error("Failed to fetch payment status:", err);
      }
    };
    if (isLoggedIn && (userEmail || userMobile)) fetchStatus();
  }, [selectedVideo, isLoggedIn, userEmail, userMobile]);

  // buy
  const handleBuy = async () => {
    if (!selectedVideo) return;
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first");
      return;
    }
    try {
      const res = await api.post(
        "/api/payment/create-order",
        { amount: selectedVideo.price, videoId: selectedVideo.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const options = {
        key: res.data.key,
        amount: res.data.amount * 100,
        currency: "INR",
        name: "Cosmetology Course",
        description: selectedVideo.title,
        order_id: res.data.orderId,
        handler: async function (response) {
          await api.post(
            "/api/payment/verify",
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              videoId: selectedVideo.id,
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          alert("Payment successful!");
          setHasPaid(true);
        },
        theme: { color: "#2563eb" },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", () => alert("Payment failed. Please try again."));
      rzp.open();
    } catch {
      alert("Something went wrong while initiating payment.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userMobile");
    onLogout();
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Top Bar */}
      <div className="bg-white shadow px-4 py-3 flex justify-between items-center">
        <h1 className="text-lg font-semibold text-gray-800">LearnCosmetology</h1>
        {isLoggedIn && (
          <div className="flex items-center gap-4">
            <div className="text-xs text-gray-600">
              <p>{userEmail}</p>
              <p>{userMobile}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded text-sm"
            >
              <FaSignOutAlt /> Logout
            </button>
          </div>
        )}
      </div>

      {/* Main Layout */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <div className="w-16 md:w-56 border-r bg-white overflow-y-auto">
          <h2 className="hidden md:block p-3 text-sm font-bold border-b">Course Content</h2>
          {videos.map((video) => (
            <div
              key={video.id}
              onClick={() => {
                setSelectedVideo(video);
                setHasPaid(false);
              }}
              className={`flex items-center gap-2 p-2 text-xs md:text-sm cursor-pointer hover:bg-gray-100 ${
                selectedVideo?.id === video.id ? "bg-blue-50 border-l-4 border-blue-500" : ""
              }`}
            >
              <img
                src={video.preview}
                alt={video.title}
                className="w-12 h-10 object-cover rounded mx-auto"
              />
              <span className="hidden md:block truncate">{video.title}</span>
            </div>
          ))}
        </div>

        {/* Use VideoArea */}
        <VideoArea
          selectedVideo={selectedVideo}
          hasPaid={hasPaid}
          isLoggedIn={isLoggedIn}
          handleBuy={handleBuy}
        />
      </div>
    </div>
  );
};

export default BuySection;