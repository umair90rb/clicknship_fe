// ============ Common Types ============

export interface DateRangeDto {
  start?: string;
  end?: string;
}

export interface ReportMeta {
  total: number;
  filters: Record<string, unknown>;
  generatedAt: string;
}

export interface ReportResponse<T> {
  data: T[];
  meta: ReportMeta;
}

// ============ Filter DTOs ============

export interface BaseReportFilterDto {
  brandId?: number;
  channelId?: number;
  dateRange?: DateRangeDto;
  city?: string;
  courierServiceId?: number;
  status?: string[];
}

export interface InventoryReportFilterDto {
  locationId?: number;
  productId?: number;
  categoryId?: number;
  brandId?: number;
  sku?: string;
  productName?: string;
}

export interface StockMovementReportFilterDto extends InventoryReportFilterDto {
  dateRange?: DateRangeDto;
  movementTypes?: string[];
  userId?: number;
}

export interface RevenueReportFilterDto {
  dateRange?: DateRangeDto;
  groupBy?: "day" | "week" | "month" | "quarter" | "year";
  brandId?: number;
  channelId?: number;
  status?: string[];
}

export interface InvoiceAgingFilterDto {
  asOfDate?: string;
  customerId?: number;
  agingBuckets?: number[];
}

export interface ProfitSummaryFilterDto {
  dateRange?: DateRangeDto;
  brandId?: number;
  channelId?: number;
  groupBy?: "day" | "week" | "month";
}

export interface CodRemittanceReportFilterDto {
  dateRange?: DateRangeDto;
  courierServiceId?: number;
  status?: string[];
}

export interface PaymentReportFilterDto {
  dateRange?: DateRangeDto;
  type?: string;
  method?: string;
}

export interface PurchaseOrderReportFilterDto {
  dateRange?: DateRangeDto;
  supplierId?: number;
  status?: string[];
}

// ============ Report Row Types ============

export interface StockReportRow {
  productId: number;
  productName: string;
  sku: string;
  locationId: number | null;
  locationName: string | null;
  quantity: number;
  reservedQuantity: number;
  availableQuantity: number;
  reorderPoint: number | null;
  costPrice: number | null;
  stockValue: number;
}

export interface LowStockReportRow {
  productId: number;
  productName: string;
  sku: string;
  locationId: number | null;
  locationName: string | null;
  currentQuantity: number;
  reservedQuantity: number;
  availableQuantity: number;
  reorderPoint: number;
  reorderQuantity: number | null;
  suggestedOrderQuantity: number;
}

export interface StockMovementReportRow {
  id: number;
  productId: number;
  productName: string;
  sku: string;
  movementType: string;
  quantity: number;
  previousQuantity: number;
  newQuantity: number;
  reason: string | null;
  referenceType: string | null;
  referenceId: number | null;
  userId: number | null;
  userName: string | null;
  createdAt: string;
}

export interface DamagedStockReportRow {
  productId: number;
  productName: string;
  sku: string;
  locationId: number | null;
  locationName: string | null;
  quantity: number;
  reason: string | null;
  date: string;
}

export interface ExpiredStockReportRow {
  productId: number;
  productName: string;
  sku: string;
  locationId: number | null;
  locationName: string | null;
  quantity: number;
  expiryDate: string;
}

export interface PurchaseOrderReportRow {
  id: number;
  poNumber: string;
  supplierName: string | null;
  status: string;
  orderDate: string | null;
  expectedDate: string | null;
  receivedDate: string | null;
  totalAmount: number | null;
  itemCount: number;
}

export interface RevenueReportRow {
  period: string;
  grossRevenue: number;
  discounts: number;
  shippingCharges: number;
  taxes: number;
  netRevenue: number;
  orderCount: number;
}

export interface ProfitSummaryReportRow {
  period: string;
  grossRevenue: number;
  cogs: number;
  grossProfit: number;
  shippingIncome: number;
  courierCosts: number;
  netProfit: number;
  profitMargin: number;
}

export interface InvoiceAgingReportRow {
  customerId: number;
  customerName: string;
  currentAmount: number;
  bucket30: number;
  bucket60: number;
  bucket90: number;
  bucket120Plus: number;
  totalOutstanding: number;
  invoices: {
    invoiceNumber: string;
    issueDate: string;
    dueDate: string;
    totalAmount: number;
    paidAmount: number;
    outstandingAmount: number;
    daysOverdue: number;
  }[];
}

export interface CodRemittanceReportRow {
  courierServiceId: number;
  courierName: string;
  totalOrders: number;
  grossAmount: number;
  courierCharges: number;
  netAmount: number;
  pendingCount: number;
  receivedCount: number;
  reconciledCount: number;
}

export interface PaymentReportRow {
  id: number;
  paymentNumber: string;
  type: string;
  method: string;
  amount: number;
  date: string;
  invoiceId: number | null;
  billId: number | null;
  orderId: number | null;
  transactionRef: string | null;
}

// Order Report Types

export interface AgentOrderReportRow {
  userId: number;
  userName: string;
  orderCount: number;
  totalValue: number;
  deliveredCount: number;
  returnedCount: number;
}

export interface ProductUnitReportRow {
  productId: number;
  productName: string;
  sku: string;
  unitsSold: number;
  totalValue: number;
  avgUnitPrice: number;
}

export interface BookingUnitReportRow {
  productId: number;
  productName: string;
  sku: string;
  bookedUnits: number;
  confirmedUnits: number;
  deliveredUnits: number;
  returnedUnits: number;
}

export interface FocUnitReportRow {
  productId: number;
  productName: string;
  sku: string;
  focUnits: number;
  totalCost: number;
}

export interface ChannelOrderReportRow {
  channelId: number;
  channelName: string;
  orderCount: number;
  totalValue: number;
  avgOrderValue: number;
}

export interface CourierDeliveryReportRow {
  courierServiceId: number;
  courierName: string;
  totalOrders: number;
  deliveredCount: number;
  returnedCount: number;
  deliveryRate: number;
  avgDeliveryDays: number;
}

export interface CourierDispatchReportRow {
  courierServiceId: number;
  courierName: string;
  dispatchCount: number;
  pendingCount: number;
  inTransitCount: number;
}
