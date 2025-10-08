import React from "react";

const Footer = () => {
  return (
    <div>
      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="font-semibold mb-4">Về TechStore</h3>
              <p className="text-gray-400 text-sm">
                Cửa hàng công nghệ uy tín, chất lượng cao
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Liên hệ</h3>
              <p className="text-gray-400 text-sm">Email: info@techstore.vn</p>
              <p className="text-gray-400 text-sm">Hotline: 1900 xxxx</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Chính sách</h3>
              <ul className="text-gray-400 text-sm space-y-2">
                <li>Chính sách bảo hành</li>
                <li>Chính sách đổi trả</li>
                <li>Chính sách vận chuyển</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400 text-sm">
            © 2025 TechStore. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
