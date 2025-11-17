import { Shield, TrendingUp, Truck, Zap } from "lucide-react";

import React from "react";

const TrustBadges = () => {
  return (
    <>
      {/* Trust Badges */}
      <div className="bg-black text-white py-3">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-center gap-6 sm:gap-8 flex-wrap text-xs sm:text-sm">
            <div className="flex items-center gap-2">
              <Truck size={18} />
              <span>Miễn phí vận chuyển</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield size={18} />
              <span>Bảo hành chính hãng</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap size={18} />
              <span>Giao hàng nhanh 2h</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp size={18} />
              <span>Giá tốt nhất</span>
            </div>
          </div>
        </div>
      </div>
      ;
    </>
  );
};

export default TrustBadges;
