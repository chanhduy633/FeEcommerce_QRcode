// src/pages/LoginAdmin.tsx
import React from "react";
import { dependencies } from "../../authDependencies";
import { useAuthViewModel } from "../../viewmodels/authViewModel";
import { Lock, User } from "lucide-react";

const LoginAdmin = () => {
  const {
    email,
    password,
    loading,
    error,
    setEmail,
    setPassword,
    handleSubmit,
  } = useAuthViewModel(dependencies.authUseCase);
  
  
  return (
    <div className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-black">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Stars */}
        <div className="absolute top-10 left-20 w-1 h-1 bg-white rounded-full animate-pulse"></div>
        <div
          className="absolute top-32 right-40 w-1 h-1 bg-white rounded-full animate-pulse"
          style={{ animationDelay: "0.5s" }}
        ></div>
        <div
          className="absolute top-5 right-20 w-1 h-1 bg-white rounded-full animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute bottom-40 left-32 w-1 h-1 bg-white rounded-full animate-pulse"
          style={{ animationDelay: "1.5s" }}
        ></div>
        <div
          className="absolute top-48 left-64 w-1 h-1 bg-white rounded-full animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>

        {/* Moon */}
        <div className="absolute top-24 right-48 w-32 h-32 bg-gradient-to-br from-gray-300 to-gray-500 rounded-full opacity-80 shadow-2xl">
          <div className="absolute top-4 left-6 w-6 h-6 bg-gray-400 rounded-full opacity-50"></div>
          <div className="absolute bottom-8 right-8 w-4 h-4 bg-gray-400 rounded-full opacity-40"></div>
          <div className="absolute top-12 right-6 w-3 h-3 bg-gray-400 rounded-full opacity-30"></div>
        </div>

        {/* Mountains */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg
            className="w-full h-64"
            viewBox="0 0 1200 300"
            preserveAspectRatio="none"
          >
            <path
              d="M0,300 L0,200 L200,100 L400,180 L600,80 L800,160 L1000,120 L1200,200 L1200,300 Z"
              fill="rgba(30,30,30,0.9)"
            />
            <path
              d="M0,300 L0,240 L300,160 L500,220 L700,140 L900,200 L1200,180 L1200,300 Z"
              fill="rgba(20,20,20,0.95)"
            />
          </svg>
        </div>
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md px-6">
        <div className="bg-gradient-to-br from-gray-900/90 to-gray-800/90 backdrop-blur-lg rounded-3xl p-8 shadow-2xl border border-gray-700/50">
          {/* Title */}
          <h1 className="text-4xl font-bold text-white text-center mb-8">
            Đăng nhập Admin
          </h1>

          <div className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="p-3 text-sm text-red-400 bg-red-900/20 rounded-xl border border-red-800/50">
                {error}
              </div>
            )}

            {/* Username Field */}
            <div className="relative">
              <input
                type="text"
                placeholder="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="w-full bg-transparent border-2 border-gray-600 rounded-full px-6 py-4 text-white placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors pr-12"
              />
              <User className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>

            {/* Password Field */}
            <div className="relative">
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="w-full bg-transparent border-2 border-gray-600 rounded-full px-6 py-4 text-white placeholder-gray-400 focus:outline-none focus:border-gray-400 transition-colors pr-12"
              />
              <Lock className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>

            {/* Login Button */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-white text-black font-semibold py-4 rounded-full hover:bg-gray-100 transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98]"
            >
              {loading ? "Đang đăng nhập ..." : "Đăng nhập"}
            </button>

            <p className="text-center text-white text-sm">Hãy đăng nhập để đến trang Admin!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginAdmin;
