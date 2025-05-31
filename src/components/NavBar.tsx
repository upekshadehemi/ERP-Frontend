//import React from 'react';
//import { Link } from 'react-router-dom';
//import "../styles/navbar.css";  
//import { Link } from 'react-router-dom'

import Logo from '../assets/Logo.png'
import { Link } from 'react-router-dom';

function NavBar() {
  return (
    <div className="w-full bg-blue-900 py-1 flex items-center justify-between px-8 fixed top-0 z-10">
      {/* Logo Section */}
      <div className="flex items-center">
        <img src={Logo} alt="Logo" className="w-28 h-28 object-contain" />
      </div>

      {/* Menu Section */}
      <div className="flex space-x-10 text-white">
  <div className="p-2">
    <Link to="/home" className="font-bold text-lg hover:underline cursor-pointer">Home</Link>
  </div>
  <div className="p-2">
    <Link to="/about" className="font-bold text-lg hover:underline cursor-pointer">About Us</Link>
  </div>
  <div className="p-2">
    <Link to="/contact" className="font-bold text-lg hover:underline cursor-pointer">Contact Us</Link>
  </div>
  <div className="p-2">
    <Link to="/services" className="font-bold text-lg hover:underline cursor-pointer">Services</Link>
  </div>
</div>
      </div>
   
  );
}

export default NavBar;
