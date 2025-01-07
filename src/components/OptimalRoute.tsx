import React from 'react';
import { Item } from '../types';
import { MapPin, Navigation, ArrowRight } from 'lucide-react';
import { RouteMap } from './RouteMap';

interface OptimalRouteProps {
  items: Item[];
}

export interface StoreTotal {
  storeId: string;
  storeName: string;
  address: string;
  distance: number;
  items: Array<{
    name: string;
    price: number;
  }>;
  total: number;
}

export function OptimalRoute({ items }: OptimalRouteProps) {
  // Group items by store and calculate totals
  const storeMap = new Map<string, StoreTotal>();
  
  items.forEach(item => {
    if (!item.stores?.length) return;
    
    const cheapestStore = [...item.stores].sort((a, b) => a.price - b.price)[0];
    
    if (!storeMap.has(cheapestStore.storeId)) {
      storeMap.set(cheapestStore.storeId, {
        storeId: cheapestStore.storeId,
        storeName: cheapestStore.storeName,
        address: cheapestStore.address,
        distance: cheapestStore.distance,
        items: [],
        total: 0
      });
    }
    
    const storeData = storeMap.get(cheapestStore.storeId)!;
    storeData.items.push({
      name: item.name,
      price: cheapestStore.price
    });
    storeData.total += cheapestStore.price;
  });

  // Sort stores by distance to create route
  const route = Array.from(storeMap.values()).sort((a, b) => a.distance - b.distance);
  const totalCost = route.reduce((sum, store) => sum + store.total, 0);

  return (
    <div className="space-y-6">
      <RouteMap stores={route} />
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Optimal Shopping Route</h2>
        <div className="space-y-6">
          {route.map((store, index) => (
            <div key={store.storeId} className="relative">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-semibold">{index + 1}</span>
                </div>
                <div className="flex-grow">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold">{store.storeName}</h3>
                    <span className="text-lg font-semibold text-blue-600">
                      ${store.total.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600 mt-1">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span>{store.address}</span>
                    <span className="mx-2">•</span>
                    <Navigation className="w-4 h-4 mr-1" />
                    <span>{store.distance.toFixed(1)} mi</span>
                  </div>
                  <div className="mt-3 pl-4 border-l-2 border-gray-200">
                    <ul className="space-y-2">
                      {store.items.map((item, itemIndex) => (
                        <li key={itemIndex} className="flex justify-between text-sm">
                          <span>{item.name}</span>
                          <span className="text-gray-600">${item.price.toFixed(2)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              {index < route.length - 1 && (
                <div className="absolute left-4 top-full h-8">
                  <div className="h-full border-l-2 border-dashed border-gray-300"></div>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">Total Cost:</span>
            <span className="text-2xl font-bold text-blue-600">${totalCost.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}