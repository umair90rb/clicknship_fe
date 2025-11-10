import type { Brand } from "./categoryAndBrands";
import type { ListApiResponse } from "./common";

export interface SalesChannel {
  id: number;
  name: string;
  type: string;
  source?: string;
  active: boolean;
  brand: Pick<Brand, "name">;
}

export type SalesChannelListApiResponse = ListApiResponse<SalesChannel>;

export type CreateSalesChannelRequestBody = Omit<SalesChannel, "brand"> & {
  brandId: number;
};
