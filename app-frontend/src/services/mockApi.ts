import { SearchParams, ApiResponse, SunData } from '../types';

// Mock data to simulate API responses while the backend is being developed
const generateMockData = async (params: SearchParams): Promise<SunData[]> => {

  console.log('params', params)

  const { startDate, endDate, location} = params;
  
  // const start = new Date(startDate);
  // const end = new Date(endDate);
  const days: { date: string; sunrise: string; sunset: string; golden_hour: string; }[] = [];


  try {
    const params = { city: location,  startDate: startDate, endDate: endDate}; // Ejemplo de parámetros
    const query = new URLSearchParams(params).toString();

    // Realiza la solicitud fetch
    const response = await fetch(`http://localhost:4567/sun?${query}`);
    
    if (!response.ok) {
      const text = await response.text();
      console.error(`API error: ${text}`);
      return [];
    }

    const data = await response.json();
    
    // Procesar los datos recibidos de la API
    data.sun.forEach((day: any) => {
      const sunrise = day.sun_data.sunrise.split('T')[1].substring(0, 5);
      const sunset = day.sun_data.sunset.split('T')[1].substring(0, 5);
      const goldenHour = day.sun_data.civil_twilight_end.split('T')[1].substring(0, 5); // o usa solar_noon si prefieres

      days.push({
        date: day.date,
        sunrise,
        sunset,
        golden_hour: goldenHour,
      });
    });

    console.log(days);

    return days;



  } catch (error) {
    console.error('Network or server error', error);
    return [];
  }
  
};

/**
 * Call data
 * 
 * @param params 
 * @returns 
 */
export const mockApiCall = async (params: SearchParams): Promise<ApiResponse> => {
  
  // Check for error conditions
  if (!params.location || !params.startDate || !params.endDate) {
    return {
      success: false,
      error: 'All fields are required',
    };
  }
  
  /**
   * Generate mock data or connect with API
   */
  const data = await generateMockData(params);

  return {
    success: true,
    data,
  };
};