import React, { useEffect, useState } from 'react';
import api from '../utils/Api';

const BuySection = ({ isLoggedIn, userEmail, onLogout }) => {
  const [hasPaid, setHasPaid] = useState(false);

  const video = {
    id: '1',
    title: 'Bridal Makeup Course',
    description: 'Glow Up with HydraFacial💆‍♀️| #hydrafacial | VJ Deepika',
    preview: '/Videos/thumb3.jpg',
    price: 1,
    vimeoEmbedSrc:
      "https://player.vimeo.com/video/1108798598?title=0&byline=0&portrait=0&badge=0&autopause=0&player_id=0&app_id=58479",
  };

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
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold">{video.title}</h2>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {hasPaid ? (
        // Vimeo iframe centered
        <div className="flex justify-center">
          <iframe
            src={video.vimeoEmbedSrc}
            width="100%"
            height="480"
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            title={video.title}
            className="rounded-lg max-w-full"
            style={{ maxWidth: '800px' }}
          ></iframe>
        </div>
      ) : (
        // Center preview image + description
        <div className="flex flex-col items-center text-center space-y-4">
          <img
            src={video.preview}
            alt="Video Preview"
            width="640"
            height="360"
            className="object-cover rounded-lg shadow-lg"
          />
          <p className="text-gray-700 text-lg">{video.description}</p>
        </div>
      )}

      {!hasPaid && isLoggedIn && (
        <div className="flex justify-center mt-6">
          <button
            onClick={handleBuy}
            className="bg-pink-500 text-white px-8 py-3 rounded hover:bg-pink-600 transition"
          >
            Buy Now ₹{video.price}
          </button>
        </div>
      )}

      {!isLoggedIn && (
        <p className="mt-6 text-center text-gray-600">
          Please login to purchase or watch the full video.
        </p>
      )}
    </div>
  );
};

export default BuySection;
