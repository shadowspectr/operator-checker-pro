
import React from 'react';
import { Phone } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-[#1a365d] text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Phone className="h-6 w-6" />
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
