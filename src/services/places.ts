import axios from 'axios';

export type Category = 'Saúde' | 'Educação' | 'Lazer' | 'Transporte';

export interface Place {
  id: string;
  lat: number;
  lon: number;
  name: string;
  category: Category;
  type: string;
}

const OVERPASS_API_URL = 'https://overpass-api.de/api/interpreter';

// Optimized query:
// 1. Increased timeout to 45s
// 2. Used 'nwr' (node, way, relation) to reduce query lines
// 3. Consolidated amenity regex
const createQuery = (lat: number, lon: number, radius: number) => `
  [out:json][timeout:45];
  (
    nwr["amenity"~"^(hospital|clinic|pharmacy|doctors|dentist|school|university|college|kindergarten|library|cinema|theatre|bus_station)$"](around:${radius},${lat},${lon});
    nwr["leisure"~"^(park|sports_centre|stadium)$"](around:${radius},${lat},${lon});
    nwr["tourism"~"^(museum)$"](around:${radius},${lat},${lon});
    nwr["public_transport"="station"](around:${radius},${lat},${lon});
    nwr["railway"~"^(station|subway_entrance)$"](around:${radius},${lat},${lon});
    nwr["highway"="bus_stop"](around:${radius},${lat},${lon});
  );
  out center;
`;

const getCategory = (tags: any): Category | null => {
  if (['hospital', 'clinic', 'pharmacy', 'doctors', 'dentist'].includes(tags.amenity)) return 'Saúde';
  if (['school', 'university', 'college', 'kindergarten', 'library'].includes(tags.amenity)) return 'Educação';
  if (['park', 'sports_centre', 'stadium'].includes(tags.leisure) || 
      ['cinema', 'theatre'].includes(tags.amenity) || 
      ['museum'].includes(tags.tourism)) return 'Lazer';
  if (tags.public_transport === 'station' || 
      tags.amenity === 'bus_station' || 
      tags.highway === 'bus_stop' ||
      ['station', 'subway_entrance'].includes(tags.railway)) return 'Transporte';
  return null;
};

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const fetchNearbyPlaces = async (lat: number, lon: number, radius: number = 1000, retries = 2): Promise<Place[]> => {
  try {
    const response = await axios.post(OVERPASS_API_URL, createQuery(lat, lon, radius), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      timeout: 50000 // Client side timeout slightly larger than server timeout
    });

    const elements = response.data.elements;
    if (!elements) return [];

    const places: Place[] = [];
    const seenIds = new Set<string>();
    const seenNames = new Set<string>();

    for (const el of elements) {
      const tags = el.tags || {};
      let name = tags.name;
      
      // Allow unnamed bus stops, label them as "Ponto de Ônibus"
      if (!name && tags.highway === 'bus_stop') {
        name = 'Ponto de Ônibus';
      }
      
      if (!name) continue;

      const category = getCategory(tags);
      if (!category) continue;

      if (seenIds.has(el.id)) continue;
      seenIds.add(el.id);

      const uniqueKey = `${name.toLowerCase()}|${category}`;
      if (seenNames.has(uniqueKey)) continue;
      seenNames.add(uniqueKey);

      places.push({
        id: el.id,
        lat: el.lat || el.center?.lat,
        lon: el.lon || el.center?.lon,
        name: name,
        category: category,
        type: tags.amenity || tags.leisure || tags.tourism || tags.railway || 'unknown'
      });
    }

    return places;
  } catch (error: any) {
    // Retry logic for 504 (Gateway Timeout) or 429 (Too Many Requests)
    if (retries > 0 && (error.response?.status === 504 || error.response?.status === 429 || error.code === 'ECONNABORTED')) {
      console.warn(`Overpass API failed with ${error.response?.status || error.code}. Retrying... (${retries} attempts left)`);
      await wait(2000); // Wait 2s before retry
      return fetchNearbyPlaces(lat, lon, radius, retries - 1);
    }
    
    console.error('Error fetching places:', error);
    return [];
  }
};
