
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import SingleNumberCheck from './SingleNumberCheck';
import BatchNumberCheck from './BatchNumberCheck';

const PhoneChecker = () => {
  const [activeTab, setActiveTab] = useState('single');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-lg border border-[#e2e8f0] overflow-hidden">
          <CardContent className="p-6 md:p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl md:text-3xl font-medium text-[#2d3748]">Проверка оператора мобильной связи</h2>
              <p className="text-[#718096] mt-2">Узнайте оператора и регион по номеру телефона</p>
            </div>
            
            <Tabs 
              defaultValue="single" 
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="grid grid-cols-2 mb-8 bg-[#edf2f7]">
                <TabsTrigger value="single" className="text-base py-3 data-[state=active]:bg-white data-[state=active]:text-[#3182ce]">
                  Один номер
                </TabsTrigger>
                <TabsTrigger value="batch" className="text-base py-3 data-[state=active]:bg-white data-[state=active]:text-[#3182ce]">
                  Несколько номеров
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="single">
                <SingleNumberCheck />
              </TabsContent>
              
              <TabsContent value="batch">
                <BatchNumberCheck />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PhoneChecker;
