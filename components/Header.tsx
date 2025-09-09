
import React from 'react';
import { Page } from '../types';
import { UsersIcon, CogIcon } from './icons';

interface HeaderProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
}

const Header: React.FC<HeaderProps> = ({ currentPage, setCurrentPage }) => {
  const activeClass = "bg-blue-600 text-white";
  const inactiveClass = "bg-white text-gray-600 hover:bg-gray-100";

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 py-4 flex justify-between items-center">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
          FAQ 서비스
        </h1>
        <div className="flex items-center space-x-2 rounded-lg p-1 bg-gray-200">
          <button
            onClick={() => setCurrentPage('user')}
            className={`flex items-center space-x-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-200 ${currentPage === 'user' ? activeClass : inactiveClass}`}
          >
            <UsersIcon className="w-5 h-5" />
            <span>사용자</span>
          </button>
          <button
            onClick={() => setCurrentPage('admin')}
            className={`flex items-center space-x-2 px-3 py-1.5 text-sm font-medium rounded-md transition-colors duration-200 ${currentPage === 'admin' ? activeClass : inactiveClass}`}
          >
            <CogIcon className="w-5 h-5" />
            <span>관리자</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
