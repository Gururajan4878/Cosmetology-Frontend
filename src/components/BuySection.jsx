import React, { useEffect, useState } from "react";
import api from "../utils/Api";
import { FaPlayCircle, FaLock, FaSignOutAlt, FaBars, FaTimes } from "react-icons/fa";

const BuySection = ({ isLoggedIn, userEmail, userMobile, onLogout }) => {
  const [hasPaid, setHasPaid] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768); // open by default on desktop
  const [mainVideoVisible, setMainVideoVisible] = useState(true);
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
    // add more videos here
  ];

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

  const handleToggle = () => {
    if (window.innerWidth >= 768) {
      // Desktop: toggle main video
      setMainVideoVisible(!mainVideoVisible);
    } else {
      // Mobile: toggle sidebar only
      setSidebarOpen(!sidebarOpen);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Top Bar */}
      <div className="bg-white shadow-md py-4 px-4 flex items-center justify-between flex-wrap">
        <div className="flex items-center gap-4">
          {/* Toggle Button */}
          <button
            onClick={handleToggle}
            className="p-2 rounded-md bg-gray-100 hover:bg-gray-200 transition duration-200"
          >
            {window.innerWidth >= 768 ? (mainVideoVisible ? <FaTimes /> : <FaBars />) : sidebarOpen ? <FaTimes /> : <FaBars />}
          </button>

          {/* Title */}
          <h1
            className="text-xl font-bold text-gray-800 cursor-pointer"
            onClick={() => {
              setSelectedVideo(null);
              setSidebarOpen(window.innerWidth >= 768);
              setMainVideoVisible(true);
            }}
          >
            LearnCosmetology
          </h1>
        </div>

        {/* User Info & Logout */}
        {isLoggedIn && (
          <div className="flex flex-wrap items-center gap-4 mt-2 md:mt-0">
            <div className="text-gray-700 text-sm flex flex-col">
              <span>{userEmail}</span>
              <span>{userMobile}</span>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-800 px-4 py-2 rounded-md text-sm font-medium transition duration-200"
            >
              <FaSignOutAlt /> Logout
            </button>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar */}
        {sidebarOpen && (
          <div className="md:col-span-1 flex flex-col gap-4">
            {videos.map((video) => (
              <div
                key={video.id}
                onClick={() => {
                  setSelectedVideo(video);
                  setMainVideoVisible(true);
                  if (window.innerWidth < 768) setSidebarOpen(false);
                  setHasPaid(false);
                }}
                className={`cursor-pointer rounded-md shadow-md overflow-hidden border ${
                  selectedVideo?.id === video.id ? "border-blue-500" : "border-gray-200"
                } hover:shadow-lg transition duration-200`}
              >
                <img
                  src={video.preview}
                  alt={video.title}
                  className="w-full h-24 object-cover"
                />
                <div className="p-2">
                  <p className="text-gray-800 text-sm font-semibold">{video.title}</p>
                  <p className="text-gray-500 text-xs">{video.price} ₹</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Main Video */}
        {mainVideoVisible && (
          <div className={`${sidebarOpen ? "md:col-span-3" : "md:col-span-4"} col-span-1`}>
            {!selectedVideo ? (
              <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-800 text-lg">
                Welcome to Cosmetology
              </div>
            ) : hasPaid ? (
              <div className="bg-white rounded-lg shadow-md p-4">
                <video
                  src={selectedVideo.cloudinaryUrl}
                  controls
                  controlsList="nodownload noremoteplayback"
                  disablePictureInPicture
                  className="w-full rounded-md"
                  style={{ maxHeight: "500px", objectFit: "contain" }}
                />
                <h2 className="text-gray-900 font-semibold text-lg mt-4">{selectedVideo.title}</h2>
                <p className="text-gray-700 text-sm mt-1">{selectedVideo.description}</p>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-4 flex flex-col items-center">
                <img
                  src={selectedVideo.preview}
                  alt={selectedVideo.title}
                  className="object-cover rounded-md shadow-md max-w-full"
                  style={{ maxHeight: "300px" }}
                />
                <FaLock className="text-gray-500 text-4xl my-2" />
                <p className="text-gray-600 text-sm">Purchase to unlock this video</p>
                {isLoggedIn && (
                  <button
                    onClick={handleBuy}
                    className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md text-sm font-semibold transition duration-200"
                  >
                    <FaPlayCircle className="inline mr-2" /> Buy Now ₹{selectedVideo.price}
                  </button>
                )}
                {!isLoggedIn && (
                  <p className="mt-2 text-gray-600 text-sm">Please login to purchase or watch full video.</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BuySection;