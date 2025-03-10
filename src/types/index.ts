
export interface PhoneData {
  code: string;
  num: string;
  full_num: string;
  operator: string;
  old_operator?: string;
  region: string;
}

export interface PhoneResult extends PhoneData {
  phoneNumber: string;
  error?: string;
}

export interface OperatorSummary {
  operator: string;
  count: number;
  percentage: number;
  color: string;
}

export interface BatchResults {
  results: PhoneResult[];
  summary: OperatorSummary[];
  totalProcessed: number;
  successful: number;
  failed: number;
}
