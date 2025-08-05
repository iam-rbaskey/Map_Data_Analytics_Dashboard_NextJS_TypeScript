
import { format } from 'date-fns';

export async function fetchWeatherData(
  latitude: number,
  longitude: number,
  startDate: Date,
  endDate: Date,
  variable: string = 'temperature_2m'
): Promise<number[]> {
  const SDate = format(startDate, 'yyyy-MM-dd');
  const EDate = format(endDate, 'yyyy-MM-dd');

  const url = `https://archive-api.open-meteo.com/v1/archive?latitude=${latitude.toFixed(4)}&longitude=${longitude.toFixed(4)}&start_date=${SDate}&end_date=${EDate}&hourly=${variable}`;

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }
    const data = await response.json();
    return data?.hourly?.[variable] || [];
  } catch (error) {
    console.error('Failed to fetch weather data:', error);
    return [];
  }
}
