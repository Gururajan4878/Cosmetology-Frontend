import React, { useEffect, useState, useRef } from 'react';
import api from '../utils/Api';
import { FaPlayCircle, FaLock, FaSignOutAlt } from 'react-icons/fa';

const BuySection = ({ isLoggedIn, userEmail, onLogout }) => {
  const [hasPaid, setHasPaid] = useState(false);
  const idleTimerRef = useRef(null);

  const video = {
    id: '1',
    title: 'Bridal Makeup Course',
    description: 'Glow Up with HydraFacial 💆‍♀️ | #hydrafacial | VJ Deepika',
    preview: '/Videos/thumb3.jpg',
    price: 1,
    vimeoEmbedSrc:
      "https://player.vimeo.com/video/1108798598?title=0&byline=0&portrait=0&badge=0&autopause=0",
  };

  // Idle logout setup
  useEffect(() => {
    const resetTimer = () => {
      if (idleTimerRef.current) {
        clearTimeout(idleTimerRef.current);
      }
      idleTimerRef.current = setTimeout(() => {
        handleLogout();
      }, 60 * 60 * 1000);  // 1 hour minutes
    };

    if (isLoggedIn) {
      window.addEventListener('mousemove', resetTimer);
      window.addEventListener('keydown', resetTimer);
      resetTimer(); // start timer when mounted
    }

    return () => {
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
      clearTimeout(idleTimerRef.current);
    };
  }, [isLoggedIn]);

  useEffect(() => {
    const fetchStatus = async () => {
      const token = localStorage.getItem('token');
      if (!token) return;

      try {
        const res = await api.get(`/api/payment/status?videoId=${video.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setHasPaid(res.data.hasPaid);
      } catch (err) {
        console.error('Failed to fetch payment status:', err);
      }
    };

    if (isLoggedIn && userEmail) {
      fetchStatus();
    }
  }, [isLoggedIn, userEmail]);

  const handleBuy = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login first');
      return;
    }

    try {
      const res = await api.post(
        '/api/payment/create-order',
        { amount: video.price, videoId: video.id },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const options = {
        key: res.data.key,
        amount: res.data.amount * 100,
        currency: 'INR',
        name: 'Cosmetology Course',
        description: video.title,
        order_id: res.data.orderId,
        handler: async function (response) {
          await api.post(
            '/api/payment/verify',
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              videoId: video.id,
            },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          alert('Payment successful!');
          setHasPaid(true);
        },
        theme: {
          color: '#EC4899',
        },
      };

      const rzp = new window.Razorpay(options);

      rzp.on('payment.failed', function () {
        alert('Payment failed. Please try again.');
      });

      rzp.open();
    } catch (err) {
      alert('Something went wrong while initiating payment.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    onLogout();
  };

  return (
    <div className="flex flex-col items-center px-4 py-10">
      <div className="max-w-4xl w-full bg-white/10 backdrop-blur-lg rounded-2xl shadow-xl p-6 border border-white/20">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-white drop-shadow-md">
            {video.title}
          </h2>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500/80 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition"
          >
            <FaSignOutAlt /> Logout
          </button>
        </div>

        {/* Video Section */}
        {hasPaid ? (
          <div className="flex justify-center">
            <iframe
              src={video.vimeoEmbedSrc}
              width="100%"
              height="480"
              frameBorder="0"
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              title={video.title}
              className="rounded-xl shadow-lg"
              style={{ maxWidth: '900px' }}
            ></iframe>
          </div>
        ) : (
          <div className="relative group w-full flex flex-col items-center text-center space-y-4">
            <img
              src={video.preview}
              alt="Video Preview"
              className="object-cover rounded-xl shadow-lg border border-white/20 w-full max-w-3xl"
            />
            <div className="absolute inset-0 flex flex-col justify-center items-center bg-black/50 opacity-0 group-hover:opacity-100 transition">
              <FaLock className="text-white text-5xl mb-2" />
              <span className="text-white text-lg">Purchase to Unlock</span>
            </div>
            <p className="text-white/90 text-lg max-w-2xl">{video.description}</p>
          </div>
        )}

        {/* Buy Button */}
        {!hasPaid && isLoggedIn && (
          <div className="flex justify-center mt-6">
            <button
              onClick={handleBuy}
              className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-3 rounded-full shadow-lg hover:scale-105 hover:shadow-pink-500/50 transition transform text-lg font-semibold"
            >
              <FaPlayCircle className="inline mr-2" /> Buy Now ₹{video.price}
            </button>
          </div>
        )}

        {!isLoggedIn && (
          <p className="mt-6 text-center text-white/80">
            Please login to purchase or watch the full video.
          </p>
        )}
      </div>
    </div>
  );
};

export default BuySection;