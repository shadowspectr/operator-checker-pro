
import React from 'react';
import Header from '@/components/Header';
import PhoneChecker from '@/components/PhoneChecker';
import { Toaster } from '@/components/ui/toaster';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#f7fafc]">
      <Header />
      <main className="flex-grow">
        <PhoneChecker />
      </main>
      <footer className="bg-[#1a365d] text-white py-6">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-sm opacity-80">© 2023 Сервис Проверки Операторов Мобильной Связи</p>
          </div>
        </div>
      </footer>
      <Toaster />
    </div>
  );
};

export default Index;
