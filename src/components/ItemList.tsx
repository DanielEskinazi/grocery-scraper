import React, { useState } from 'react';
import { Item } from '../types';
import { MapPin, ShoppingCart, Clock, ChevronDown, ChevronUp } from 'lucide-react';

interface ItemListProps {
  items: Item[];
}

export function ItemList({ items }: ItemListProps) {
  const [expandedItems, setExpandedItems] = useState<Record<string, string | null>>({});

  const toggleStore = (itemId: string, storeId: string | null) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: prev[itemId] === storeId ? null : storeId
    }));
  };

  return (
    <div className="space-y-4">
      {items.map((item) => {
        const sortedStores = [...(item.stores || [])].sort((a, b) => a.price - b.price);
        const lowestPrice = sortedStores[0]?.price;
        const highestPrice = sortedStores[sortedStores.length - 1]?.price;

        return (
          <div key={item.id} className="bg-white rounded-lg shadow-md">
            <div className="p-4">
              <div className="flex items-start space-x-4">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="flex-grow">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h2 className="text-xl font-semibold text-gray-900">{item.name}</h2>
                      <p className="text-sm text-gray-500">{item.category}</p>
                    </div>
                  </div>
                  
                  {sortedStores.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {sortedStores.map((store) => (
                        <div key={store.storeId} className="flex flex-col">
                          <button
                            onClick={() => toggleStore(item.id, store.storeId)}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                              store.price === lowestPrice
                                ? 'bg-green-50 hover:bg-green-100'
                                : store.price === highestPrice
                                ? 'bg-red-50 hover:bg-red-100'
                                : 'bg-gray-50 hover:bg-gray-100'
                            }`}
                          >
                            <span className={`font-bold ${
                              store.price === lowestPrice
                                ? 'text-green-600'
                                : store.price === highestPrice
                                ? 'text-red-600'
                                : 'text-gray-900'
                            }`}>
                              ${store.price.toFixed(2)}
                            </span>
                            <span className="text-sm text-gray-600">{store.storeName}</span>
                            {expandedItems[item.id] === store.storeId ? (
                              <ChevronUp className="w-4 h-4 text-gray-400" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-gray-400" />
                            )}
                          </button>
                          
                          {expandedItems[item.id] === store.storeId && (
                            <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                              <div className="space-y-2">
                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                  <MapPin className="w-4 h-4" />
                                  <span>{store.address} ({store.distance.toFixed(1)} mi)</span>
                                </div>
                                <div className="flex items-center space-x-2 text-sm">
                                  <ShoppingCart className={`w-4 h-4 ${store.inStock ? 'text-green-600' : 'text-red-500'}`} />
                                  <span className={store.inStock ? 'text-green-600' : 'text-red-500'}>
                                    {store.inStock ? 'In Stock' : 'Out of Stock'}
                                  </span>
                                </div>
                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                  <Clock className="w-4 h-4" />
                                  <span>Updated {new Date(store.lastUpdated).toLocaleDateString()}</span>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 italic">No store information available</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}