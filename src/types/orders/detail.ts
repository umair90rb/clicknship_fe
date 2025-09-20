export interface GetOrderApiResponse {
  data: Order;
}

export interface Order {
  id: number;
  orderNumber: string;
  status: string;
  remarks: string;
  tags: string[];
  totalAmount: number;
  totalDiscount: any;
  totalTax: number;
  assignedAt: string;
  createdAt: string;
  courerService: CourierService;
  items: Item[];
  address: Address;
  payments: Payment[];
  delivery: Delivery;
  customer: Customer;
  channel: Channel;
  brand: Brand;
  user: User;
  logs: Log[];
}

export interface CourierService {
  id: number;
  name: string;
}

export interface Item {
  id: number;
  name: string;
  unitPrice: number;
  grams: number;
  quantity: number;
  discount: number;
  sku: string;
  productId: any;
  variantId: any;
  orderId: number;
}

export interface Address {
  id: number;
  address: string;
  note: string;
  city: string;
  phone?: string;
  zip: number;
  province: string;
  country: string;
  longitude: number;
  latitude: number;
  orderId: number;
}

export interface Payment {
  id: number;
  type: string;
  bank: string;
  tId: string;
  amount: number;
  note: string;
  orderId: number;
}

export interface Delivery {
  id: number;
  cn: string;
  status: string;
  trackingStatus: string;
  trackedAt?: string;
  tracking?: string;
  orderId: number;
  courierServiceId: number;
  courierServiceCompany: string;
}

export interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
}

export interface Channel {
  id: number;
  name: string;
  type: string;
  source: string;
  active: boolean;
  brandId: number;
}

export interface Brand {
  id: number;
  name: string;
  active: boolean;
}

export interface User {
  name: string;
  id: number;
  phone: string;
  email: string;
}

export interface Log {
  id: number;
  event: string;
  userId?: number;
  orderId: number;
}
