// src/pages/home/components/Banner.tsx
import React from "react";

interface BannerProps {
  onBannerClick?: () => void;
}

const Banner: React.FC<BannerProps> = ({ onBannerClick }) => {
  return (
    <div className="flex flex-col gap-4">
      <div 
        className="relative cursor-pointer overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow"
        onClick={onBannerClick}
      >
        <img
          src="/image1.png"
          alt="Samsung Galaxy S25 Ultra"
          className="w-full h-auto object-cover"
        />
        <div className="absolute inset-0 bg-opacity-0 hover:bg-opacity-10 transition-all"></div>
      </div>

      <div 
        className="relative cursor-pointer overflow-hidden rounded-lg shadow-lg hover:shadow-xl transition-shadow"
        onClick={onBannerClick}
      >
        <img
          src="/image2.png"
          alt="Oppo Find X9 Series"
          className="w-full h-auto object-cover"
        />
        <div className="absolute inset-0 bg-opacity-0 hover:bg-opacity-10 transition-all"></div>
      </div>
    </div>
  );
};

export default Banner;