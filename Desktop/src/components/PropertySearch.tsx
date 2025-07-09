import React, { useState } from 'react';
import { propertyApi } from '../integrations/propertyApi';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Loader2, Home, DollarSign, Bed, Bath } from 'lucide-react';

interface PropertySearchProps {
  onPropertySelect?: (property: any) => void;
}

export const PropertySearch: React.FC<PropertySearchProps> = ({ onPropertySelect }) => {
  const [address, setAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [propertyData, setPropertyData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!address.trim()) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const data = await propertyApi.getPropertyInfo(address);
      setPropertyData(data);
      onPropertySelect?.(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch property data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          placeholder="Enter property address..."
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          className="flex-1"
        />
        <Button onClick={handleSearch} disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Home className="h-4 w-4" />}
          Search
        </Button>
      </div>

      {error && (
        <div className="text-red-600 text-sm p-2 bg-red-50 rounded">
          {error}
        </div>
      )}

      {propertyData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="h-5 w-5" />
              Property Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {propertyData.price && (
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Price</p>
                    <p className="font-semibold">${propertyData.price.toLocaleString()}</p>
                  </div>
                </div>
              )}
              
              {propertyData.bedrooms && (
                <div className="flex items-center gap-2">
                  <Bed className="h-4 w-4 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Bedrooms</p>
                    <p className="font-semibold">{propertyData.bedrooms}</p>
                  </div>
                </div>
              )}
              
              {propertyData.bathrooms && (
                <div className="flex items-center gap-2">
                  <Bath className="h-4 w-4 text-purple-600" />
                  <div>
                    <p className="text-sm text-gray-600">Bathrooms</p>
                    <p className="font-semibold">{propertyData.bathrooms}</p>
                  </div>
                </div>
              )}
              
              {propertyData.square_feet && (
                <div>
                  <p className="text-sm text-gray-600">Square Feet</p>
                  <p className="font-semibold">{propertyData.square_feet.toLocaleString()}</p>
                </div>
              )}
            </div>
            
            {propertyData.zestimate && (
              <div className="mt-4 p-3 bg-blue-50 rounded">
                <p className="text-sm text-blue-600">Estimated Value</p>
                <p className="text-lg font-bold text-blue-800">
                  ${propertyData.zestimate.toLocaleString()}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};