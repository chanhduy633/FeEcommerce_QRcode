import { Toaster } from "sonner";
import { BrowserRouter, Route, Routes } from "react-router";
import NotFound from "./pages/NotFound";
import LoginAdmin from "./pages/LoginAdmin";
import DashboardAdmin from "./pages/admin/DashboardAdmin";
import Homepage from "./pages/homepage/HomePage";
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
          <Route path="/login" element={<LoginAdmin />} />
          <Route path="/admin/dashboard" element={<DashboardAdmin />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
