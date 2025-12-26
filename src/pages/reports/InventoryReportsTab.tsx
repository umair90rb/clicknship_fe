import { useState } from "react";
import { Grid } from "@mui/material";
import InventoryIcon from "@mui/icons-material/Inventory";
import WarningIcon from "@mui/icons-material/Warning";
import BrokenImageIcon from "@mui/icons-material/BrokenImage";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import ReportCard from "./ReportCard";
import ReportViewerModal, { type ReportColumn } from "./ReportViewerModal";
import {
  useLazyGetStockReportQuery,
  useLazyGetLowStockReportQuery,
  useLazyGetDamagedStockReportQuery,
  useLazyGetExpiredStockReportQuery,
  useLazyGetStockMovementReportQuery,
  useLazyGetPurchaseOrderReportQuery,
} from "@/api/reports";
import type {
  StockReportRow,
  LowStockReportRow,
  DamagedStockReportRow,
  ExpiredStockReportRow,
  StockMovementReportRow,
  PurchaseOrderReportRow,
} from "@/types/reports";

type ReportType =
  | "stock"
  | "low-stock"
  | "damaged-stock"
  | "expired-stock"
  | "stock-movement"
  | "purchase-order"
  | null;

const stockColumns: ReportColumn<StockReportRow>[] = [
  { id: "productName", header: "Product" },
  { id: "sku", header: "SKU" },
  { id: "locationName", header: "Location" },
  { id: "quantity", header: "Quantity", align: "right", format: "number" },
  { id: "reservedQuantity", header: "Reserved", align: "right", format: "number" },
  { id: "availableQuantity", header: "Available", align: "right", format: "number" },
  { id: "stockValue", header: "Stock Value", align: "right", format: "currency" },
];

const lowStockColumns: ReportColumn<LowStockReportRow>[] = [
  { id: "productName", header: "Product" },
  { id: "sku", header: "SKU" },
  { id: "locationName", header: "Location" },
  { id: "currentQuantity", header: "Current", align: "right", format: "number" },
  { id: "availableQuantity", header: "Available", align: "right", format: "number" },
  { id: "reorderPoint", header: "Reorder Point", align: "right", format: "number" },
  { id: "suggestedOrderQuantity", header: "Suggested Order", align: "right", format: "number" },
];

const damagedStockColumns: ReportColumn<DamagedStockReportRow>[] = [
  { id: "productName", header: "Product" },
  { id: "sku", header: "SKU" },
  { id: "locationName", header: "Location" },
  { id: "quantity", header: "Quantity", align: "right", format: "number" },
  { id: "reason", header: "Reason" },
  { id: "date", header: "Date", format: "date" },
];

const expiredStockColumns: ReportColumn<ExpiredStockReportRow>[] = [
  { id: "productName", header: "Product" },
  { id: "sku", header: "SKU" },
  { id: "locationName", header: "Location" },
  { id: "quantity", header: "Quantity", align: "right", format: "number" },
  { id: "expiryDate", header: "Expiry Date", format: "date" },
];

const stockMovementColumns: ReportColumn<StockMovementReportRow>[] = [
  { id: "productName", header: "Product" },
  { id: "sku", header: "SKU" },
  { id: "movementType", header: "Type" },
  { id: "quantity", header: "Quantity", align: "right", format: "number" },
  { id: "previousQuantity", header: "Previous", align: "right", format: "number" },
  { id: "newQuantity", header: "New", align: "right", format: "number" },
  { id: "userName", header: "User" },
  { id: "createdAt", header: "Date", format: "date" },
];

const purchaseOrderColumns: ReportColumn<PurchaseOrderReportRow>[] = [
  { id: "poNumber", header: "PO Number" },
  { id: "supplierName", header: "Supplier" },
  { id: "status", header: "Status" },
  { id: "orderDate", header: "Order Date", format: "date" },
  { id: "expectedDate", header: "Expected Date", format: "date" },
  { id: "itemCount", header: "Items", align: "right", format: "number" },
  { id: "totalAmount", header: "Total Amount", align: "right", format: "currency" },
];

const inventoryReports = [
  {
    id: "stock" as const,
    title: "Stock Report",
    description: "Current stock levels across all locations",
    Icon: InventoryIcon,
  },
  {
    id: "low-stock" as const,
    title: "Low Stock Report",
    description: "Products below reorder point",
    Icon: WarningIcon,
  },
  {
    id: "damaged-stock" as const,
    title: "Damaged Stock Report",
    description: "Track damaged inventory items",
    Icon: BrokenImageIcon,
  },
  {
    id: "expired-stock" as const,
    title: "Expired Stock Report",
    description: "Expired or expiring inventory",
    Icon: EventBusyIcon,
  },
  {
    id: "stock-movement" as const,
    title: "Stock Movement Report",
    description: "All inventory movements with details",
    Icon: SwapHorizIcon,
  },
  {
    id: "purchase-order" as const,
    title: "Purchase Order Report",
    description: "Purchase orders by status and supplier",
    Icon: ShoppingCartIcon,
  },
];

export default function InventoryReportsTab() {
  const [activeReport, setActiveReport] = useState<ReportType>(null);

  const [getStock, stockResult] = useLazyGetStockReportQuery();
  const [getLowStock, lowStockResult] = useLazyGetLowStockReportQuery();
  const [getDamagedStock, damagedStockResult] = useLazyGetDamagedStockReportQuery();
  const [getExpiredStock, expiredStockResult] = useLazyGetExpiredStockReportQuery();
  const [getStockMovement, stockMovementResult] = useLazyGetStockMovementReportQuery();
  const [getPurchaseOrder, purchaseOrderResult] = useLazyGetPurchaseOrderReportQuery();

  const handleOpenReport = (reportId: ReportType) => {
    setActiveReport(reportId);
    const filters = {};

    switch (reportId) {
      case "stock":
        getStock(filters);
        break;
      case "low-stock":
        getLowStock(filters);
        break;
      case "damaged-stock":
        getDamagedStock(filters);
        break;
      case "expired-stock":
        getExpiredStock(filters);
        break;
      case "stock-movement":
        getStockMovement({ ...filters });
        break;
      case "purchase-order":
        getPurchaseOrder({ ...filters });
        break;
    }
  };

  const handleDateRangeChange = (range: { start?: string; end?: string }) => {
    if (activeReport === "stock-movement") {
      getStockMovement({ dateRange: range });
    } else if (activeReport === "purchase-order") {
      getPurchaseOrder({ dateRange: range });
    }
  };

  const getReportProps = () => {
    switch (activeReport) {
      case "stock":
        return {
          title: "Stock Report",
          columns: stockColumns,
          data: stockResult.data?.data,
          isLoading: stockResult.isLoading,
          meta: stockResult.data?.meta,
          showDateFilter: false,
        };
      case "low-stock":
        return {
          title: "Low Stock Report",
          columns: lowStockColumns,
          data: lowStockResult.data?.data,
          isLoading: lowStockResult.isLoading,
          meta: lowStockResult.data?.meta,
          showDateFilter: false,
        };
      case "damaged-stock":
        return {
          title: "Damaged Stock Report",
          columns: damagedStockColumns,
          data: damagedStockResult.data?.data,
          isLoading: damagedStockResult.isLoading,
          meta: damagedStockResult.data?.meta,
          showDateFilter: false,
        };
      case "expired-stock":
        return {
          title: "Expired Stock Report",
          columns: expiredStockColumns,
          data: expiredStockResult.data?.data,
          isLoading: expiredStockResult.isLoading,
          meta: expiredStockResult.data?.meta,
          showDateFilter: false,
        };
      case "stock-movement":
        return {
          title: "Stock Movement Report",
          columns: stockMovementColumns,
          data: stockMovementResult.data?.data,
          isLoading: stockMovementResult.isLoading,
          meta: stockMovementResult.data?.meta,
          showDateFilter: true,
        };
      case "purchase-order":
        return {
          title: "Purchase Order Report",
          columns: purchaseOrderColumns,
          data: purchaseOrderResult.data?.data,
          isLoading: purchaseOrderResult.isLoading,
          meta: purchaseOrderResult.data?.meta,
          showDateFilter: true,
        };
      default:
        return null;
    }
  };

  const reportProps = getReportProps();

  return (
    <>
      <Grid container spacing={2}>
        {inventoryReports.map((report) => (
          <Grid key={report.id} size={{ xs: 12, sm: 6, md: 4 }}>
            <ReportCard
              title={report.title}
              description={report.description}
              Icon={report.Icon}
              onClick={() => handleOpenReport(report.id)}
            />
          </Grid>
        ))}
      </Grid>

      {reportProps && (
        <ReportViewerModal
          open={!!activeReport}
          setOpen={(open) => !open && setActiveReport(null)}
          onDateRangeChange={handleDateRangeChange}
          onRefresh={() => activeReport && handleOpenReport(activeReport)}
          {...reportProps}
        />
      )}
    </>
  );
}
