import React, { useState } from 'react';
import api from '../utils/Api';

function AuthModal({ onClose, onLogin }) {
  const [step, setStep] = useState('login'); // login | register | verify | forgot | forgot-otp | reset-password
  const [loginType, setLoginType] = useState('email'); 
  const [identifier, setIdentifier] = useState(''); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setconfirmPassword] = useState('');
  const [mobile, setMobile] = useState(''); 
  const [otp, setOtp] = useState(['', '', '', '', '', '']); 
  const [error, setError] = useState('');
  const [forgotType, setForgotType] = useState('email'); 
  const [resetToken, setResetToken] = useState(''); 
  const [isLoading, setIsLoading] = React.useState(false)

  const isValidEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const isValidPassword = (str) =>
    /^[a-zA-Z0-9!@#$%^&*()\-_=+\[\]{};:'",.<>/?\\|]+$/.test(str);

  const validateLogin = () => {
    if (!identifier.trim() || !password.trim()) {
      setError('Email or mobile number and password are required.');
      return false;
    }
    if (loginType === 'email') {
      if (!isValidEmail(identifier)) {
        setError('Please enter a valid email address.');
        return false;
      }
    } else {
      if (!/^\d{10}$/.test(identifier)) {
        setError('Please enter a valid 10-digit mobile number.');
        return false;
      }
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return false;
    }
    if (!isValidPassword(password)) {
      setError('Password contains invalid characters.');
      return false;
    }
    setError('');
    return true;
  };

  const validateRegister = () => {
    if (!email.trim() || !password.trim() || !mobile.trim()) {
      setError('All fields are required.');
      return false;
    }
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return false;
    }
    const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/;
  if (!passwordRegex.test(password)) {
    setError(
      'Password must include uppercase, lowercase, number, and special character.'
    );
    return;
  }
    if (!isValidPassword(password)) {
      setError('Password contains invalid characters.');
      return false;
    }
    if (!/^\d{10}$/.test(mobile)) {
      setError('Mobile number must be exactly 10 digits.');
      return false;
    }
    if (password !== confirmPassword) {
    setError('Passwords do not match');
    return; // ❌ stop here, don't send OTP
  }
    setError('');
    return true;
  };

  const validateForgot = () => {
    if (forgotType === 'email') {
      if (!email.trim()) {
        setError('Email is required.');
        return false;
      }
      if (!isValidEmail(email)) {
        setError('Please enter a valid email address.');
        return false;
      }
    } else {
      if (!mobile.trim()) {
        setError('Mobile number is required.');
        return false;
      }
      if (!/^\d{10}$/.test(mobile)) {
        setError('Mobile number must be exactly 10 digits.');
        return false;
      }
    }
    setError('');
    return true;
  };

  const validateResetPassword = () => {
    if (!password.trim()) {
      setError('Password is required.');
      return false;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return false;
    }
    if (!isValidPassword(password)) {
      setError('Password contains invalid characters.');
      return false;
    }
    setError('');
    return true;
  };

  const handleRegister = async () => {
    if (!validateRegister()) return;
    try {
      setError('');
      await api.post('/auth/register-initiate', { email, password, mobile: '+91' + mobile });
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
      localStorage.setItem('userEmail', email);
      onLogin(email, res.data.token);
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid OTP';
      setError(msg);
    }
  };

  const handleLogin = async () => {
    if (!validateLogin()) return;
    try {
      setError('');
      const idToSend = loginType === 'email' ? identifier : '+91' + identifier;
      const res = await api.post('/auth/login', { identifier: idToSend, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userIdentifier', idToSend);
      onLogin(idToSend, res.data.token);
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      setError(msg);
    }
  };

  // ✅ Merged sendForgotPasswordOtp from your first code
  const sendForgotPasswordOtp = async () => {
    if (!validateForgot()) return;
    try {
      if (forgotType === 'email') {
        await api.post('/auth/forgot-password-email', { email });
        alert('OTP sent to your email');
      } else {
        await api.post('/auth/forgot-password-phone', { mobile: '+91' + mobile });
        alert('OTP sent to your mobile');
      }
      setStep('forgot-otp');
      setOtp(['', '', '', '', '', '']);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to send OTP';
      setError(msg);
    }
  };

  const handleForgotVerifyOtp = async () => {
    try {
      const otpCode = otp.join('');
      let res;
      if (forgotType === 'email') {
        res = await api.post('/auth/forgot-verify-email-otp', { email, otp: otpCode });
      } else {
        res = await api.post('/auth/forgot-verify-phone-otp', { mobile: '+91' + mobile, otp: otpCode });
      }
      setResetToken(res.data.resetToken);
      setStep('reset-password');
      setPassword('');
      setError('');
    } catch (err) {
      const msg = err.response?.data?.message || 'Invalid OTP';
      setError(msg);
    }
  };

  const handleResetPassword = async () => {
    if (!validateResetPassword()) return;
    try {
      setError('');
      await api.post('/auth/reset-password', {
        resetToken,
        newPassword: password,
      });
      setStep('login');
      setEmail('');
      setPassword('');
      setMobile('');
      setOtp(['', '', '', '', '', '']);
      setResetToken('');
      setError('Password reset successful! Please login with new password.');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to reset password';
      setError(msg);
    }
  };

  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow w-full max-w-sm relative">
        <h2 className="text-xl font-bold mb-4 text-center">
          {step === 'login' && 'Login'}
          {step === 'register' && 'Register'}
          {step === 'verify' && 'Verify OTP'}
          {step === 'forgot' && 'Forgot Password'}
          {step === 'forgot-otp' && 'Verify OTP'}
          {step === 'reset-password' && 'Reset Password'}
        </h2>

        {error && <p className="text-red-500 text-sm text-center mb-3">{error}</p>}

        {/* LOGIN */}
        {step === 'login' && (
          <>
            <div className="mb-3 flex justify-center space-x-6">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="loginType"
                  value="email"
                  checked={loginType === 'email'}
                  onChange={() => { setLoginType('email'); setIdentifier(''); setError(''); }}
                />
                <span className="ml-2">Email</span>
              </label>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="loginType"
                  value="mobile"
                  checked={loginType === 'mobile'}
                  onChange={() => { setLoginType('mobile'); setIdentifier(''); setError(''); }}
                />
                <span className="ml-2">Mobile</span>
              </label>
            </div>
            <input
              type={loginType === 'email' ? 'email' : 'tel'}
              placeholder={loginType === 'email' ? 'Enter email' : 'Enter 10-digit mobile number'}
              value={identifier}
              maxLength={loginType === 'mobile' ? 10 : undefined}
              onChange={(e) => {
                let val = e.target.value;
                if (loginType === 'mobile') val = val.replace(/\D/g, '').slice(0, 10);
                setIdentifier(val);
                setError('');
              }}
              className="w-full p-2 mb-3 border border-gray-300 rounded"
            />
            <input
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              className="w-full p-2 mb-3 border border-gray-300 rounded"
            />
            <button onClick={handleLogin} className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
              Login
            </button>
            <div className="mt-4 flex justify-between text-sm text-blue-600">
              <button
                onClick={() => { setStep('register'); setEmail(''); setPassword(''); setMobile(''); setError(''); }}
                className="underline"
              >
                New User? Register
              </button>
              <button
                onClick={() => { setStep('forgot'); setEmail(''); setMobile(''); setError(''); }}
                className="underline"
              >
                Forgot Password?
              </button>
            </div>
          </>
        )}

{/* REGISTER */}
{step === 'register' && (
  <>
    <input
      type="email"
      placeholder="Enter email"
      value={email}
      onChange={(e) => { setEmail(e.target.value); setError(''); }}
      className="w-full p-2 mb-3 border border-gray-300 rounded"
    />
    <div className="flex items-center mb-3 border border-gray-300 rounded">
      <span className="px-2 text-gray-600">+91</span>
      <input
        type="tel"
        placeholder="Enter 10-digit mobile number"
        maxLength={10}
        value={mobile}
        onChange={(e) => { let val = e.target.value.replace(/\D/g, '').slice(0, 10); setMobile(val); setError(''); }}
        className="flex-1 p-2 border-none outline-none"
      />
    </div>
    <input
      type="password"
      placeholder="Enter new password"
      value={password}
      onChange={(e) => { setPassword(e.target.value); setError(''); }}
      className="w-full p-2 mb-3 border border-gray-300 rounded"
    />
    <input
      type="password"
      placeholder="Confirm password"
      value={confirmPassword}
      onChange={(e) => { setconfirmPassword(e.target.value); setError(''); }}
      className="w-full p-2 mb-3 border border-gray-300 rounded"
    />

    <button
      onClick={handleRegister}
      disabled={isLoading}
      className={`w-full py-2 rounded text-white ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'}`}
    >
      {isLoading ? (
        <span className="flex items-center justify-center">
          <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
          Verifying...
        </span>
      ) : (
        'Register'
      )}
    </button>

    <div className="mt-4 text-center text-sm text-blue-600">
      <button
        onClick={() => { setStep('login'); setIdentifier(''); setPassword(''); setError(''); }}
        className="underline"
      >
        Already have an account? Login
      </button>
    </div>
  </>
)}

        {/* VERIFY OTP */}
        {step === 'verify' && (
          <>
            <p className="mb-3 text-center">Enter the 6-digit OTP sent to {email}</p>
            <div className="flex justify-between mb-4 space-x-2">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  className="w-10 h-10 text-center border border-gray-300 rounded text-lg"
                />
              ))}
            </div>
            <button onClick={handleVerifyOtp} className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
              Verify OTP
            </button>
          </>
        )}

        {/* FORGOT PASSWORD */}
        {step === 'forgot' && (
          <>
            <div className="mb-3 flex justify-center space-x-6">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="forgotType"
                  value="email"
                  checked={forgotType === 'email'}
                  onChange={() => { setForgotType('email'); setEmail(''); setError(''); }}
                />
                <span className="ml-2">Email</span>
              </label>
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="radio"
                  name="forgotType"
                  value="mobile"
                  checked={forgotType === 'mobile'}
                  onChange={() => { setForgotType('mobile'); setMobile(''); setError(''); }}
                />
                <span className="ml-2">Mobile</span>
              </label>
            </div>
            {forgotType === 'email' ? (
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                className="w-full p-2 mb-3 border border-gray-300 rounded"
              />
            ) : (
              <div className="flex items-center mb-3 border border-gray-300 rounded">
                <span className="px-2 text-gray-600">+91</span>
                <input
                  type="tel"
                  placeholder="Enter 10-digit mobile number"
                  maxLength={10}
                  value={mobile}
                  onChange={(e) => { let val = e.target.value.replace(/\D/g, '').slice(0, 10); setMobile(val); setError(''); }}
                  className="flex-1 p-2 border-none outline-none"
                />
              </div>
            )}
            <button onClick={sendForgotPasswordOtp} className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
              Send OTP
            </button>
          </>
        )}

        {/* FORGOT PASSWORD OTP VERIFY */}
        {step === 'forgot-otp' && (
          <>
            <p className="mb-3 text-center">Enter the 6-digit OTP sent to your {forgotType === 'email' ? email : `+91${mobile}`}</p>
            <div className="flex justify-between mb-4 space-x-2">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  className="w-10 h-10 text-center border border-gray-300 rounded text-lg"
                />
              ))}
            </div>
            <button onClick={handleForgotVerifyOtp} className="w-full bg-yellow-600 text-white py-2 rounded hover:bg-yellow-700">
              Verify OTP
            </button>
          </>
        )}

        {/* RESET PASSWORD */}
        {step === 'reset-password' && (
          <>
            <input
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(''); }}
              className="w-full p-2 mb-3 border border-gray-300 rounded"
            />
            <button onClick={handleResetPassword} className="w-full bg-yellow-600 text-white py-2 rounded hover:bg-yellow-700">
              Reset Password
            </button>
          </>
        )}

        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 font-bold"
        >
          ×
        </button>
      </div>
    </div>
  );
}

export default AuthModal;
