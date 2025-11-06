export interface Category {
  id: number;
  name: string;
  description?: string;
}

export type CategoryListApiResponse = Category[];

export interface Brand {
  id: number;
  name: string;
  active: boolean;
}

export type BrandListApiResponse = Brand[];
