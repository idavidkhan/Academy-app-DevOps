// src/components/admin/AdminPanel.jsx
import React from "react";
import {
  Routes,
  Route,
  useNavigate,
  Link,
  useLocation,
  Navigate,
} from "react-router-dom";
import {
  FiLogOut,
  FiUsers,
  FiHelpCircle,
  FiVideo,
  FiMail,
  FiBookOpen,
  FiUserCheck,
  FiMessageSquare,
  FiInfo,
  FiFileText,
  FiCalendar,
  FiAward,
} from "react-icons/fi";


import logo from "../..//assets/trescol_logo_white-04.png";
import AddCourse from "./AddCourse";
import DeleteCourse from "./DeleteCourse";
import EditCourse from "./EditCourse";
import AddTeacher from "./AddTeacher";
import DeleteTeacher from "./DeleteTeacher";
import EditTeacher from "./EditTeacher";
import DeleteAbout from "./DeleteAbout";
import AddAbout from "./AddAbout";
import EditAbout from "./EditAbout";
import DeleteFaqs from "./DeleteFaqs";
import AddFaqs from "./AddFaqs";
import EditFaqs from "./EditFaqs";
import EditContactInfo from "./EditContactInfo";
import AddContactInfo from "./AddContactInfo";
import DeleteContactInfo from "./DeleteContactInfo";
import AddNews from "./AddNews";
import EditNews from "./EditNews";
import DeleteNews from "./DeleteNews";
import Subscribers from "./Subscribers";
import AddVideo from "../admin/AddVideo";
import DeleteVideo from "../admin/DeleteVideo";
import EditVideo from "../admin/EditVideo";
import Messages from "./Messages";
import ScheduleCourse from "./ScheduleCourse";
import EditSchedule from "./EditSchedule";
import DeleteSchedule from "./DeleteSchedule";
import MessageDetails from "./MessageDetails";
import AdminRegistrations from "./AdminRegistrations";
import BankInfoManagement from "./BankInfoManagement";
import AddEditBankInfo from "./AddEditBankInfo";
import Certificates from "./Certificates";


function AdminPanel() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/admin/login");
  };

  //Checks if the current path matches the sidebar link to apply an active style
  const isActive = (path) => location.pathname === path;

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-teal-800 to-teal-900 text-white p-6 shadow-lg">
        <div className="flex justify-center mt-10 mb-10">
          <img
            src={logo}
            alt="Trescol Admin"
            className="h-18 mr-1 w-auto object-contain cursor-pointer transition-transform duration-300 hover:scale-105 drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)] brightness-110"
            onClick={() => (window.location.href = "/admin")}
          />
        </div>

        <nav className="space-y-4">
          <Link
            to="/admin/courses"
            className={`flex items-center px-4 py-2 rounded-md transition hover:bg-teal-700 ${isActive("/admin/courses") ? "bg-teal-700" : ""
              }`}
          >
            <FiBookOpen className="mr-2" /> Courses
          </Link>

          <Link
            to="/admin/schedule-course"
            className={`flex items-center px-4 py-2 rounded-md transition hover:bg-teal-700 ${isActive("/admin/schedule-course") ? "bg-teal-700" : ""
              }`}
          >
            <FiCalendar className="mr-2" /> Schedule Course
          </Link>

          <Link
            to="/admin/teachers"
            className={`flex items-center px-4 py-2 rounded-md transition hover:bg-teal-700 ${isActive("/admin/teachers") ? "bg-teal-700" : ""
              }`}
          >
            <FiUserCheck className="mr-2" /> Teachers
          </Link>

          <Link
            to="/admin/about"
            className={`flex items-center px-4 py-2 rounded-md transition hover:bg-teal-700 ${isActive("/admin/about") ? "bg-teal-700" : ""
              }`}
          >
            <FiInfo className="mr-2" /> About
          </Link>

          <Link
            to="/admin/news"
            className={`flex items-center px-4 py-2 rounded-md transition hover:bg-teal-700 ${isActive("/admin/news") ? "bg-teal-700" : ""
              }`}
          >
            <FiFileText className="mr-2" /> News
          </Link>

          <Link
            to="/admin/contact"
            className={`flex items-center px-4 py-2 rounded-md transition hover:bg-teal-700 ${isActive("/admin/contact") ? "bg-teal-700" : ""
              }`}
          >
            <FiMail className="mr-2" /> Contact Info
          </Link>

          <Link
            to="/admin/faqs"
            className={`flex items-center px-4 py-2 rounded-md transition hover:bg-teal-700 ${isActive("/admin/faqs") ? "bg-teal-700" : ""
              }`}
          >
            <FiHelpCircle className="mr-2" /> FAQs
          </Link>

          <Link
            to="/admin/subscribers"
            className={`flex items-center px-4 py-2 rounded-md transition hover:bg-teal-700 ${isActive("/admin/subscribers") ? "bg-teal-700" : ""
              }`}
          >
            <FiUsers className="mr-2" /> Subscribers
          </Link>

          <Link
            to="/admin/video"
            className={`flex items-center px-4 py-2 rounded-md transition hover:bg-teal-700 ${isActive("/admin/video") ? "bg-teal-700" : ""
              }`}
          >
            <FiVideo className="mr-2" /> Video
          </Link>

          <Link
            to="/admin/messages"
            className={`flex items-center px-4 py-2 rounded-md transition hover:bg-teal-700 ${isActive("/admin/messages") ? "bg-teal-700" : ""
              }`}
          >
            <FiMessageSquare className="mr-2" /> Messages
          </Link>


          <Link
            to="/admin/registrations"
            className={`flex items-center px-4 py-2 rounded-md transition hover:bg-teal-700 ${isActive("/admin/registrations") ? "bg-teal-700" : ""
              }`}
          >
            <FiFileText className="mr-2" /> Registrations
          </Link>


          <Link
            to="/admin/add-bank"
            className={`flex items-center px-4 py-2 rounded-md transition hover:bg-teal-700 ${isActive("/admin/add-bank") ? "bg-teal-700" : ""
              }`}
          >
            <FiInfo className="mr-2" /> Bank Information
          </Link>

          <Link
            to="/admin/certificates"
            className={`flex items-center px-4 py-2 rounded-md transition hover:bg-teal-700 ${isActive("/admin/certificates") ? "bg-teal-700" : ""
              }`}
          >
            <FiAward className="mr-2" /> Certificates
          </Link>


          <button
            onClick={handleLogout}
            className="flex items-center px-4 py-2 rounded-md transition hover:bg-teal-700"
          >
            <FiLogOut className="mr-2" /> Logout
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/add-course" element={<AddCourse />} />
          <Route path="/courses" element={<DeleteCourse />} />
          <Route path="/edit-course/:id" element={<EditCourse />} />

          <Route path="/add-teacher" element={<AddTeacher />} />
          <Route path="/teachers" element={<DeleteTeacher />} />
          <Route path="/edit-teacher/:id" element={<EditTeacher />} />

          <Route path="about" element={<DeleteAbout />} />
          <Route path="add-about" element={<AddAbout />} />
          <Route path="edit-about/:id" element={<EditAbout />} />

          <Route path="faqs" element={<DeleteFaqs />} />
          <Route path="faqs/add" element={<AddFaqs />} />
          <Route path="faqs/edit/:id" element={<EditFaqs />} />

          <Route path="add-contact" element={<AddContactInfo />} />
          <Route path="edit-contact" element={<EditContactInfo />} />
          <Route path="contact" element={<DeleteContactInfo />} />

          <Route path="add-news" element={<AddNews />} />
          <Route path="edit-news/:id" element={<EditNews />} />
          <Route path="news" element={<DeleteNews />} />

          <Route path="subscribers" element={<Subscribers />} />

          <Route path="video" element={<AddVideo />} />
          <Route path="video-list" element={<DeleteVideo />} />
          <Route path="edit-video/:id" element={<EditVideo />} />

          <Route path="messages" element={<Messages />} />
          <Route path="/message/:id" element={<MessageDetails />} />

          <Route path="add-schedule" element={<ScheduleCourse />} />
          <Route path="schedule-course" element={<DeleteSchedule />} />
          <Route path="edit-schedule/:id" element={<EditSchedule />} />


          <Route path="/registrations" element={<AdminRegistrations />} />

          <Route path="/bank-info" element={<BankInfoManagement />} />
          <Route path="/add-bank" element={<AddEditBankInfo />} />
          <Route path="/edit-bank/:BankID" element={<AddEditBankInfo />} />
          <Route path="/certificates" element={<Certificates />} />






          {/* Optional redirect if you want /admin to go to dashboard */}
          <Route path="*" element={<Navigate to="/admin" />} />
        </Routes>
      </main>
    </div>
  );
}

const Welcome = () => (
  <div className="text-3xl font-bold text-gray-700">
    👋 Welcome to the Trescol Admin Panel!
  </div>
);

export default AdminPanel;
