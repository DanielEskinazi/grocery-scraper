import React from 'react';
import { GoogleMap, useJsApiLoader, Marker, DirectionsRenderer } from '@react-google-maps/api';
import { StoreTotal } from '../types';

interface RouteMapProps {
  stores: StoreTotal[];
}

const mapContainerStyle = {
  width: '100%',
  height: '400px'
};

const defaultCenter = {
  lat: 40.7128,
  lng: -74.0060
};

export function RouteMap({ stores }: RouteMapProps) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyB04wesAACn02dcxcFLsJxsdaQjdyfnW6w'
  });

  const [directions, setDirections] = React.useState<google.maps.DirectionsResult | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [markers, setMarkers] = React.useState<Array<{ lat: number; lng: number }>>([]);
  const [mapCenter, setMapCenter] = React.useState(defaultCenter);

  React.useEffect(() => {
    if (!isLoaded || stores.length === 0) return;

    const geocoder = new google.maps.Geocoder();
    
    // Geocode all store addresses
    Promise.all(stores.map(store => 
      new Promise<google.maps.LatLngLiteral>((resolve, reject) => {
        geocoder.geocode({ address: store.address }, (results, status) => {
          if (status === 'OK' && results?.[0]?.geometry?.location) {
            const location = results[0].geometry.location;
            resolve({ lat: location.lat(), lng: location.lng() });
          } else {
            reject(new Error(`Geocoding failed for ${store.address}`));
          }
        });
      })
    )).then(locations => {
      setMarkers(locations);
      // Center map on first store
      if (locations.length > 0) {
        setMapCenter(locations[0]);
      }
      
      // Try to get directions
      const directionsService = new google.maps.DirectionsService();
      const waypoints = stores.slice(1, -1).map(store => ({
        location: store.address,
        stopover: true
      }));

      directionsService.route({
        origin: stores[0].address,
        destination: stores[stores.length - 1].address,
        waypoints,
        optimizeWaypoints: true,
        travelMode: google.maps.TravelMode.DRIVING,
      }, (result, status) => {
        if (status === 'OK') {
          setDirections(result);
          setError(null);
        } else {
          setDirections(null);
          setError('Unable to find a driving route between these locations');
        }
      });
    }).catch(err => {
      setError('Unable to locate some stores on the map');
      setDirections(null);
    });
  }, [isLoaded, stores]);

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-yellow-700">
          {error}
        </div>
      )}
      <div className="rounded-lg overflow-hidden shadow-lg">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={mapCenter}
          zoom={12}
        >
          {directions ? (
            <DirectionsRenderer
              directions={directions}
              options={{
                suppressMarkers: false,
                polylineOptions: {
                  strokeColor: '#2563eb',
                  strokeWeight: 5,
                },
              }}
            />
          ) : (
            markers.map((position, index) => (
              <Marker
                key={stores[index].storeId}
                position={position}
                label={(index + 1).toString()}
              />
            ))
          )}
        </GoogleMap>
      </div>
    </div>
  );
}