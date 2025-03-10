
import React, { useState } from 'react';
import { getPhoneData } from '../services/phoneService';
import { PhoneResult } from '../types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

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
    <div className="animate-fade-up">
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Input
          type="text"
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          placeholder="+7 (999) 123-45-67"
          className="telecom-input flex-grow"
        />
        <Button 
          onClick={handleCheck} 
          className="telecom-button"
          disabled={loading}
        >
          {loading ? 'Проверка...' : 'Проверить'}
        </Button>
      </div>

      {result && !result.error && (
        <Card className="telecom-card animate-fade-in">
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm text-telecom-gray">Номер телефона</p>
                <p className="font-medium text-lg">+{result.full_num}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-telecom-gray">Оператор</p>
                <p className="font-medium text-lg">{result.operator}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-telecom-gray">Регион</p>
                <p className="font-medium text-lg">{result.region}</p>
              </div>
              {result.old_operator && (
                <div className="space-y-2">
                  <p className="text-sm text-telecom-gray">Прошлый оператор</p>
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
