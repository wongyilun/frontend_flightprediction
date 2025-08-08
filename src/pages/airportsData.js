import Papa from 'papaparse';
import airportsCsv from './airports.csv';

export const loadAirportsData = () => {
  return new Promise((resolve, reject) => {
    Papa.parse(airportsCsv, {
      download: true,
      header: true,
      complete: (results) => {
        resolve(results.data);
      },
      error: (error) => {
        reject(error);
      },
    });
  });
};

export const formatDataForAutosuggest = (data) => {
  return data.map(item => ({
    label: `${item.name} (${item.iata_code}) - ${item.city}, ${item.country}`,
    value: item.iata_code,
    name: item.name,
    city: item.city,
    country: item.country
  }));
};
