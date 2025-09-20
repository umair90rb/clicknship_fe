export interface OrderListApiResponse {
  data: Order[];
  meta: Meta;
}

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

export interface Meta {
  total: number;
  skip: number;
  take: number;
}
