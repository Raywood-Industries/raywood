import React from "react";
import logo from "./raywood_logo_final.jpg";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
      <div className="flex items-center justify-between px-6 sm:px-12 md:px-20 py-4">
        <div className="flex items-center space-x-4">
          <img src={logo} alt="Raywood Industries Logo" className="h-12 w-auto" />
        </div>
        {/* Place your hamburger menu or nav items here */}
        <div className="md:hidden">
          {/* Hamburger button goes here */}
        </div>
      </div>
    </header>
  );
}
