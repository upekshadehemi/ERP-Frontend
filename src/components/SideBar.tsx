// Sidebar.tsx
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const [openDropdown, setOpenDropdown] = useState<boolean>(false);

  return (
    <div id="sidebar" className="fixed left-0 top-0 h-full w-64 bg-blue-900 text-white shadow-lg mt-10">
    <div className="p-6">
      <div className="flex items-center justify-center mb-6">
        {/* Placeholder for logo */}
        <img src="/logo.png" alt="Logo" className="h-12" />
      </div>
  
      {/* Section: Normgroup */}
      <div className="space-y-1 mb-6 flex gap-4">
        <button
          onClick={() => setOpenDropdown(!openDropdown)}
          className="w-full text-left bg-white text-blue-900 px-4 py-2 rounded-lg hover:bg-gray-200 font-semibold transition"
        >
          Normgroup
        </button>
  
        <NavLink
          to="/manage"
          className="block w-full text-left bg-white text-blue-900 px-4 py-2 rounded-lg hover:bg-gray-200 font-semibold transition"
        >
          Manage
        </NavLink>
      </div>
      {openDropdown && (
          <div className="pl-4 mt-2 space-y-2 flex flex-col">
            <NavLink
              to="/group/bulidings"
              className="block text-sm text-white hover:underline"
            >
              Buildings
            </NavLink>
            <br></br>
            <NavLink
              to="/group/Roads"
              className="block text-sm text-white hover:underline"
            >
              Roads
            </NavLink>
          </div>
        )}
  
      {/* Reusable NavLink Section */}
      {[
        { label: 'Category', path: '/category' },
        { label: 'Normheader', path: '/header' },
        { label: 'Normdetail', path: '/detail' },
      ].map((item, idx) => (
        <div key={idx} className="space-y-1 mb-4 grid grid-cols-2 gap-4">
          <div className='w-[120%]'>
          <NavLink
            to={item.path}
            className="block w-full text-left bg-white text-blue-900 px-4 py-2 rounded-lg hover:bg-gray-200 font-semibold transition"
          >
            {item.label}
          </NavLink>
          </div>
         <div className="ml-4">
         <NavLink
            to="/manage"
            className="block w-full text-left bg-white text-blue-900 px-4 py-2 rounded-lg hover:bg-gray-200 font-semibold transition"
          >
            Manage
          </NavLink>
         </div>
        </div>
      ))}
    </div>
  </div>
  
  );
};

export default Sidebar;