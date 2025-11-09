import type { Brand, Category } from "./categoryAndBrands";
import type { ListApiResponse } from "./common";

export type ProductListApiResponse = ListApiResponse<Product>;

export interface Product {
  id: number;
  name: string;
  description: string | null;
  sku: string;
  barcode: string | null;
  active: boolean;
  unitPrice: number;
  costPrice: number | null;
  incentive: number | null;
  weight: number | null;
  unit: string | null;
  brand: Brand | null;
  category: Category | null;
}

export type CreateProductRequestBody =
  | Omit<Product, "id" | "brand" | "category">
  | { categoryId: number; brandId: number };
