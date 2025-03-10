
import React, { useState } from 'react';
import { getPhoneData } from '../services/phoneService';
import { PhoneResult } from '../types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Phone, Loader } from 'lucide-react';

const SingleNumberCheck = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [result, setResult] = useState<PhoneResult | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleCheck = async () => {
    if (!phoneNumber.trim()) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, введите номер телефона",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const data = await getPhoneData(phoneNumber);
      setResult(data);
      
      if (data.error) {
        toast({
          title: "Ошибка",
          description: data.error,
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось получить информацию",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <Input
            type="text"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="+7 (999) 123-45-67"
            className="pl-10 border-[#cbd5e0] focus:border-[#3182ce] focus:ring-[#3182ce]"
          />
          <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#718096] h-4 w-4" />
        </div>
        <Button 
          onClick={handleCheck} 
          className="bg-[#3182ce] hover:bg-[#2b6cb0] transition-colors"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader className="mr-2 h-4 w-4 animate-spin" />
              Проверка...
            </>
          ) : 'Проверить'}
        </Button>
      </div>

      {result && !result.error && (
        <Card className="border border-[#e2e8f0] shadow-md animate-in fade-in-50 duration-300">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm text-[#718096]">Номер телефона</p>
                <p className="font-medium text-lg">+{result.full_num}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-[#718096]">Оператор</p>
                <p className="font-medium text-lg">{result.operator}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-[#718096]">Регион</p>
                <p className="font-medium text-lg">{result.region}</p>
              </div>
              {result.old_operator && (
                <div className="space-y-2">
                  <p className="text-sm text-[#718096]">Прошлый оператор</p>
                  <p className="font-medium text-lg">{result.old_operator}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SingleNumberCheck;
