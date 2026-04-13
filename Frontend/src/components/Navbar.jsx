import { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import logo from "../assets/logo.png";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef();

  // Log current path for debugging
  useEffect(() => {
    console.log("Current path:", location.pathname);
  }, [location.pathname]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    setIsOpen((prev) => !prev);
    if (!isOpen) setShowDropdown(false); // Reset dropdown only when opening menu
  };

  const handleDropdownToggle = (e) => {
    e.stopPropagation();
    setShowDropdown((prev) => !prev);
  };

  const handleNavClick = (path) => {
    console.log(`Initiating navigation to: ${path}`);
    // Delay state updates to ensure navigation completes
    setTimeout(() => {
      setIsOpen(false);
      setShowDropdown(false);
    }, 100);
    navigate(path); // Fallback navigation
  };

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Courses", path: "/courses" },
    { name: "News", path: "/news" },
    { name: "Teachers", path: "/teachers" },
    { name: "Contact", path: "/contact" },
    { name: "FAQ", path: "/faq" },
  ];

  const applyLinks = [
    { name: "Apply for Course", path: "/register" },
    { name: "Upload Slip", path: "/upload-slip" },
    { name: "Check Status", path: "/check-status" },
    { name: "Certificates", path: "/certificates" },
  ];

  return (
    <nav className="sticky top-0 z-50 glass border-b border-teal-100/20 shadow-premium">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <img
              src={logo}
              alt="Trescol Logo"
              className="h-16 w-auto cursor-pointer transition-all duration-500 hover:scale-110 drop-shadow-[0_4px_6px_rgba(0,0,0,0.2)]"
              onClick={() => handleNavClick("/")}
            />
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => handleNavClick(item.path)}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${isActive
                    ? "bg-teal-600 text-white shadow-md shadow-teal-600/20"
                    : "text-slate-600 hover:bg-teal-50 hover:text-teal-600"
                  }`
                }
                aria-current={({ isActive }) => (isActive ? "page" : undefined)}
              >
                {item.name}
              </NavLink>
            ))}

            {/* Apply Dropdown (Desktop) */}
            <div ref={dropdownRef} className="relative">
              <button
                onClick={handleDropdownToggle}
                className="px-4 py-2 rounded-full text-sm font-semibold text-slate-600 hover:bg-teal-50 hover:text-teal-600 flex items-center gap-1.5 transition-all duration-300"
                aria-expanded={showDropdown}
                aria-haspopup="true"
              >
                Apply
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-300 ${showDropdown ? "rotate-180" : ""
                    }`}
                />
              </button>
              {showDropdown && (
                <div className="absolute right-0 z-20 mt-3 w-56 rounded-2xl glass shadow-premium overflow-hidden animate-fadeIn">
                  <div className="py-2">
                    {applyLinks.map((item) => (
                      <NavLink
                        key={item.name}
                        to={item.path}
                        onClick={() => handleNavClick(item.path)}
                        className={({ isActive }) =>
                          `block px-6 py-3 text-sm font-medium transition-colors ${isActive
                            ? "bg-teal-600 text-white"
                            : "text-slate-600 hover:bg-teal-50 hover:text-teal-600"
                          }`
                        }
                        aria-current={({ isActive }) =>
                          isActive ? "page" : undefined
                        }
                      >
                        {item.name}
                      </NavLink>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-600 hover:text-teal-600 hover:bg-teal-50 focus:outline-none transition-colors"
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => handleNavClick(item.path)}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-base font-semibold transition-colors duration-200 ${isActive
                    ? "bg-teal-600 text-white shadow-md shadow-teal-600/10"
                    : "text-slate-600 hover:bg-teal-50 hover:text-teal-600"
                  }`
                }
                aria-current={({ isActive }) => (isActive ? "page" : undefined)}
              >
                {item.name}
              </NavLink>
            ))}

            {/* Apply Dropdown (Mobile) */}
            <div className="border-t border-slate-100 mt-2 pt-2">
              <button
                onClick={handleDropdownToggle}
                className="w-full flex justify-between items-center px-3 py-2 text-left text-slate-600 font-semibold rounded-md hover:bg-teal-50 hover:text-teal-600 transition-colors"
                aria-expanded={showDropdown}
                aria-haspopup="true"
              >
                Apply
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${showDropdown ? "rotate-180" : ""
                    }`}
                />
              </button>
              {showDropdown && (
                <div className="mt-1 space-y-1 pl-4">
                  {applyLinks.map((item) => (
                    <NavLink
                      key={item.name}
                      to={item.path}
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent parent toggle
                        console.log(`Mobile dropdown clicked: ${item.path}`);
                        handleNavClick(item.path); // Trigger navigation
                      }}
                      onTouchStart={(e) => {
                        e.stopPropagation(); // Support touch events
                        console.log(`Mobile dropdown touched: ${item.path}`);
                        handleNavClick(item.path);
                      }}
                      className={({ isActive }) =>
                        `block px-5 py-2 text-sm rounded-md font-medium transition-colors ${isActive
                          ? "bg-teal-600 text-white"
                          : "text-slate-500 hover:bg-teal-50 hover:text-teal-600"
                        }`
                      }
                      aria-current={({ isActive }) =>
                        isActive ? "page" : undefined
                      }
                    >
                      {item.name}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
