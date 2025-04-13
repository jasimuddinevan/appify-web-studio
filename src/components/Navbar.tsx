
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Handle scroll event to change navbar transparency
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // Close mobile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close mobile menu when route changes
  const handleMobileNavClick = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 py-3 sm:py-4 px-4 sm:px-6 md:px-12 transition-all duration-300 ${
        isScrolled || isMobileMenuOpen
          ? "bg-white/90 backdrop-blur-md shadow-sm" 
          : "bg-transparent"
      }`}
    >
      <nav className="container mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 z-20">
          <div className="text-xl sm:text-2xl font-bold gradient-text">WebToAPK</div>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4 lg:gap-6">
          <Link 
            to="/" 
            className={`transition-colors font-medium text-sm lg:text-base ${
              isScrolled 
                ? "text-gray-700 hover:text-purple-600" 
                : "text-gray-800 hover:text-purple-500"
            }`}
          >
            Home
          </Link>
          <Link 
            to="/features" 
            className={`transition-colors font-medium text-sm lg:text-base ${
              isScrolled 
                ? "text-gray-700 hover:text-purple-600" 
                : "text-gray-800 hover:text-purple-500"
            }`}
          >
            Features
          </Link>
          <Link 
            to="/pricing" 
            className={`transition-colors font-medium text-sm lg:text-base ${
              isScrolled 
                ? "text-gray-700 hover:text-purple-600" 
                : "text-gray-800 hover:text-purple-500"
            }`}
          >
            Pricing
          </Link>
          <Link 
            to="/about" 
            className={`transition-colors font-medium text-sm lg:text-base ${
              isScrolled 
                ? "text-gray-700 hover:text-purple-600" 
                : "text-gray-800 hover:text-purple-500"
            }`}
          >
            About
          </Link>
          <Link 
            to="/contact" 
            className={`transition-colors font-medium text-sm lg:text-base ${
              isScrolled 
                ? "text-gray-700 hover:text-purple-600" 
                : "text-gray-800 hover:text-purple-500"
            }`}
          >
            Contact
          </Link>
          <Link to="/dashboard">
            <Button className="btn-gradient py-2 px-4 text-sm lg:text-base">Dashboard</Button>
          </Link>
        </div>
        
        {/* Mobile Menu Button */}
        <Button 
          variant="ghost" 
          size="sm"
          className="md:hidden z-20 p-1"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMobileMenuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          )}
        </Button>
        
        {/* Mobile Menu */}
        <div 
          ref={menuRef}
          className={`fixed inset-0 bg-white/98 backdrop-blur-lg z-10 flex flex-col items-center justify-center p-6 space-y-6 transition-all duration-300 md:hidden ${
            isMobileMenuOpen 
              ? "opacity-100 pointer-events-auto" 
              : "opacity-0 pointer-events-none"
          }`}
        >
          <Link 
            to="/" 
            className="text-gray-700 hover:text-purple-600 transition-colors font-medium text-xl"
            onClick={handleMobileNavClick}
          >
            Home
          </Link>
          <Link 
            to="/features" 
            className="text-gray-700 hover:text-purple-600 transition-colors font-medium text-xl"
            onClick={handleMobileNavClick}
          >
            Features
          </Link>
          <Link 
            to="/pricing" 
            className="text-gray-700 hover:text-purple-600 transition-colors font-medium text-xl"
            onClick={handleMobileNavClick}
          >
            Pricing
          </Link>
          <Link 
            to="/about" 
            className="text-gray-700 hover:text-purple-600 transition-colors font-medium text-xl"
            onClick={handleMobileNavClick}
          >
            About
          </Link>
          <Link 
            to="/contact" 
            className="text-gray-700 hover:text-purple-600 transition-colors font-medium text-xl"
            onClick={handleMobileNavClick}
          >
            Contact
          </Link>
          <Link to="/dashboard" className="w-full" onClick={handleMobileNavClick}>
            <Button className="btn-gradient w-full py-6">
              Dashboard
            </Button>
          </Link>
        </div>
      </nav>
    </header>
  );
};
