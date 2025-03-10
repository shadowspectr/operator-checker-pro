
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { processBatchNumbers, parsePhoneNumbersFromText } from '../services/phoneService';
import { BatchResults } from '../types';
import { useToast } from '@/components/ui/use-toast';
import OperatorChart from './OperatorChart';
import ResultsDisplay from './ResultsDisplay';
import { Download } from 'lucide-react';
import { exportToExcel } from '../utils/exportUtils';

const BatchNumberCheck = () => {
  const [inputText, setInputText] = useState('');
  const [fileContent, setFileContent] = useState('');
  const [results, setResults] = useState<BatchResults | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check if it's a text file
    if (file.type !== 'text/plain') {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, загрузите файл формата .txt",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setFileContent(content);
      setInputText(content);
    };
    reader.readAsText(file);
  };

  const handleProcess = async () => {
    // Combine manual input and file content
    const textToProcess = inputText.trim();
    
    if (!textToProcess) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, введите номера телефонов или загрузите файл",
        variant: "destructive",
      });
      return;
    }

    const phoneNumbers = parsePhoneNumbersFromText(textToProcess);
    
    if (phoneNumbers.length === 0) {
      toast({
        title: "Ошибка",
        description: "Не найдено действительных номеров телефонов",
        variant: "destructive",
      });
      return;
    }

    if (phoneNumbers.length > 100) {
      toast({
        title: "Внимание",
        description: "Обработка большого количества номеров может занять время",
      });
    }

    setLoading(true);
    try {
      const batchResults = await processBatchNumbers(phoneNumbers);
      setResults(batchResults);
      
      toast({
        title: "Готово",
        description: `Обработано ${batchResults.totalProcessed} номеров`,
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось обработать номера",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    if (!results) return;
    
    const success = exportToExcel(results);
    if (success) {
      toast({
        title: "Успешно",
        description: "Результаты экспортированы в Excel",
      });
    } else {
      toast({
        title: "Ошибка",
        description: "Не удалось экспортировать в Excel",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="animate-fade-up space-y-6">
      <div className="space-y-4">
        <Textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Введите номера телефонов, каждый с новой строки или через запятую"
          className="min-h-[120px]"
        />
        
        <div className="flex items-center space-x-2">
          <div className="flex-1">
            <input
              type="file"
              id="file-upload"
              accept=".txt"
              onChange={handleFileUpload}
              className="telecom-input-file"
            />
          </div>
          
          <Button 
            onClick={handleProcess} 
            className="telecom-button"
            disabled={loading}
          >
            {loading ? 'Обработка...' : 'Проверить'}
          </Button>
        </div>
      </div>

      {results && (
        <div className="space-y-6">
          <div className="flex flex-wrap justify-between items-center">
            <div className="mb-4 sm:mb-0">
              <h3 className="text-xl font-medium">Результаты проверки</h3>
              <p className="text-telecom-gray">
                Обработано: {results.totalProcessed} | 
                Успешно: {results.successful} | 
                С ошибками: {results.failed}
              </p>
            </div>
            
            <Button 
              onClick={handleExport} 
              className="telecom-button"
              disabled={!results || results.successful === 0}
            >
              <Download className="mr-2 h-4 w-4" />
              Экспорт XLSX
            </Button>
          </div>
          
          {results.summary.length > 0 && (
            <OperatorChart data={results.summary} />
          )}
          
          <ResultsDisplay results={results.results} />
        </div>
      )}
    </div>
  );
};

export default BatchNumberCheck;
