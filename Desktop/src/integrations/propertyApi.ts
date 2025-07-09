const API_BASE_URL = 'http://127.0.0.1:8000';

interface PropertyData {
  address: string;
  price?: number;
  bedrooms?: number;
  bathrooms?: number;
  square_feet?: number;
  zestimate?: number;
  neighborhood?: string;
  zillow_id?: string;
  status?: string;
  error?: string;
}

interface MarketAnalysis {
  location: string;
  average_price: number;
  price_trends: any[];
  inventory_levels: number;
  days_on_market: number;
}

interface PropertyComparison {
  properties: PropertyData[];
  comparison_metrics: any;
}

class PropertyApiService {
  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const defaultOptions: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
      },
    };
    
    const response = await fetch(url, { ...defaultOptions, ...options });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  }

  private async makeBotRequest<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return response.json();
    } catch (error) {
      console.error('Bot API request failed:', error);
      throw error;
    }
  }

  // Main property information endpoint
  async getPropertyInfo(address: string): Promise<PropertyData> {
    const encodedAddress = encodeURIComponent(address);
    return this.makeRequest<PropertyData>(`/api/property/bot/property-info/${encodedAddress}`, {
      method: 'GET',
    });
  }

  // Zillow-specific data
  async getZillowData(address: string): Promise<any> {
    const encodedAddress = encodeURIComponent(address);
    return this.makeRequest<any>(`/api/property/bot/zillow/${encodedAddress}`, {
      method: 'GET',
    });
  }

  // Market analysis for a location
  async getMarketAnalysis(
    location: string,
    propertyType: string = 'single-family'
  ): Promise<MarketAnalysis> {
    return this.makeRequest<MarketAnalysis>(
      `/market-analysis/${encodeURIComponent(location)}?property_type=${propertyType}`
    );
  }

  async compareProperties(addresses: string[]): Promise<PropertyComparison> {
    return this.makeRequest<PropertyComparison>('/compare', {
      method: 'POST',
      body: JSON.stringify(addresses),
    });
  }

  // Bot-specific methods (no authentication required)
  async getBotPropertyInfo(address: string): Promise<PropertyData> {
    try {
      const encodedAddress = encodeURIComponent(address);
      const response = await fetch(`${API_BASE_URL}/api/property/bot/property-info/${encodedAddress}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Property API request failed:', error);
      return { address, error: 'Failed to fetch property data' };
    }
  }

  async getBotZillowData(address: string): Promise<any> {
    return this.makeBotRequest<any>(`/bot/zillow/${encodeURIComponent(address)}`);
  }

  async searchProperties(address: string): Promise<any> {
    return this.makeBotRequest<any>(`/bot/search/${encodeURIComponent(address)}`);
  }
}

export const propertyApi = new PropertyApiService();

// Legacy function for backward compatibility
export const getPropertyInfo = async (address: string) => {
  return propertyApi.getPropertyInfo(address);
};

export type { PropertyData, MarketAnalysis, PropertyComparison };