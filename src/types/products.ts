import type { Brand, Category } from "./categoryAndBrands";

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
  unit: string | null;
  brand: Brand | null;
  category: Category | null;
}
