import React from 'react';
import { Store } from '../types';
import { MapPin, Navigation } from 'lucide-react';

interface StoreListProps {
  stores: Store[];
}

export function StoreList({ stores }: StoreListProps) {
  return (
    <div className="space-y-4">
      {stores.map((store) => (
        <div key={store.id} className="bg-white rounded-lg shadow-md p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <MapPin className="text-blue-600" />
              <div>
                <h3 className="font-semibold text-lg">{store.name}</h3>
                <p className="text-gray-600 text-sm">{store.address}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Navigation className="text-gray-400 w-4 h-4" />
              <span className="text-gray-600">{store.distance.toFixed(1)} mi</span>
            </div>
          </div>
          
          <div className="mt-4">
            <h4 className="font-medium text-sm text-gray-700 mb-2">Available Items</h4>
            <div className="grid grid-cols-2 gap-3">
              {store.items.map((item) => (
                <div key={item.id} className="bg-gray-50 p-2 rounded">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">{item.name}</span>
                    <span className="font-medium">${item.price.toFixed(2)}/{item.unit}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    Updated: {new Date(item.lastUpdated).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}