import React, { useState, useEffect } from 'react';
import { useGeolocation } from '../hooks/useGeolocation';
import { RadiusControl } from './RadiusControl';
import { StoreMap } from './StoreMap';
import { MapPin, Clock, Star } from 'lucide-react';
import { Loader } from '@googlemaps/js-api-loader';

interface Store {
  id: string;
  name: string;
  address: string;
  distance: number;
  rating?: number;
  openNow?: boolean;
  types: string[];
  location: google.maps.LatLng;
}

const loader = new Loader({
  apiKey: 'AIzaSyB04wesAACn02dcxcFLsJxsdaQjdyfnW6w',
  version: 'weekly',
  libraries: ['places', 'geometry']
});

export function StoreFinder() {
  const { latitude, longitude, error, loading } = useGeolocation();
  const [radius, setRadius] = useState(1);
  const [stores, setStores] = useState<Store[]>([]);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (loading || error || !latitude || !longitude) return;

    async function searchNearbyStores() {
      try {
        setIsLoading(true);
        const google = await loader.load();
        const service = new google.maps.places.PlacesService(document.createElement('div'));
        
        const request = {
          location: { lat: latitude, lng: longitude },
          radius: radius * 1000, // Convert km to meters
          type: 'store'
        };

        service.nearbySearch(request, (results, status) => {
          if (status === google.maps.places.PlacesServiceStatus.OK && results) {
            const mappedStores = results.map(place => ({
              id: place.place_id!,
              name: place.name!,
              address: place.vicinity!,
              location: place.geometry!.location!,
              distance: google.maps.geometry.spherical.computeDistanceBetween(
                new google.maps.LatLng(latitude, longitude),
                place.geometry!.location!
              ) / 1000, // Convert meters to km
              rating: place.rating,
              openNow: place.opening_hours?.isOpen(),
              types: place.types || []
            }));
            setStores(mappedStores.sort((a, b) => a.distance - b.distance));
            setSearchError(null);
          } else {
            setSearchError('No stores found nearby');
            setStores([]);
          }
          setIsLoading(false);
        });
      } catch (err) {
        setSearchError('Failed to load store data');
        setIsLoading(false);
      }
    }

    searchNearbyStores();
  }, [latitude, longitude, radius]);

  if (loading || isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <RadiusControl value={radius} onChange={setRadius} />
      
      {latitude && longitude && (
        <StoreMap
          stores={stores}
          center={{ lat: latitude, lng: longitude }}
        />
      )}
      
      {searchError ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-700">
          {searchError}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {stores.map(store => (
            <div key={store.id} className="bg-white rounded-lg shadow-md p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg">{store.name}</h3>
                  <div className="flex items-center text-sm text-gray-600 mt-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{store.address}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {store.rating && (
                    <div className="flex items-center bg-yellow-50 px-2 py-1 rounded">
                      <Star className="w-4 h-4 text-yellow-500 mr-1" />
                      <span className="text-sm font-medium">{store.rating}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="mt-3 flex items-center justify-between text-sm">
                <span className="text-gray-600">{store.distance.toFixed(1)}km away</span>
                {typeof store.openNow !== 'undefined' && (
                  <div className={`flex items-center ${store.openNow ? 'text-green-600' : 'text-red-600'}`}>
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{store.openNow ? 'Open' : 'Closed'}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}