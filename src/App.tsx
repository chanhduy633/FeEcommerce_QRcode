import { Toaster } from "sonner";
import { BrowserRouter, Route, Routes } from "react-router";
import NotFound from "./app/pages/NotFound";
import LoginAdmin from "./app/pages/admin/LoginAdmin";
import DashboardAdmin from "./app/pages/admin/DashboardAdmin";
import Homepage from "./app/pages/homepage/HomePage";
import OAuthSuccess from "./app/pages/homepage/OAuthSuccess";
import CheckoutPage from "./app/pages/CheckOut";
function App() {
  return (
    <div className="min-h-screen w-full bg-background">
      <Toaster
        position="top-right"
        richColors
      />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/auth/success" element={<OAuthSuccess />} />
          <Route path="/login" element={<LoginAdmin />} />
          <Route path="/admin/dashboard" element={<DashboardAdmin />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
