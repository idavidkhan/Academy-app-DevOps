import { Routes, Route, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import Courses from "./pages/Courses";
import News from "./pages/News";
import Teachers from "./pages/Teachers";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";
import UploadSlip from "./pages/UploadSlip";
import RegistrationForm from "./pages/RegistrationForm";
import AdminLogin from "./components/admin/AdminLogin";
import AdminPanel from "./components/admin/AdminPanel";
import CourseDetail from "./pages/CourseDetail";
import NewsDetail from "./pages/NewsDetail";
import TeacherDetail from "./pages/TeacherDetail";
import CheckStatus from "./pages/CheckStatus";
import VerifyRegistration from "./pages/VerifyRegistration";
import CertificateDownloader from "./pages/CertificateDownloader";


function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <div className="min-h-screen bg-gray-100">
      {!isAdminRoute && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/course-detail/:id" element={<CourseDetail />} />
        <Route path="/news" element={<News />} />
        <Route path="/news/:id" element={<NewsDetail />} />
        <Route path="/teachers" element={<Teachers />} />
        <Route path="/teacher-detail/:id" element={<TeacherDetail />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/upload-slip" element={<UploadSlip />} />
        <Route path="/register" element={<RegistrationForm />} />
        <Route path="/check-status" element={<CheckStatus />} />
        <Route path="/verify-registration" element={<VerifyRegistration />} />
        <Route path="/certificates" element={<CertificateDownloader />} />



        {/* Admin routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/*" element={<AdminPanel />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={3000} limit={1} />
    </div>
  );
}

export default App;
