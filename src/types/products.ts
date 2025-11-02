export interface Product {
  id: number;
  name: string;
  description: string | null;
  sku: string;
  barcode: string | null;
  unitPrice: number;
  costPrice: number | null;
  incentive: number | null;
  weight: number | null;
  brand: Brand | null;
  unit: Unit | null;
  category: Category | null;
}

export interface Brand {
  id: number;
  name: string;
}

export interface Unit {
  id: number;
  name: string;
}

export interface Category {
  id: number;
  name: string;
}
