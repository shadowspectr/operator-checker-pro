import { PhoneData, PhoneResult, BatchResults, OperatorSummary } from "../types";

const API_URL = "http://localhost:3000/proxy/phone";
const REQUESTS_PER_SECOND = 5; // Лимит запросов в секунду

const getColorForOperator = (operator: string): string => {
  const colors = ["#3366CC", "#DC3912", "#FF9900", "#109618", "#990099", "#0099C6", "#DD4477", "#66AA00", "#B82E2E", "#316395"];
  let hash = 0;
  for (let i = 0; i < operator.length; i++) {
    hash = operator.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
};

const formatPhoneNumber = (number: string): string => {
  const cleaned = number.replace(/\D/g, "");
  if (cleaned.length === 10) return "+7" + cleaned;
  if (cleaned.length === 11 && (cleaned.startsWith("7") || cleaned.startsWith("8"))) return "+7" + cleaned.slice(1);
  return cleaned;
};

const isValidPhoneNumber = (number: string): boolean => {
  const cleaned = formatPhoneNumber(number);
  return cleaned.length === 12 && cleaned.startsWith("+7");
};

// The 'getPhoneData' function is now exported
export const getPhoneData = async (phoneNumber: string): Promise<PhoneResult> => {
  try {
    const formattedNumber = formatPhoneNumber(phoneNumber);
    if (!isValidPhoneNumber(phoneNumber)) {
      return { phoneNumber, code: "", num: "", full_num: "", operator: "", region: "", error: "Неверный формат номера" };
    }
    const response = await fetch(`${API_URL}?num=${formattedNumber}`);
    if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
    const data: PhoneData = await response.json();
    return { ...data, phoneNumber };
  } catch (error) {
    return { phoneNumber, code: "", num: "", full_num: "", operator: "", region: "", error: error instanceof Error ? error.message : "Ошибка" };
  }
};

// Убираем многопоточность и обрабатываем запросы последовательно
export const processBatchNumbers = async (phoneNumbers: string[]): Promise<BatchResults> => {
  const results: PhoneResult[] = [];
  const operatorMap = new Map<string, number>();
  let successful = 0;
  let failed = 0;

  for (const phoneNumber of phoneNumbers) {
    const result = await getPhoneData(phoneNumber);
    results.push(result);
    if (result.error) {
      failed++;
    } else {
      successful++;
      operatorMap.set(result.operator, (operatorMap.get(result.operator) || 0) + 1);
    }
    // Задержка между запросами для соблюдения лимита запросов в секунду
    await new Promise(res => setTimeout(res, 1000 / REQUESTS_PER_SECOND));
  }

  const summary: OperatorSummary[] = Array.from(operatorMap.entries())
      .map(([operator, count]) => ({ operator, count, percentage: (count / successful) * 100, color: getColorForOperator(operator) }))
      .sort((a, b) => b.count - a.count);

  return { results, summary, totalProcessed: phoneNumbers.length, successful, failed };
};

export const parsePhoneNumbersFromText = (text: string): string[] => {
  return text.split(/[\n,;\s]+/).map(num => num.trim()).filter(num => num.length > 0);
};
