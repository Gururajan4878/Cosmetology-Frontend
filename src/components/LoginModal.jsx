import React, { useState } from 'react';
import { Mail, Lock, Phone, X } from 'lucide-react';
import api from '../utils/Api';

function LoginModal({ onClose, onLogin }) {
  const [step, setStep] = useState('login'); // 'login', 'register', 'verify'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');

  const handleRegister = async () => {
    try {
      setError('');
      await api.post('/auth/register-initiate', { email, password, mobile });
      setStep('verify');
    } catch (err) {
      const msg = err.response?.data?.message || 'Registration failed';
      setError(msg);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      const otpCode = otp.join('');
      const res = await api.post('/auth/verify-otp', { email, otp: otpCode });
      localStorage.setItem('token', res.data.token);
      onLogin(email);
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid OTP';
      setError(msg);
    }
  };

  const handleLogin = async () => {
    try {
      setError('');
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      onLogin(email);
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      setError(msg);
    }
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < otp.length - 1) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white/10 backdrop-blur-lg p-8 rounded-2xl shadow-2xl w-full max-w-sm relative border border-white/20 animate-scaleIn">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-300 hover:text-white"
        >
          <X size={20} />
        </button>

        {/* Title */}
        <h2 className="text-2xl font-bold mb-4 text-center text-white drop-shadow">
          {step === 'login'
            ? 'Welcome Back'
            : step === 'register'
            ? 'Create Account'
            : 'Verify OTP'}
        </h2>

        {error && (
          <p className="text-red-400 text-sm text-center mb-3">{error}</p>
        )}

        {/* LOGIN STEP */}
        {step === 'login' && (
          <>
            <div className="relative mb-3">
              <Mail className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <input
                type="email"
                placeholder="Email"
                className="w-full pl-10 pr-3 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:border-pink-400 outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="relative mb-3">
              <Lock className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <input
                type="password"
                placeholder="Password"
                className="w-full pl-10 pr-3 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:border-pink-400 outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button
              onClick={handleLogin}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 rounded-lg shadow-lg hover:opacity-90 transition"
            >
              Login
            </button>
          </>
        )}

        {/* REGISTER STEP */}
        {step === 'register' && (
          <>
            <div className="relative mb-3">
              <Mail className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <input
                type="email"
                placeholder="Email"
                className="w-full pl-10 pr-3 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:border-pink-400 outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="relative mb-3">
              <Lock className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <input
                type="password"
                placeholder="Password"
                className="w-full pl-10 pr-3 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:border-pink-400 outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="relative mb-3">
              <Phone className="absolute left-3 top-2.5 text-gray-400" size={18} />
              <input
                type="tel"
                placeholder="Mobile Number"
                className="w-full pl-10 pr-3 py-2 rounded-lg bg-white/20 text-white placeholder-gray-300 border border-white/30 focus:border-pink-400 outline-none"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
              />
            </div>
            <button
              onClick={handleRegister}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 rounded-lg shadow-lg hover:opacity-90 transition"
            >
              Send OTP
            </button>
          </>
        )}

        {/* VERIFY STEP */}
        {step === 'verify' && (
          <>
            <p className="text-sm text-center mb-4 text-gray-200">
              Enter the 6-digit OTP sent to your phone
            </p>
            <div className="flex justify-center gap-2 mb-4">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength="1"
                  className="w-12 h-12 text-center text-xl rounded-lg bg-white/20 text-white border border-white/30 focus:border-pink-400 outline-none"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  inputMode="numeric"
                />
              ))}
            </div>
            <button
              onClick={handleVerifyOtp}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-2 rounded-lg shadow-lg hover:opacity-90 transition"
            >
              Verify OTP
            </button>
          </>
        )}

        {/* TOGGLE STEP */}
        {step !== 'verify' && (
          <div className="text-center mt-4 text-sm text-gray-200">
            {step === 'login' ? (
              <p>
                New user?{' '}
                <button
                  className="text-pink-300 underline"
                  onClick={() => {
                    setStep('register');
                    setError('');
                  }}
                >
                  Register here
                </button>
              </p>
            ) : (
              <p>
                Already registered?{' '}
                <button
                  className="text-pink-300 underline"
                  onClick={() => {
                    setStep('login');
                    setError('');
                  }}
                >
                  Login here
                </button>
              </p>
            )}
          </div>
        )}
      </div>

      {/* Animations */}
      <style>
        {`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        .animate-scaleIn { animation: scaleIn 0.3s ease-out; }
        `}
      </style>
    </div>
  );
}

export default LoginModal;