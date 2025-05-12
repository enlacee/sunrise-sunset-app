export const calculateDaylight = (sunrise: string, sunset: string): string => {
  try {
    const [sunriseHours, sunriseMinutes] = sunrise.split(':').map(Number);
    const [sunsetHours, sunsetMinutes] = sunset.split(':').map(Number);
    
    let daylightHours = sunsetHours - sunriseHours;
    let daylightMinutes = sunsetMinutes - sunriseMinutes;
    
    if (daylightMinutes < 0) {
      daylightHours -= 1;
      daylightMinutes += 60;
    }
    
    return `${daylightHours}h ${daylightMinutes}m`;
  } catch (e) {
    return 'N/A';
  }
};

export const formatTime12Hour = (time24: string): string => {
  try {
    const [hours, minutes] = time24.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12;
    
    return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
  } catch (e) {
    return time24;
  }
};