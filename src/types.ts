export interface Item {
  id: string;
  name: string;
  category: string;
  image: string;
  unit: string;
  stores: StorePrice[];
}

export interface StorePrice {
  storeId: string;
  storeName: string;
  address: string;
  distance: number;
  price: number;
  inStock: boolean;
  lastUpdated: string;
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