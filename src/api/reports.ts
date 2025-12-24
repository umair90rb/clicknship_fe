import { api } from "@/api/index";
import type {
  ReportResponse,
  BaseReportFilterDto,
  InventoryReportFilterDto,
  StockMovementReportFilterDto,
  RevenueReportFilterDto,
  InvoiceAgingFilterDto,
  ProfitSummaryFilterDto,
  CodRemittanceReportFilterDto,
  PaymentReportFilterDto,
  PurchaseOrderReportFilterDto,
  StockReportRow,
  LowStockReportRow,
  StockMovementReportRow,
  DamagedStockReportRow,
  ExpiredStockReportRow,
  PurchaseOrderReportRow,
  RevenueReportRow,
  ProfitSummaryReportRow,
  InvoiceAgingReportRow,
  CodRemittanceReportRow,
  PaymentReportRow,
  AgentOrderReportRow,
  ProductUnitReportRow,
  BookingUnitReportRow,
  FocUnitReportRow,
  ChannelOrderReportRow,
  CourierDeliveryReportRow,
  CourierDispatchReportRow,
} from "@/types/reports";

export const reportsApi = api.injectEndpoints({
  endpoints: (build) => ({
    // ============ Order Reports ============
    getAgentOrderReport: build.query<
      ReportResponse<AgentOrderReportRow>,
      BaseReportFilterDto
    >({
      query: (body) => ({
        url: "reports/orders/agent-order",
        method: "POST",
        body,
      }),
    }),
    getProductUnitReport: build.query<
      ReportResponse<ProductUnitReportRow>,
      BaseReportFilterDto
    >({
      query: (body) => ({
        url: "reports/orders/product-unit",
        method: "POST",
        body,
      }),
    }),
    getBookingUnitReport: build.query<
      ReportResponse<BookingUnitReportRow>,
      BaseReportFilterDto
    >({
      query: (body) => ({
        url: "reports/orders/booking-unit",
        method: "POST",
        body,
      }),
    }),
    getFocUnitReport: build.query<
      ReportResponse<FocUnitReportRow>,
      BaseReportFilterDto
    >({
      query: (body) => ({
        url: "reports/orders/foc-unit",
        method: "POST",
        body,
      }),
    }),
    getAgentChannelReport: build.query<
      ReportResponse<AgentOrderReportRow>,
      BaseReportFilterDto
    >({
      query: (body) => ({
        url: "reports/orders/agent-channel",
        method: "POST",
        body,
      }),
    }),
    getChannelOrderReport: build.query<
      ReportResponse<ChannelOrderReportRow>,
      BaseReportFilterDto
    >({
      query: (body) => ({
        url: "reports/orders/channel-order",
        method: "POST",
        body,
      }),
    }),
    getUserIncentiveReport: build.query<
      ReportResponse<AgentOrderReportRow>,
      BaseReportFilterDto
    >({
      query: (body) => ({
        url: "reports/orders/user-incentive",
        method: "POST",
        body,
      }),
    }),
    getCourierDeliveryReport: build.query<
      ReportResponse<CourierDeliveryReportRow>,
      BaseReportFilterDto
    >({
      query: (body) => ({
        url: "reports/orders/courier-delivery",
        method: "POST",
        body,
      }),
    }),
    getCourierDispatchReport: build.query<
      ReportResponse<CourierDispatchReportRow>,
      BaseReportFilterDto
    >({
      query: (body) => ({
        url: "reports/orders/courier-dispatch",
        method: "POST",
        body,
      }),
    }),
    getChannelOrderGenerationReport: build.query<
      ReportResponse<ChannelOrderReportRow>,
      BaseReportFilterDto
    >({
      query: (body) => ({
        url: "reports/orders/channel-order-generation",
        method: "POST",
        body,
      }),
    }),
    getBookedProductValueReport: build.query<
      ReportResponse<ProductUnitReportRow>,
      BaseReportFilterDto
    >({
      query: (body) => ({
        url: "reports/orders/booked-product-value",
        method: "POST",
        body,
      }),
    }),

    // ============ Inventory Reports ============
    getStockReport: build.query<
      ReportResponse<StockReportRow>,
      InventoryReportFilterDto
    >({
      query: (body) => ({
        url: "reports/inventory/stock",
        method: "POST",
        body,
      }),
    }),
    getDamagedStockReport: build.query<
      ReportResponse<DamagedStockReportRow>,
      InventoryReportFilterDto
    >({
      query: (body) => ({
        url: "reports/inventory/stock-damaged",
        method: "POST",
        body,
      }),
    }),
    getExpiredStockReport: build.query<
      ReportResponse<ExpiredStockReportRow>,
      InventoryReportFilterDto
    >({
      query: (body) => ({
        url: "reports/inventory/stock-expired",
        method: "POST",
        body,
      }),
    }),
    getStockMovementReport: build.query<
      ReportResponse<StockMovementReportRow>,
      StockMovementReportFilterDto
    >({
      query: (body) => ({
        url: "reports/inventory/stock-movement",
        method: "POST",
        body,
      }),
    }),
    getLowStockReport: build.query<
      ReportResponse<LowStockReportRow>,
      InventoryReportFilterDto
    >({
      query: (body) => ({
        url: "reports/inventory/low-stock",
        method: "POST",
        body,
      }),
    }),
    getPurchaseOrderReport: build.query<
      ReportResponse<PurchaseOrderReportRow>,
      PurchaseOrderReportFilterDto
    >({
      query: (body) => ({
        url: "reports/inventory/purchase-order",
        method: "POST",
        body,
      }),
    }),

    // ============ Accounting Reports ============
    getRevenueReport: build.query<
      ReportResponse<RevenueReportRow>,
      RevenueReportFilterDto
    >({
      query: (body) => ({
        url: "reports/accounting/revenue",
        method: "POST",
        body,
      }),
    }),
    getInvoiceAgingReport: build.query<
      ReportResponse<InvoiceAgingReportRow>,
      InvoiceAgingFilterDto
    >({
      query: (body) => ({
        url: "reports/accounting/invoice-aging",
        method: "POST",
        body,
      }),
    }),
    getCodRemittanceReport: build.query<
      ReportResponse<CodRemittanceReportRow>,
      CodRemittanceReportFilterDto
    >({
      query: (body) => ({
        url: "reports/accounting/cod-remittance",
        method: "POST",
        body,
      }),
    }),
    getPaymentReport: build.query<
      ReportResponse<PaymentReportRow>,
      PaymentReportFilterDto
    >({
      query: (body) => ({
        url: "reports/accounting/payment",
        method: "POST",
        body,
      }),
    }),
    getProfitSummaryReport: build.query<
      ReportResponse<ProfitSummaryReportRow>,
      ProfitSummaryFilterDto
    >({
      query: (body) => ({
        url: "reports/accounting/profit-summary",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  // Order Reports
  useGetAgentOrderReportQuery,
  useLazyGetAgentOrderReportQuery,
  useGetProductUnitReportQuery,
  useLazyGetProductUnitReportQuery,
  useGetBookingUnitReportQuery,
  useLazyGetBookingUnitReportQuery,
  useGetFocUnitReportQuery,
  useLazyGetFocUnitReportQuery,
  useGetAgentChannelReportQuery,
  useLazyGetAgentChannelReportQuery,
  useGetChannelOrderReportQuery,
  useLazyGetChannelOrderReportQuery,
  useGetUserIncentiveReportQuery,
  useLazyGetUserIncentiveReportQuery,
  useGetCourierDeliveryReportQuery,
  useLazyGetCourierDeliveryReportQuery,
  useGetCourierDispatchReportQuery,
  useLazyGetCourierDispatchReportQuery,
  useGetChannelOrderGenerationReportQuery,
  useLazyGetChannelOrderGenerationReportQuery,
  useGetBookedProductValueReportQuery,
  useLazyGetBookedProductValueReportQuery,
  // Inventory Reports
  useGetStockReportQuery,
  useLazyGetStockReportQuery,
  useGetDamagedStockReportQuery,
  useLazyGetDamagedStockReportQuery,
  useGetExpiredStockReportQuery,
  useLazyGetExpiredStockReportQuery,
  useGetStockMovementReportQuery,
  useLazyGetStockMovementReportQuery,
  useGetLowStockReportQuery,
  useLazyGetLowStockReportQuery,
  useGetPurchaseOrderReportQuery,
  useLazyGetPurchaseOrderReportQuery,
  // Accounting Reports
  useGetRevenueReportQuery,
  useLazyGetRevenueReportQuery,
  useGetInvoiceAgingReportQuery,
  useLazyGetInvoiceAgingReportQuery,
  useGetCodRemittanceReportQuery,
  useLazyGetCodRemittanceReportQuery,
  useGetPaymentReportQuery,
  useLazyGetPaymentReportQuery,
  useGetProfitSummaryReportQuery,
  useLazyGetProfitSummaryReportQuery,
} = reportsApi;
