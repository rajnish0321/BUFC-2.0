import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-bufc-blue text-white py-8">
      <div className="bufc-container">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">BUFC</h3>
            <p className="text-sm text-blue-100">
              Bennett University Food Courtyard - Your one-stop solution for hassle-free campus dining.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-blue-100 hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/menu" className="text-blue-100 hover:text-white transition">
                  Menu
                </Link>
              </li>
              <li>
                <Link to="/orders" className="text-blue-100 hover:text-white transition">
                  My Orders
                </Link>
              </li>
              <li>
                <Link to="/staff-login" className="text-blue-100 hover:text-white transition">
                  Staff Portal
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-blue-700 mt-8 pt-6 text-center text-sm text-blue-200">
          <p>© {new Date().getFullYear()} Bennett University Food Courtyard. All rights reserved.</p>
          <p className="mt-2">Designed and developed for Bennett University students.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
