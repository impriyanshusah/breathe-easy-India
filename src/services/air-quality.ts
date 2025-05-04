/**
 * Represents Air Quality Index (AQI) data.
 */
export interface AQI {
  /**
   * The overall AQI value.
   */
  aqi: number;
  /**
   * Concentration of carbon monoxide in the air (in ppm).
   */
  co: number;
  /**
   * Concentration of ozone in the air (in ppm).
   */
  o3: number;
  /**
   * Concentration of nitrogen dioxide in the air (in ppm).
   */
  no2: number;
  /**
   * Concentration of sulfur dioxide in the air (in ppm).
   */
  so2: number;
  /**
   * Concentration of fine particulate matter (PM2.5) in the air (in μg/m³).
   */
  pm25: number;
  /**
   * Concentration of coarse particulate matter (PM10) in the air (in μg/m³).
   */
  pm10: number;
}

/**
 * Represents a city in India.
 */
export interface City {
  /**
   * The name of the city.
   */
  name: string;
  /**
   * The latitude of the city.
   */
  latitude: number;
  /**
   * The longitude of the city.
   */
  longitude: number;
}

/**
 * Asynchronously retrieves the current AQI data for a given city.
 *
 * @param city The city for which to retrieve AQI data.
 * @returns A promise that resolves to an AQI object containing pollutant levels and overall AQI.
 */
export async function getAirQualityIndex(city: City): Promise<AQI> {
  // TODO: Implement this by calling an API.

  return {
    aqi: 50,
    co: 1.2,
    o3: 45,
    no2: 10,
    so2: 5,
    pm25: 30,
    pm10: 60,
  };
}
