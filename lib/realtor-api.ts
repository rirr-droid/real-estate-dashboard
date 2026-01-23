/**
 * Realtor.com API Integration via RapidAPI
 *
 * Get your API key at: https://rapidapi.com/apidojo/api/realtor/
 * Free tier: 500 requests/month
 * Basic tier: $10/month for 10,000 requests
 */

export interface RealtorProperty {
  property_id: string;
  listing_id: string;
  prop_type: string;
  address: {
    line: string;
    street_name: string;
    street_number: string;
    city: string;
    state_code: string;
    postal_code: string;
    coordinate: {
      lat: number;
      lon: number;
    };
  };
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  lot_sqft?: number;
  year_built: number;
  days_on_market?: number;
  list_price_min?: number;
  list_price_max?: number;
  price_per_sqft: number;
  photos?: Array<{ href: string }>;
  description?: string;
  permalink?: string;
}

export interface RealtorSearchParams {
  city?: string;
  state_code?: string;
  limit?: number;
  offset?: number;
  price_min?: number;
  price_max?: number;
  beds_min?: number;
  baths_min?: number;
  sqft_min?: number;
  sqft_max?: number;
  type?: string; // 'single_family' | 'condo' | 'townhomes' | 'multi_family'
  sort?: string; // 'price_low' | 'price_high' | 'newest' | 'relevance'
}

const RAPIDAPI_KEY = process.env.NEXT_PUBLIC_RAPIDAPI_KEY;
const RAPIDAPI_HOST = 'realtor.p.rapidapi.com';

export async function searchRealtorProperties(
  params: RealtorSearchParams
): Promise<{ properties: RealtorProperty[]; total: number }> {

  if (!RAPIDAPI_KEY) {
    throw new Error('NEXT_PUBLIC_RAPIDAPI_KEY is not set. Please add it to .env.local');
  }

  // Build query string
  const queryParams = new URLSearchParams();

  if (params.city) queryParams.append('city', params.city);
  if (params.state_code) queryParams.append('state_code', params.state_code);
  queryParams.append('limit', String(params.limit || 50));
  queryParams.append('offset', String(params.offset || 0));

  if (params.price_min) queryParams.append('price_min', String(params.price_min));
  if (params.price_max) queryParams.append('price_max', String(params.price_max));
  if (params.beds_min) queryParams.append('beds_min', String(params.beds_min));
  if (params.baths_min) queryParams.append('baths_min', String(params.baths_min));
  if (params.sqft_min) queryParams.append('sqft_min', String(params.sqft_min));
  if (params.sqft_max) queryParams.append('sqft_max', String(params.sqft_max));
  if (params.type) queryParams.append('type', params.type);
  if (params.sort) queryParams.append('sort', params.sort);

  const url = `https://${RAPIDAPI_HOST}/properties/v2/list-for-sale?${queryParams.toString()}`;

  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': RAPIDAPI_KEY,
        'X-RapidAPI-Host': RAPIDAPI_HOST
      }
    });

    if (!response.ok) {
      throw new Error(`Realtor API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    return {
      properties: data.properties || [],
      total: data.total || 0
    };
  } catch (error) {
    console.error('Error fetching from Realtor API:', error);
    throw error;
  }
}

/**
 * Convert Realtor API property to our internal Property format
 */
export function convertRealtorToProperty(realtorProp: RealtorProperty, metroData: { medianPrice: number; avgPricePerSqft: number; avgDaysOnMarket: number }) {
  return {
    id: realtorProp.property_id || realtorProp.listing_id,
    address: realtorProp.address.line,
    city: realtorProp.address.city,
    state: realtorProp.address.state_code,
    zipCode: realtorProp.address.postal_code,
    metroId: realtorProp.address.city.toLowerCase().replace(/\s+/g, '-'),
    metroName: realtorProp.address.city,

    propertyType: mapPropertyType(realtorProp.prop_type),
    price: realtorProp.price,
    bedrooms: realtorProp.beds,
    bathrooms: realtorProp.baths,
    sqft: realtorProp.sqft,
    lotSize: realtorProp.lot_sqft,
    yearBuilt: realtorProp.year_built,

    pricePerSqft: realtorProp.price_per_sqft,
    daysOnMarket: realtorProp.days_on_market || 0,
    priceReductions: 0, // Not available from API
    lastPriceReduction: undefined,

    avgPricePerSqftInArea: metroData.avgPricePerSqft,
    avgDaysOnMarketInArea: metroData.avgDaysOnMarket,
    medianPriceInArea: metroData.medianPrice,

    dealScore: 0, // Will be calculated

    listingUrl: realtorProp.permalink || `https://www.realtor.com/realestateandhomes-detail/${realtorProp.property_id}`,
    imageUrl: realtorProp.photos?.[0]?.href,
    description: realtorProp.description || '',

    latitude: realtorProp.address.coordinate?.lat || 0,
    longitude: realtorProp.address.coordinate?.lon || 0
  };
}

function mapPropertyType(realtorType: string): "single-family" | "townhome" | "condo" | "multi-family" {
  const type = realtorType.toLowerCase();
  if (type.includes('condo')) return 'condo';
  if (type.includes('townhome') || type.includes('townhouse')) return 'townhome';
  if (type.includes('multi') || type.includes('duplex')) return 'multi-family';
  return 'single-family';
}

/**
 * Get API usage stats
 */
export async function getAPIUsageStats() {
  // RapidAPI includes usage in response headers
  // You can track this on your RapidAPI dashboard
  return {
    message: 'Check your usage at: https://rapidapi.com/developer/dashboard'
  };
}
