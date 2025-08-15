import React, { useEffect, useState } from "react";
import api from "../utils/Api";
import { FaPlayCircle, FaLock, FaSignOutAlt, FaBars, FaTimes } from "react-icons/fa";
import { Player, BigPlayButton } from "video-react";
import "video-react/dist/video-react.css";

const BuySection = ({ isLoggedIn, userEmail, userMobile, onLogout }) => {
  const [hasPaid, setHasPaid] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

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
    // Add more videos here
  ];

  const [currentVideo, setCurrentVideo] = useState(videos[0]);

  useEffect(() => {
    const fetchStatus = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;
      try {
        const res = await api.get(
          `/api/payment/status?videoId=${currentVideo.id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setHasPaid(res.data.hasPaid);
      } catch (err) {
        console.error("Failed to fetch payment status:", err);
      }
    };
    if (isLoggedIn && (userEmail || userMobile)) fetchStatus();
  }, [isLoggedIn, userEmail, userMobile, currentVideo]);

  const handleBuy = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login first");
      return;
    }
    try {
      const res = await api.post(
        "/api/payment/create-order",
        { amount: currentVideo.price, videoId: currentVideo.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const options = {
        key: res.data.key,
        amount: res.data.amount * 100,
        currency: "INR",
        name: "Cosmetology Course",
        description: currentVideo.title,
        order_id: res.data.orderId,
        handler: async function (response) {
          await api.post(
            "/api/payment/verify",
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              videoId: currentVideo.id,
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
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white shadow-md py-4 px-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Toggle Button */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-md bg-gray-100 hover:bg-gray-200 block md:hidden"
          >
            {sidebarOpen ? <FaTimes /> : <FaBars />}
          </button>
          {/* Title */}
          <h1 className="text-xl font-bold text-gray-800">LearnCosmetology</h1>
        </div>

        {isLoggedIn && (
          <div className="flex items-center gap-4">
            <div className="text-gray-700 text-sm flex flex-col text-right">
              {userEmail && <span>{userEmail}</span>}
              {userMobile && <span>{userMobile}</span>}
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
        {/* Video list */}
        {sidebarOpen && (
          <div className="md:col-span-1 flex flex-col gap-4">
            {videos.map((video) => (
              <div
                key={video.id}
                onClick={() => {
                  setCurrentVideo(video);
                  setHasPaid(false);
                }}
                className={`cursor-pointer rounded-md shadow-md overflow-hidden border ${
                  currentVideo.id === video.id
                    ? "border-blue-500"
                    : "border-gray-200"
                } hover:shadow-lg transition duration-200`}
              >
                <img
                  src={video.preview}
                  alt={video.title}
                  className="w-full h-24 object-cover"
                />
                <div className="p-2">
                  <p className="text-gray-800 text-sm font-semibold">
                    {video.title}
                  </p>
                  <p className="text-gray-500 text-xs">{video.price} ₹</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Video Player + Details */}
        <div className={sidebarOpen ? "md:col-span-3" : "md:col-span-4"}>
          <div className="bg-white rounded-lg shadow-md p-4">
            {hasPaid ? (
              <Player fluid={false} width="100%" height={400}>
                <source src={currentVideo.cloudinaryUrl} />
                <BigPlayButton position="center" />
              </Player>
            ) : (
              <div className="flex flex-col items-center">
                <img
                  src={currentVideo.preview}
                  alt={currentVideo.title}
                  className="object-cover rounded-md shadow-md max-w-full"
                  style={{ maxHeight: "300px" }}
                />
                <div className="mt-3 flex flex-col items-center">
                  <FaLock className="text-gray-500 text-4xl mb-2" />
                  <span className="text-gray-600 text-sm">
                    Purchase to unlock this video
                  </span>
                </div>
              </div>
            )}

            <div className="mt-4">
              <h2 className="text-gray-900 font-semibold text-lg">
                {currentVideo.title}
              </h2>
              <p className="text-gray-700 text-sm mt-1">
                {currentVideo.description}
              </p>

              {!hasPaid && isLoggedIn && (
                <button
                  onClick={handleBuy}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-md text-sm font-semibold transition duration-200"
                >
                  <FaPlayCircle className="inline mr-2" /> Buy Now ₹
                  {currentVideo.price}
                </button>
              )}

              {!isLoggedIn && (
                <p className="mt-4 text-gray-600 text-sm">
                  Please login to purchase or watch the full video.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuySection;