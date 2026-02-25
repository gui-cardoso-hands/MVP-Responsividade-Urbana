import axios from 'axios';

export interface LocationData {
  lat: number;
  lon: number;
  display_name: string;
}

export const geocodeLocation = async (query: string): Promise<LocationData | null> => {
  try {
    // Check if it looks like a CEP (xxxxx-xxx or xxxxxxxx)
    const cepRegex = /^(\d{5})-?(\d{3})$/;
    const isCep = cepRegex.test(query);

    let searchQuery = query;

    if (isCep) {
      // Optional: Enhance CEP search by fetching address first via ViaCEP
      // This is often more accurate for Brazil than sending raw CEP to Nominatim
      try {
        const cleanCep = query.replace(/\D/g, '');
        const viaCepResponse = await axios.get(`https://viacep.com.br/ws/${cleanCep}/json/`);
        if (!viaCepResponse.data.erro) {
          const { logradouro, localidade, uf } = viaCepResponse.data;
          searchQuery = `${logradouro}, ${localidade} - ${uf}, Brasil`;
        }
      } catch (e) {
        console.warn('ViaCEP failed, falling back to raw query', e);
      }
    }

    // Use Nominatim for geocoding
    const response = await axios.get('https://nominatim.openstreetmap.org/search', {
      params: {
        q: searchQuery,
        format: 'json',
        limit: 1,
        countrycodes: 'br', // Limit to Brazil as requested
      },
      headers: {
        'User-Agent': 'MinimalistMapApp/1.0'
      }
    });

    if (response.data && response.data.length > 0) {
      const result = response.data[0];
      return {
        lat: parseFloat(result.lat),
        lon: parseFloat(result.lon),
        display_name: result.display_name
      };
    }
    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
};

export const reverseGeocodeLocation = async (lat: number, lon: number): Promise<LocationData | null> => {
  try {
    const response = await axios.get('https://nominatim.openstreetmap.org/reverse', {
      params: {
        lat,
        lon,
        format: 'json',
      },
      headers: {
        'User-Agent': 'MinimalistMapApp/1.0'
      }
    });

    if (response.data) {
      return {
        lat: parseFloat(response.data.lat),
        lon: parseFloat(response.data.lon),
        display_name: response.data.display_name
      };
    }
    return null;
  } catch (error) {
    console.error('Reverse geocoding error:', error);
    return null;
  }
};
