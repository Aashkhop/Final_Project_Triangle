import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex justify-between items-center h-16">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold text-blue-600">
          Project<span className="text-gray-800">Hub</span>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8">
          <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
            Home
          </Link>
          <Link to="/explore" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
            Projects
          </Link>
          <Link to="/about" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
            About
          </Link>
          <Link to="/contact" className="text-gray-700 hover:text-blue-600 font-medium transition-colors">
            Contact
          </Link>
        </div>

        {/* CTA Button */}
        <div className="hidden md:block">
          <Link
            to="/upload"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md transition-colors"
          >
            Upload Project
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-gray-700 focus:outline-none"
        >
          {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-md px-6 py-4 space-y-4">
          <Link to="/" className="block text-gray-700 hover:text-blue-600 font-medium">
            Home
          </Link>
          <Link to="/explore" className="block text-gray-700 hover:text-blue-600 font-medium">
            Projects
          </Link>
          <Link to="/about" className="block text-gray-700 hover:text-blue-600 font-medium">
            About
          </Link>
          <Link to="/contact" className="block text-gray-700 hover:text-blue-600 font-medium">
            Contact
          </Link>
          <Link
            to="/upload"
            className="block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg shadow-md"
          >
            Upload Project
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
