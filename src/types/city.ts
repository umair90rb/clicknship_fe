import type { ListApiResponse } from "./common";

export interface City {
  id: number;
  city: string;
  courierMappedCities?: CourierMappedCity[];
}

export interface CourierMappedCity {
  id?: number;
  courier: string;
  mapped: string;
  code?: string;
  courierAssignedId?: string;
}

export type ListCitiesRequestResponse = ListApiResponse<City>;
