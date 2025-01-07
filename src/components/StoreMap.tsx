import React from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import { MapPin, Star, Clock } from 'lucide-react';

interface Store {
  id: string;
  name: string;
  address: string;
  distance: number;
  rating?: number;
  openNow?: boolean;
  location: google.maps.LatLng;
}

interface StoreMapProps {
  stores: Store[];
  center: { lat: number; lng: number };
}

const mapContainerStyle = {
  width: '100%',
  height: '400px'
};

export function StoreMap({ stores, center }: StoreMapProps) {
  const [selectedStore, setSelectedStore] = React.useState<Store | null>(null);
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyB04wesAACn02dcxcFLsJxsdaQjdyfnW6w'
  });

  if (!isLoaded) {
    return <div className="h-96 bg-gray-100 rounded-lg animate-pulse" />;
  }

  return (
    <div className="rounded-lg overflow-hidden shadow-lg">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={13}
      >
        {/* Current location marker */}
        <Marker
          position={center}
          icon={{
            path: google.maps.SymbolPath.CIRCLE,
            scale: 7,
            fillColor: '#3B82F6',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 2,
          }}
        />

        {/* Store markers */}
        {stores.map(store => (
          <Marker
            key={store.id}
            position={store.location}
            onClick={() => setSelectedStore(store)}
          />
        ))}

        {/* Info window for selected store */}
        {selectedStore && (
          <InfoWindow
            position={selectedStore.location}
            onCloseClick={() => setSelectedStore(null)}
          >
            <div className="p-2 max-w-xs">
              <h3 className="font-semibold">{selectedStore.name}</h3>
              <div className="flex items-center text-sm text-gray-600 mt-1">
                <MapPin className="w-3 h-3 mr-1" />
                <span>{selectedStore.address}</span>
              </div>
              <div className="flex items-center justify-between mt-2 text-sm">
                {selectedStore.rating && (
                  <div className="flex items-center">
                    <Star className="w-3 h-3 text-yellow-500 mr-1" />
                    <span>{selectedStore.rating}</span>
                  </div>
                )}
                {typeof selectedStore.openNow !== 'undefined' && (
                  <div className={`flex items-center ${selectedStore.openNow ? 'text-green-600' : 'text-red-600'}`}>
                    <Clock className="w-3 h-3 mr-1" />
                    <span>{selectedStore.openNow ? 'Open' : 'Closed'}</span>
                  </div>
                )}
              </div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
}