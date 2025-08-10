import React, { useState } from 'react';
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
    if (!/^\d?$/.test(value)) return; // only allow 1 digit number or empty
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < otp.length - 1) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow w-full max-w-sm relative">
        <h2 className="text-xl font-bold mb-4 text-center">
          {step === 'login' ? 'Login' : step === 'register' ? 'Register' : 'Verify OTP'}
        </h2>

        {error && (
          <p className="text-red-500 text-sm text-center mb-3">{error}</p>
        )}

        {step === 'login' && (
          <>
            <input
              type="email"
              placeholder="Email"
              className="w-full mb-3 p-2 border rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full mb-3 p-2 border rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              onClick={handleLogin}
              className="w-full bg-pink-500 text-white py-2 rounded"
            >
              Login
            </button>
          </>
        )}

        {step === 'register' && (
          <>
            <input
              type="email"
              placeholder="Email"
              className="w-full mb-3 p-2 border rounded"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full mb-3 p-2 border rounded"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="tel"
              placeholder="Mobile Number"
              className="w-full mb-3 p-2 border rounded"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
            />
            <button
              onClick={handleRegister}
              className="w-full bg-pink-500 text-white py-2 rounded"
            >
              Send OTP
            </button>
          </>
        )}

        {step === 'verify' && (
          <>
            <p className="text-sm text-center mb-2">
              Enter the 6-digit OTP sent to your phone
            </p>
            <div className="flex justify-center gap-2 mb-3">
              {otp.map((digit, index) => (
                <input
                  key={index}
                  id={`otp-${index}`}
                  type="text"
                  maxLength="1"
                  className="w-12 h-12 text-center text-xl border rounded"
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  autoComplete="off"
                  inputMode="numeric"
                />
              ))}
            </div>
            <button
              onClick={handleVerifyOtp}
              className="w-full bg-pink-500 text-white py-2 rounded"
            >
              Verify OTP
            </button>
          </>
        )}

        {step !== 'verify' && (
          <div className="text-center mt-4 text-sm">
            {step === 'login' ? (
              <p>
                New user?{' '}
                <button
                  className="text-pink-500 underline"
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
                  className="text-pink-500 underline"
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

        <button
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-600 hover:text-black"
        >
          ✕
        </button>
      </div>
    </div>
  );
}

export default LoginModal;
