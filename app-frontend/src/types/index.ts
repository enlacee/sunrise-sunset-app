export interface SunData {
  date: string;
  sunrise: string;
  sunset: string;
  golden_hour: string;
  day_length?: string;
}

export interface SearchParams {
  location: string;
  startDate: string;
  endDate: string;
}

export interface ApiResponse {
  success: boolean;
  data?: SunData[];
  error?: string;
}