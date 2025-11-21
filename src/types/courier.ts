import type { ListApiResponse } from "./common";

export type AvailableCourierIntegrationList = {
  [key: string]: { name: string; fields: string[] };
};

export interface CourierIntegration {
  id: number;

  name: string;

  courier: string;

  returnAddress: string;

  dispatchAddress: string;

  active: boolean;
}

export type ListCourierIntegrationRequestResponse =
  ListApiResponse<CourierIntegration>;
