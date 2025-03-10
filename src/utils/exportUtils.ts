
import { BatchResults } from "../types";
import * as XLSX from "xlsx";

export const exportToExcel = (data: BatchResults, filename: string = "operator-check-results") => {
  try {
    // Create a new workbook
    const workbook = XLSX.utils.book_new();
    
    // Create first sheet with operator summary
    const operatorSummaryData = [
      ["Оператор", "Количество номеров", "Процент"]
    ];
    
    data.summary.forEach(item => {
      operatorSummaryData.push([
        item.operator, 
        item.count.toString(), // Convert number to string
        `${item.percentage.toFixed(2)}%`
      ]);
    });
    
    // Add totals row
    operatorSummaryData.push([
      "Итого", 
      data.successful.toString(), // Convert number to string
      "100%"
    ]);
    
    const operatorSummarySheet = XLSX.utils.aoa_to_sheet(operatorSummaryData);
    
    // Create second sheet with detailed results
    const detailedData = [
      ["Номер телефона", "Оператор", "Регион", "Прошлый оператор", "Ошибка"]
    ];
    
    data.results.forEach(result => {
      detailedData.push([
        result.phoneNumber,
        result.operator || "",
        result.region || "",
        result.old_operator || "",
        result.error || ""
      ]);
    });
    
    const detailedSheet = XLSX.utils.aoa_to_sheet(detailedData);
    
    // Add the sheets to the workbook
    XLSX.utils.book_append_sheet(workbook, operatorSummarySheet, "Операторы");
    XLSX.utils.book_append_sheet(workbook, detailedSheet, "Детализация");
    
    // Generate the Excel file and trigger download
    XLSX.writeFile(workbook, `${filename}.xlsx`);
    
    return true;
  } catch (error) {
    console.error("Error exporting to Excel:", error);
    return false;
  }
};
