
import { PhoneData, PhoneResult, BatchResults, OperatorSummary } from "../types";

// Generate a color based on the operator name (consistent colors for same operators)
const getColorForOperator = (operator: string): string => {
  const colors = [
    '#3366CC', '#DC3912', '#FF9900', '#109618', '#990099',
    '#0099C6', '#DD4477', '#66AA00', '#B82E2E', '#316395'
  ];
  
  // Simple hash function to get consistent colors
  let hash = 0;
  for (let i = 0; i < operator.length; i++) {
    hash = operator.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const index = Math.abs(hash) % colors.length;
  return colors[index];
};

// Format phone number to proper format
const formatPhoneNumber = (number: string): string => {
  // Remove all non-digit characters
  let cleaned = number.replace(/\D/g, '');
  
  // Make sure it has the country code
  if (cleaned.length === 10) {
    cleaned = '7' + cleaned;
  } else if (cleaned.length === 11 && cleaned.startsWith('8')) {
    cleaned = '7' + cleaned.substring(1);
  }
  
  return cleaned;
};

// Check if the phone number is valid
const isValidPhoneNumber = (number: string): boolean => {
  const cleaned = formatPhoneNumber(number);
  return cleaned.length === 11 && (cleaned.startsWith('7') || cleaned.startsWith('8'));
};

// Get data for a single phone number
export const getPhoneData = async (phoneNumber: string): Promise<PhoneResult> => {
  try {
    const formattedNumber = formatPhoneNumber(phoneNumber);
    
    if (!isValidPhoneNumber(phoneNumber)) {
      return {
        phoneNumber,
        code: '',
        num: '',
        full_num: '',
        operator: '',
        region: '',
        error: 'Неверный формат номера'
      };
    }
    
    // Using a CORS proxy to bypass CORS restrictions
    const corsProxy = 'https://corsproxy.io/?';
    const apiUrl = `https://num.voxlink.ru/get/?num=${formattedNumber}`;
    const response = await fetch(corsProxy + encodeURIComponent(apiUrl));
    
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    
    const data: PhoneData = await response.json();
    
    return {
      ...data,
      phoneNumber: phoneNumber
    };
  } catch (error) {
    console.error("Error fetching phone data:", error);
    return {
      phoneNumber,
      code: '',
      num: '',
      full_num: '',
      operator: '',
      region: '',
      error: error instanceof Error ? error.message : 'Ошибка при получении данных'
    };
  }
};

// Process batch of phone numbers
export const processBatchNumbers = async (phoneNumbers: string[]): Promise<BatchResults> => {
  const results: PhoneResult[] = [];
  const operatorMap = new Map<string, number>();
  let successful = 0;
  let failed = 0;
  
  // Process each phone number
  for (const phoneNumber of phoneNumbers) {
    const result = await getPhoneData(phoneNumber.trim());
    results.push(result);
    
    if (result.error) {
      failed++;
    } else {
      successful++;
      // Count operators for summary
      const operator = result.operator;
      operatorMap.set(operator, (operatorMap.get(operator) || 0) + 1);
    }
  }
  
  // Create operator summary with percentages
  const summary: OperatorSummary[] = Array.from(operatorMap.entries())
    .map(([operator, count]) => ({
      operator,
      count,
      percentage: (count / successful) * 100,
      color: getColorForOperator(operator)
    }))
    .sort((a, b) => b.count - a.count); // Sort by count descending
  
  return {
    results,
    summary,
    totalProcessed: phoneNumbers.length,
    successful,
    failed
  };
};

// Parse phone numbers from a text file
export const parsePhoneNumbersFromText = (text: string): string[] => {
  // Split by common delimiters and filter out empty strings
  return text
    .split(/[\n,;\s]+/)
    .map(num => num.trim())
    .filter(num => num.length > 0);
};
