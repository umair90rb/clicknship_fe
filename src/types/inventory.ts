import type { ListApiResponse, GetApiResponse } from "./common";
import type { Product } from "./products";

// ============ Enums as Const Objects ============

export const MovementType = {
  SALE: "SALE",
  RETURN: "RETURN",
  ADJUSTMENT: "ADJUSTMENT",
  PURCHASE: "PURCHASE",
  TRANSFER_IN: "TRANSFER_IN",
  TRANSFER_OUT: "TRANSFER_OUT",
  RESERVATION: "RESERVATION",
  RESERVATION_RELEASE: "RESERVATION_RELEASE",
  DAMAGED: "DAMAGED",
  EXPIRED: "EXPIRED",
} as const;
export type MovementType = (typeof MovementType)[keyof typeof MovementType];

export const ReferenceType = {
  ORDER: "ORDER",
  PURCHASE_ORDER: "PURCHASE_ORDER",
  TRANSFER: "TRANSFER",
  MANUAL: "MANUAL",
} as const;
export type ReferenceType = (typeof ReferenceType)[keyof typeof ReferenceType];

export const PurchaseOrderStatus = {
  DRAFT: "DRAFT",
  ORDERED: "ORDERED",
  PARTIAL: "PARTIAL",
  RECEIVED: "RECEIVED",
  CANCELLED: "CANCELLED",
} as const;
export type PurchaseOrderStatus =
  (typeof PurchaseOrderStatus)[keyof typeof PurchaseOrderStatus];

export const TransferStatus = {
  PENDING: "PENDING",
  IN_TRANSIT: "IN_TRANSIT",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
} as const;
export type TransferStatus =
  (typeof TransferStatus)[keyof typeof TransferStatus];

// ============ Entities ============

export interface InventoryLocation {
  id: number;
  name: string;
  address: string | null;
  isDefault: boolean;
  active: boolean;
}

export interface Supplier {
  id: number;
  name: string;
  contactName: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  active: boolean;
}

export interface InventoryItem {
  id: number;
  quantity: number;
  reservedQuantity: number;
  reorderPoint: number | null;
  reorderQuantity: number | null;
  costPrice: number | null;
  productId: number;
  locationId: number | null;
  updatedAt: string;
  product?: Product;
  location?: InventoryLocation;
}

export interface InventoryMovement {
  id: number;
  type: MovementType;
  quantity: number;
  previousQuantity: number;
  newQuantity: number;
  reason: string | null;
  referenceType: ReferenceType | null;
  referenceId: number | null;
  costAtTime: number | null;
  createdAt: string;
  inventoryItemId: number;
  userId: number | null;
  user?: { id: number; name: string };
}

export interface PurchaseOrderItem {
  id: number;
  orderedQuantity: number;
  receivedQuantity: number;
  unitCost: number;
  purchaseOrderId: number;
  productId: number;
  locationId: number | null;
  product?: Product;
  location?: InventoryLocation;
}

export interface PurchaseOrder {
  id: number;
  poNumber: string;
  status: PurchaseOrderStatus;
  orderDate: string | null;
  expectedDate: string | null;
  receivedDate: string | null;
  totalAmount: number | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  supplierId: number | null;
  userId: number | null;
  supplier?: Supplier;
  items?: PurchaseOrderItem[];
}

export interface StockTransferItem {
  id: number;
  quantity: number;
  stockTransferId: number;
  productId: number;
  product?: Product;
}

export interface StockTransfer {
  id: number;
  transferNumber: string;
  status: TransferStatus;
  notes: string | null;
  initiatedAt: string;
  completedAt: string | null;
  fromLocationId: number;
  toLocationId: number;
  userId: number | null;
  fromLocation?: InventoryLocation;
  toLocation?: InventoryLocation;
  items?: StockTransferItem[];
}

export interface StockLevel {
  productId: number;
  productName: string;
  sku: string;
  locationId?: number;
  locationName?: string;
  quantity: number;
  reservedQuantity: number;
  availableQuantity: number;
  reorderPoint?: number;
  costPrice?: number;
}

// ============ API Response Types ============

export type LocationListResponse = ListApiResponse<InventoryLocation>;
export type LocationResponse = GetApiResponse<InventoryLocation>;
export type SupplierListResponse = ListApiResponse<Supplier>;
export type SupplierResponse = GetApiResponse<Supplier>;
export type InventoryItemListResponse = ListApiResponse<InventoryItem>;
export type InventoryItemResponse = GetApiResponse<InventoryItem>;
export type InventoryMovementListResponse = ListApiResponse<InventoryMovement>;
export type PurchaseOrderListResponse = ListApiResponse<PurchaseOrder>;
export type PurchaseOrderResponse = GetApiResponse<PurchaseOrder>;
export type StockTransferListResponse = ListApiResponse<StockTransfer>;
export type StockTransferResponse = GetApiResponse<StockTransfer>;
export type StockLevelResponse = GetApiResponse<StockLevel>;

// ============ Request DTOs ============

export interface CreateLocationDto {
  name: string;
  address?: string;
  isDefault?: boolean;
}

export interface UpdateLocationDto {
  name?: string;
  address?: string;
  isDefault?: boolean;
  active?: boolean;
}

export interface CreateSupplierDto {
  name: string;
  contactName?: string;
  email?: string;
  phone?: string;
  address?: string;
}

export interface UpdateSupplierDto {
  name?: string;
  contactName?: string;
  email?: string;
  phone?: string;
  address?: string;
  active?: boolean;
}

export interface InventoryItemQueryParams {
  locationId?: number;
  productId?: number;
  lowStockOnly?: boolean;
}

export interface CreateInventoryItemDto {
  productId: number;
  locationId?: number;
  quantity?: number;
  reorderPoint?: number;
  reorderQuantity?: number;
  costPrice?: number;
}

export interface UpdateInventoryItemDto {
  quantity?: number;
  reorderPoint?: number;
  reorderQuantity?: number;
  costPrice?: number;
}

export interface ReserveStockDto {
  productId: number;
  quantity: number;
  locationId?: number;
  orderId?: number;
}

export interface DeductStockDto {
  productId: number;
  quantity: number;
  locationId?: number;
  orderId?: number;
}

export interface ReleaseReservationDto {
  productId: number;
  quantity: number;
  locationId?: number;
  orderId?: number;
}

export interface RestockDto {
  productId: number;
  quantity: number;
  locationId?: number;
  orderId?: number;
  reason?: string;
}

export interface AdjustStockDto {
  productId: number;
  quantity: number;
  reason: string;
  locationId?: number;
}

export interface MovementQueryDto {
  productId?: number;
  orderId?: number;
  fromDate?: string;
  toDate?: string;
  limit?: number;
  offset?: number;
}

export interface PurchaseOrderItemDto {
  productId: number;
  orderedQuantity: number;
  unitCost: number;
  locationId?: number;
}

export interface CreatePurchaseOrderDto {
  supplierId?: number;
  orderDate?: string;
  expectedDate?: string;
  notes?: string;
  items: PurchaseOrderItemDto[];
}

export interface UpdatePurchaseOrderDto {
  supplierId?: number;
  orderDate?: string;
  expectedDate?: string;
  notes?: string;
}

export interface ReceiveItemDto {
  purchaseOrderItemId: number;
  receivedQuantity: number;
}

export interface ReceivePurchaseOrderDto {
  items: ReceiveItemDto[];
}

export interface TransferItemDto {
  productId: number;
  quantity: number;
}

export interface CreateTransferDto {
  fromLocationId: number;
  toLocationId: number;
  notes?: string;
  items: TransferItemDto[];
}
