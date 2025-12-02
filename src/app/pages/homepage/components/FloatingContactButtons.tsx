import React, { useState } from "react";
import { Phone, MessageCircle, Facebook, X } from "lucide-react";

const FloatingContactButtons = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="fixed bottom-6 left-6 z-50 flex flex-col items-start gap-3">
      {/* Facebook Button */}
      <a
        href="https://facebook.com"
        target="_blank"
        rel="noopener noreferrer"
        className={`transform transition-all duration-300 delay-150 ${
          isExpanded ? "translate-x-0 opacity-100" : "-translate-x-20 opacity-0"
        }`}
      >
        <div className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all group">
          <Facebook size={24} />
          <span className="absolute left-16 top-1/2 -translate-y-1/2 bg-gray-800 text-white px-3 py-1 rounded-md text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            Facebook
          </span>
        </div>
      </a>

      {/* Zalo Button */}
      <a
        href="https://zalo.me/YOUR_ZALO_ID"
        target="_blank"
        rel="noopener noreferrer"
        className={`transform transition-all duration-300 delay-75 ${
          isExpanded ? "translate-x-0 opacity-100" : "-translate-x-20 opacity-0"
        }`}
      >
        <div className="bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all group">
          <MessageCircle size={24} />
          <span className="absolute left-16 top-1/2 -translate-y-1/2 bg-gray-800 text-white px-3 py-1 rounded-md text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            Zalo
          </span>
        </div>
      </a>

      {/* Phone Button */}
      <a
        href="tel:+84123456789"
        className={`transform transition-all duration-300  ${
          isExpanded ? "translate-x-0 opacity-100" : "-translate-x-20 opacity-0"
        }`}
      >
        <div className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all group animate-pulse">
          <Phone size={24} />
          <span className="absolute left-16 top-1/2 -translate-y-1/2 bg-gray-800 text-white px-3 py-1 rounded-md text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            Hotline
          </span>
        </div>
      </a>

      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="bg-indigo-600 hover:bg-indigo-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all"
      >
        {isExpanded ? <X size={24} /> : <MessageCircle size={24} />}
      </button>
    </div>
  );
};

export default FloatingContactButtons;
