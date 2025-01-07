import React, { useState } from 'react';
import { Item } from './types';
import { ItemList } from './components/ItemList';
import { OptimalRoute } from './components/OptimalRoute';
import { StoreFinder } from './components/StoreFinder';
import { ShoppingBasket, Search, Plus, Route, MapPin } from 'lucide-react';
import { AddItemModal } from './components/AddItemModal';

const mockItems: Item[] = [
  {
    id: '1',
    name: 'Organic Bananas',
    category: 'Produce',
    image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=800&q=80',
    unit: 'lb',
    stores: [
      {
        storeId: '1',
        storeName: 'Fresh Market',
        address: '123 Main St',
        distance: 0.8,
        price: 0.49,
        inStock: true,
        lastUpdated: '2024-03-10'
      },
      {
        storeId: '2',
        storeName: 'Super Foods',
        address: '456 Oak Ave',
        distance: 1.2,
        price: 0.45,
        inStock: true,
        lastUpdated: '2024-03-10'
      }
    ]
  },
  {
    id: '2',
    name: 'Whole Milk',
    category: 'Dairy',
    image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=800&q=80',
    unit: 'gal',
    stores: [
      {
        storeId: '1',
        storeName: 'Fresh Market',
        address: '123 Main St',
        distance: 0.8,
        price: 3.99,
        inStock: true,
        lastUpdated: '2024-03-10'
      },
      {
        storeId: '2',
        storeName: 'Super Foods',
        address: '456 Oak Ave',
        distance: 1.2,
        price: 4.29,
        inStock: false,
        lastUpdated: '2024-03-10'
      }
    ]
  }
];

export default function App() {
  const [items, setItems] = useState<Item[]>(mockItems);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showRoute, setShowRoute] = useState(false);
  const [showStoreFinder, setShowStoreFinder] = useState(false);

  const handleAddItem = (name: string) => {
    const newItem: Item = {
      id: (items.length + 1).toString(),
      name,
      category: 'Other',
      image: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80',
      unit: 'ea',
      stores: []
    };
    setItems([...items, newItem]);
    setIsModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <ShoppingBasket className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Price Compare</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search items..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
              </div>
              <button
                onClick={() => {
                  setShowRoute(false);
                  setShowStoreFinder(!showStoreFinder);
                }}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                <MapPin className="w-5 h-5" />
                <span>{showStoreFinder ? 'Hide Stores' : 'Find Stores'}</span>
              </button>
              <button
                onClick={() => {
                  setShowStoreFinder(false);
                  setShowRoute(!showRoute);
                }}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Route className="w-5 h-5" />
                <span>{showRoute ? 'Show Items' : 'Show Route'}</span>
              </button>
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span>Add Item</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        {showStoreFinder ? (
          <StoreFinder />
        ) : showRoute ? (
          <OptimalRoute items={items} />
        ) : (
          <ItemList items={items} />
        )}
      </main>

      <AddItemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddItem}
      />
    </div>
  );
}