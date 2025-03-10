
import React, { useState } from 'react';
import { PhoneResult } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface ResultsDisplayProps {
  results: PhoneResult[];
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const filteredResults = results.filter(result => 
    result.phoneNumber.includes(searchTerm) ||
    (result.operator && result.operator.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (result.region && result.region.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredResults.length / itemsPerPage);
  const currentResults = filteredResults.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <Card className="telecom-card animate-fade-in">
      <CardHeader>
        <CardTitle className="text-xl">Детализация по номерам</CardTitle>
        <div className="relative mt-2">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-telecom-gray" size={18} />
          <Input
            type="text"
            placeholder="Поиск по номеру, оператору или региону..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1); // Reset to first page on search
            }}
            className="pl-10"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Номер телефона</TableHead>
                <TableHead>Оператор</TableHead>
                <TableHead>Регион</TableHead>
                <TableHead>Прошлый оператор</TableHead>
                <TableHead>Статус</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentResults.length > 0 ? (
                currentResults.map((result, index) => (
                  <TableRow key={index} className="hover:bg-telecom-ultraLight">
                    <TableCell className="font-medium">+{result.full_num || result.phoneNumber}</TableCell>
                    <TableCell>{result.operator || "—"}</TableCell>
                    <TableCell>{result.region || "—"}</TableCell>
                    <TableCell>{result.old_operator || "—"}</TableCell>
                    <TableCell>
                      {result.error ? (
                        <span className="text-red-500">{result.error}</span>
                      ) : (
                        <span className="text-green-600">Успешно</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    {searchTerm ? "Нет результатов по запросу" : "Нет данных для отображения"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center mt-4">
            <div className="flex space-x-1">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 rounded-md border border-telecom-lightGray disabled:opacity-50"
              >
                &lt;
              </button>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                // Calculate the page numbers to display
                let pageNum = i + 1;
                if (totalPages > 5) {
                  if (currentPage > 3) {
                    pageNum = currentPage - 3 + i;
                  }
                  if (currentPage > totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  }
                }
                
                if (pageNum <= totalPages) {
                  return (
                    <button
                      key={i}
                      onClick={() => handlePageChange(pageNum)}
                      className={`px-3 py-1 rounded-md ${
                        pageNum === currentPage
                          ? "bg-telecom-blue text-white"
                          : "border border-telecom-lightGray"
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                }
                return null;
              })}
              
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 rounded-md border border-telecom-lightGray disabled:opacity-50"
              >
                &gt;
              </button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ResultsDisplay;
