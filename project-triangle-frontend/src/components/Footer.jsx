// src/components/Footer.jsx
import React from "react";
import { Link } from "react-router-dom";
import { FaTwitter, FaLinkedin, FaGithub, FaYoutube } from "react-icons/fa";

function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-12">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Brand / About */}
        <div>
          <h2 className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
            Project<span className="text-white">Triangle</span>
          </h2>
          <p className="mt-3 text-sm text-gray-400">
            Ready-made projects for students & developers to learn, build, and grow.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-sm font-semibold text-gray-200 mb-3">Quick Links</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/about" className="hover:text-emerald-400">About</Link></li>
            <li><Link to="/projects" className="hover:text-emerald-400">Projects</Link></li>
            <li><Link to="/contact" className="hover:text-emerald-400">Contact</Link></li>
            <li><Link to="/faq" className="hover:text-emerald-400">FAQ</Link></li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h3 className="text-sm font-semibold text-gray-200 mb-3">Legal</h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/privacy" className="hover:text-emerald-400">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-emerald-400">Terms of Service</Link></li>
            <li><Link to="/cookies" className="hover:text-emerald-400">Cookie Policy</Link></li>
          </ul>
        </div>

        {/* Social Media only */}
        <div>
          <h3 className="text-sm font-semibold text-gray-200 mb-3">Stay Connected</h3>
          <div className="flex space-x-4 text-lg">
            <a href="#" className="hover:text-emerald-400"><FaTwitter /></a>
            <a href="#" className="hover:text-emerald-400"><FaLinkedin /></a>
            <a href="#" className="hover:text-emerald-400"><FaGithub /></a>
            <a href="#" className="hover:text-emerald-400"><FaYoutube /></a>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="mt-8 text-center text-xs text-gray-500 border-t border-gray-800 pt-4">
        © {new Date().getFullYear()} Project Triangle. All Rights Reserved.
      </div>
    </footer>
  );
}

export default Footer;
