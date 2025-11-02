import type { ListApiResponse } from "../common";

export type OrderListApiResponse = ListApiResponse<Order>;

export interface Order {
  id: number;
  orderNumber?: string;
  totalAmount?: number;
  createdAt: string;
  status: string;
  tags: string[];
  channel?: Channel;
  address: Address;
  customer: Customer;
}

export interface Channel {
  name: string;
}

export interface Address {
  address: string;
  city: string;
  phone?: string;
  province?: string;
}

export interface Customer {
  name: string;
  phone: string;
}
