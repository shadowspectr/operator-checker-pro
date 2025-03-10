
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { processBatchNumbers, parsePhoneNumbersFromText } from '../services/phoneService';
import { BatchResults } from '../types';
import { useToast } from '@/components/ui/use-toast';
import OperatorChart from './OperatorChart';
import ResultsDisplay from './ResultsDisplay';
import { Download, FileText, Loader } from 'lucide-react';
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
    <div className="space-y-6">
      <div className="space-y-4">
        <Textarea
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Введите номера телефонов, каждый с новой строки или через запятую"
          className="min-h-[120px] border-[#cbd5e0] focus:border-[#3182ce] focus:ring-[#3182ce]"
        />
        
        <div className="flex items-center space-x-2">
          <div className="flex-1 relative">
            <label 
              htmlFor="file-upload" 
              className="block w-full cursor-pointer bg-white border border-[#cbd5e0] rounded-md px-4 py-2 text-sm text-[#4a5568] hover:bg-[#f7fafc] transition-colors overflow-hidden text-ellipsis"
            >
              <FileText className="inline-block mr-2 h-4 w-4" />
              <span>Выберите файл .txt</span>
            </label>
            <input
              type="file"
              id="file-upload"
              accept=".txt"
              onChange={handleFileUpload}
              className="sr-only"
            />
          </div>
          
          <Button 
            onClick={handleProcess} 
            className="bg-[#3182ce] hover:bg-[#2b6cb0] transition-colors"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Обработка...
              </>
            ) : 'Проверить'}
          </Button>
        </div>
      </div>

      {results && (
        <div className="space-y-6 animate-in fade-in-50 duration-300 mt-8">
          <div className="flex flex-wrap justify-between items-center border-b border-[#e2e8f0] pb-4">
            <div className="mb-4 sm:mb-0">
              <h3 className="text-xl font-medium text-[#2d3748]">Результаты проверки</h3>
              <p className="text-[#718096]">
                Обработано: {results.totalProcessed} | 
                Успешно: {results.successful} | 
                С ошибками: {results.failed}
              </p>
            </div>
            
            <Button 
              onClick={handleExport} 
              className="bg-[#38a169] hover:bg-[#2f855a] transition-colors"
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
