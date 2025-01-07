import React, { useState } from 'react';
import { X } from 'lucide-react';

interface FormData {
  name: string;
  quantity: number;
  unit: string;
  category: string;
  price: string;
  notes: string;
}

interface AddGroceryItemFormProps {
  onClose: () => void;
  onSubmit: (data: FormData) => void;
}

const UNITS = ['pieces', 'lbs', 'oz', 'kg', 'g', 'ml', 'l'] as const;
const CATEGORIES = ['produce', 'dairy', 'meat', 'bakery', 'pantry', 'frozen', 'beverages'] as const;

export function AddGroceryItemForm({ onClose, onSubmit }: AddGroceryItemFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    quantity: 1,
    unit: 'pieces',
    category: 'produce',
    price: '',
    notes: ''
  });

  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [success, setSuccess] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.length > 50) {
      newErrors.name = 'Name must be less than 50 characters';
    }

    if (formData.quantity <= 0) {
      newErrors.quantity = 'Quantity must be positive';
    }

    if (formData.notes.length > 200) {
      newErrors.notes = 'Notes must be less than 200 characters';
    }

    if (formData.price && !/^\d+(\.\d{0,2})?$/.test(formData.price)) {
      newErrors.price = 'Invalid price format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
      setSuccess(true);
      setFormData({
        name: '',
        quantity: 1,
        unit: 'pieces',
        category: 'produce',
        price: '',
        notes: ''
      });
      setTimeout(() => setSuccess(false), 3000);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Add New Grocery Item</h2>
        <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
          <X className="w-5 h-5" />
        </button>
      </div>

      {success && (
        <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg">
          Item added successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Item Name *
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={`mt-1 block w-full rounded-md shadow-sm ${
              errors.name ? 'border-red-300' : 'border-gray-300'
            } focus:border-blue-500 focus:ring focus:ring-blue-200`}
            maxLength={50}
          />
          {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
              Quantity *
            </label>
            <input
              type="number"
              id="quantity"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
              min="0.01"
              step="0.01"
              className={`mt-1 block w-full rounded-md shadow-sm ${
                errors.quantity ? 'border-red-300' : 'border-gray-300'
              } focus:border-blue-500 focus:ring focus:ring-blue-200`}
            />
            {errors.quantity && <p className="mt-1 text-sm text-red-600">{errors.quantity}</p>}
          </div>

          <div>
            <label htmlFor="unit" className="block text-sm font-medium text-gray-700">
              Unit *
            </label>
            <select
              id="unit"
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
            >
              {UNITS.map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700">
              Category *
            </label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200"
            >
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="price" className="block text-sm font-medium text-gray-700">
              Price
            </label>
            <input
              type="text"
              id="price"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              placeholder="0.00"
              className={`mt-1 block w-full rounded-md shadow-sm ${
                errors.price ? 'border-red-300' : 'border-gray-300'
              } focus:border-blue-500 focus:ring focus:ring-blue-200`}
            />
            {errors.price && <p className="mt-1 text-sm text-red-600">{errors.price}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
            Notes
          </label>
          <textarea
            id="notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            maxLength={200}
            rows={3}
            className={`mt-1 block w-full rounded-md shadow-sm ${
              errors.notes ? 'border-red-300' : 'border-gray-300'
            } focus:border-blue-500 focus:ring focus:ring-blue-200`}
          />
          <p className="mt-1 text-sm text-gray-500">
            {formData.notes.length}/200 characters
          </p>
          {errors.notes && <p className="mt-1 text-sm text-red-600">{errors.notes}</p>}
        </div>

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Add Item
          </button>
        </div>
      </form>
    </div>
  );
}