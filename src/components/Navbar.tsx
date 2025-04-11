
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
      className={`fixed top-0 left-0 right-0 z-50 py-4 px-6 md:px-12 transition-all duration-300 ${
        isScrolled || isMobileMenuOpen
          ? "bg-white/80 backdrop-blur-md shadow-sm" 
          : "bg-transparent"
      }`}
    >
      <nav className="container mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 z-20">
          <div className="text-2xl font-bold gradient-text">WebToAPK</div>
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <Link 
            to="/" 
            className={`transition-colors font-medium ${
              isScrolled 
                ? "text-gray-700 hover:text-purple-600" 
                : "text-gray-800 hover:text-white"
            }`}
          >
            Home
          </Link>
          <Link 
            to="/dashboard" 
            className={`transition-colors font-medium ${
              isScrolled 
                ? "text-gray-700 hover:text-purple-600" 
                : "text-gray-800 hover:text-white"
            }`}
          >
            Dashboard
          </Link>
          <Link 
            to="/#features" 
            className={`transition-colors font-medium ${
              isScrolled 
                ? "text-gray-700 hover:text-purple-600" 
                : "text-gray-800 hover:text-white"
            }`}
          >
            Features
          </Link>
          <Button className="btn-gradient">Get Started</Button>
        </div>
        
        {/* Mobile Menu Button */}
        <Button 
          variant="ghost" 
          className="md:hidden z-20"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
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
          className={`fixed inset-0 bg-white/95 backdrop-blur-lg z-10 flex flex-col items-center justify-center p-6 space-y-8 transition-all duration-300 md:hidden ${
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
            to="/dashboard" 
            className="text-gray-700 hover:text-purple-600 transition-colors font-medium text-xl"
            onClick={handleMobileNavClick}
          >
            Dashboard
          </Link>
          <Link 
            to="/#features" 
            className="text-gray-700 hover:text-purple-600 transition-colors font-medium text-xl"
            onClick={handleMobileNavClick}
          >
            Features
          </Link>
          <Button className="btn-gradient w-full mt-4" onClick={handleMobileNavClick}>
            Get Started
          </Button>
        </div>
      </nav>
    </header>
  );
};
