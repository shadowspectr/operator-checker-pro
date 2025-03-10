
import React from 'react';
import Header from '@/components/Header';
import PhoneChecker from '@/components/PhoneChecker';
import { Toaster } from '@/components/ui/toaster';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-telecom-ultraLight">
      <Header />
      <main className="flex-grow">
        <PhoneChecker />
      </main>
      <footer className="bg-telecom-blue text-white py-6">
        <div className="telecom-container">
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
