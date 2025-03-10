
import React from 'react';

const Header = () => {
  return (
    <header className="bg-telecom-blue text-white shadow-md">
      <div className="telecom-container flex justify-between items-center py-4">
        <div className="flex items-center space-x-2 animate-fade-in">
          <svg 
            width="32" 
            height="32" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M7 2C7.53043 2 8.03914 2.21071 8.41421 2.58579C8.78929 2.96086 9 3.46957 9 4V5H15V4C15 3.46957 15.2107 2.96086 15.5858 2.58579C15.9609 2.21071 16.4696 2 17 2C17.5304 2 18.0391 2.21071 18.4142 2.58579C18.7893 2.96086 19 3.46957 19 4V5H20C20.5304 5 21.0391 5.21071 21.4142 5.58579C21.7893 5.96086 22 6.46957 22 7V20C22 20.5304 21.7893 21.0391 21.4142 21.4142C21.0391 21.7893 20.5304 22 20 22H4C3.46957 22 2.96086 21.7893 2.58579 21.4142C2.21071 21.0391 2 20.5304 2 20V7C2 6.46957 2.21071 5.96086 2.58579 5.58579C2.96086 5.21071 3.46957 5 4 5H5V4C5 3.46957 5.21071 2.96086 5.58579 2.58579C5.96086 2.21071 6.46957 2 7 2Z" 
              stroke="white" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
            <path 
              d="M9 13H15" 
              stroke="white" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
            <path 
              d="M8 17H16" 
              stroke="white" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
          <h1 className="text-xl font-bold">Проверка Операторов</h1>
        </div>
        <nav className="hidden md:flex space-x-6">
          <a href="#" className="opacity-90 hover:opacity-100 transition-opacity">Главная</a>
          <a href="#" className="opacity-90 hover:opacity-100 transition-opacity">О сервисе</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
