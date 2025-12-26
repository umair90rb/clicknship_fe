import { useState } from "react";
import { Grid } from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import InventoryIcon from "@mui/icons-material/Inventory";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import CardGiftcardIcon from "@mui/icons-material/CardGiftcard";
import StorefrontIcon from "@mui/icons-material/Storefront";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ReportCard from "./ReportCard";
import ReportViewerModal, { type ReportColumn } from "./ReportViewerModal";
import {
  useLazyGetAgentOrderReportQuery,
  useLazyGetProductUnitReportQuery,
  useLazyGetBookingUnitReportQuery,
  useLazyGetFocUnitReportQuery,
  useLazyGetChannelOrderReportQuery,
  useLazyGetCourierDeliveryReportQuery,
  useLazyGetCourierDispatchReportQuery,
  useLazyGetUserIncentiveReportQuery,
  useLazyGetBookedProductValueReportQuery,
} from "@/api/reports";
import type {
  AgentOrderReportRow,
  ProductUnitReportRow,
  BookingUnitReportRow,
  FocUnitReportRow,
  ChannelOrderReportRow,
  CourierDeliveryReportRow,
  CourierDispatchReportRow,
} from "@/types/reports";
import { formatDateRangeForApi, getDefaultDateRange } from "@/components/form/FormDateRangePicker";

interface ApiDateRange {
  start?: string;
  end?: string;
}

type ReportType =
  | "agent-order"
  | "product-unit"
  | "booking-unit"
  | "foc-unit"
  | "channel-order"
  | "courier-delivery"
  | "courier-dispatch"
  | "user-incentive"
  | "booked-product-value"
  | null;

const agentOrderColumns: ReportColumn<AgentOrderReportRow>[] = [
  { id: "userName", header: "Agent Name" },
  { id: "orderCount", header: "Orders", align: "right", format: "number" },
  { id: "totalValue", header: "Total Value", align: "right", format: "currency" },
  { id: "deliveredCount", header: "Delivered", align: "right", format: "number" },
  { id: "returnedCount", header: "Returned", align: "right", format: "number" },
];

const productUnitColumns: ReportColumn<ProductUnitReportRow>[] = [
  { id: "productName", header: "Product" },
  { id: "sku", header: "SKU" },
  { id: "unitsSold", header: "Units Sold", align: "right", format: "number" },
  { id: "totalValue", header: "Total Value", align: "right", format: "currency" },
  { id: "avgUnitPrice", header: "Avg Unit Price", align: "right", format: "currency" },
];

const bookingUnitColumns: ReportColumn<BookingUnitReportRow>[] = [
  { id: "productName", header: "Product" },
  { id: "sku", header: "SKU" },
  { id: "bookedUnits", header: "Booked", align: "right", format: "number" },
  { id: "confirmedUnits", header: "Confirmed", align: "right", format: "number" },
  { id: "deliveredUnits", header: "Delivered", align: "right", format: "number" },
  { id: "returnedUnits", header: "Returned", align: "right", format: "number" },
];

const focUnitColumns: ReportColumn<FocUnitReportRow>[] = [
  { id: "productName", header: "Product" },
  { id: "sku", header: "SKU" },
  { id: "focUnits", header: "FOC Units", align: "right", format: "number" },
  { id: "totalCost", header: "Total Cost", align: "right", format: "currency" },
];

const channelOrderColumns: ReportColumn<ChannelOrderReportRow>[] = [
  { id: "channelName", header: "Channel" },
  { id: "orderCount", header: "Orders", align: "right", format: "number" },
  { id: "totalValue", header: "Total Value", align: "right", format: "currency" },
  { id: "avgOrderValue", header: "Avg Order Value", align: "right", format: "currency" },
];

const courierDeliveryColumns: ReportColumn<CourierDeliveryReportRow>[] = [
  { id: "courierName", header: "Courier" },
  { id: "totalOrders", header: "Total Orders", align: "right", format: "number" },
  { id: "deliveredCount", header: "Delivered", align: "right", format: "number" },
  { id: "returnedCount", header: "Returned", align: "right", format: "number" },
  { id: "deliveryRate", header: "Delivery Rate", align: "right", format: "percent" },
  { id: "avgDeliveryDays", header: "Avg Days", align: "right", format: "number" },
];

const courierDispatchColumns: ReportColumn<CourierDispatchReportRow>[] = [
  { id: "courierName", header: "Courier" },
  { id: "dispatchCount", header: "Dispatched", align: "right", format: "number" },
  { id: "pendingCount", header: "Pending", align: "right", format: "number" },
  { id: "inTransitCount", header: "In Transit", align: "right", format: "number" },
];

const orderReports = [
  {
    id: "agent-order" as const,
    title: "Agent Order Report",
    description: "View orders grouped by agent with delivery stats",
    Icon: PersonIcon,
  },
  {
    id: "product-unit" as const,
    title: "Product Unit Report",
    description: "Units sold per product with revenue analysis",
    Icon: InventoryIcon,
  },
  {
    id: "booking-unit" as const,
    title: "Booking Unit Report",
    description: "Track booking, confirmation, and delivery status",
    Icon: BookmarkIcon,
  },
  {
    id: "foc-unit" as const,
    title: "FOC Unit Report",
    description: "Free of charge units given with cost analysis",
    Icon: CardGiftcardIcon,
  },
  {
    id: "channel-order" as const,
    title: "Channel Order Report",
    description: "Orders by sales channel with average order value",
    Icon: StorefrontIcon,
  },
  {
    id: "courier-delivery" as const,
    title: "Courier Delivery Report",
    description: "Courier performance with delivery rates",
    Icon: LocalShippingIcon,
  },
  {
    id: "courier-dispatch" as const,
    title: "Courier Dispatch Report",
    description: "Dispatch status by courier",
    Icon: LocalShippingIcon,
  },
  {
    id: "user-incentive" as const,
    title: "User Incentive Report",
    description: "Track user incentives and commissions",
    Icon: TrendingUpIcon,
  },
  {
    id: "booked-product-value" as const,
    title: "Booked Product Value",
    description: "Total value of booked products",
    Icon: InventoryIcon,
  },
];

export default function OrderReportsTab() {
  const [activeReport, setActiveReport] = useState<ReportType>(null);
  const [dateRange, setDateRange] = useState<ApiDateRange>(() => formatDateRangeForApi(getDefaultDateRange()));

  const [getAgentOrder, agentOrderResult] = useLazyGetAgentOrderReportQuery();
  const [getProductUnit, productUnitResult] = useLazyGetProductUnitReportQuery();
  const [getBookingUnit, bookingUnitResult] = useLazyGetBookingUnitReportQuery();
  const [getFocUnit, focUnitResult] = useLazyGetFocUnitReportQuery();
  const [getChannelOrder, channelOrderResult] = useLazyGetChannelOrderReportQuery();
  const [getCourierDelivery, courierDeliveryResult] = useLazyGetCourierDeliveryReportQuery();
  const [getCourierDispatch, courierDispatchResult] = useLazyGetCourierDispatchReportQuery();
  const [getUserIncentive, userIncentiveResult] = useLazyGetUserIncentiveReportQuery();
  const [getBookedProductValue, bookedProductValueResult] = useLazyGetBookedProductValueReportQuery();

  const handleOpenReport = (reportId: ReportType) => {
    setActiveReport(reportId);
    const filters = { dateRange };

    switch (reportId) {
      case "agent-order":
        getAgentOrder(filters);
        break;
      case "product-unit":
        getProductUnit(filters);
        break;
      case "booking-unit":
        getBookingUnit(filters);
        break;
      case "foc-unit":
        getFocUnit(filters);
        break;
      case "channel-order":
        getChannelOrder(filters);
        break;
      case "courier-delivery":
        getCourierDelivery(filters);
        break;
      case "courier-dispatch":
        getCourierDispatch(filters);
        break;
      case "user-incentive":
        getUserIncentive(filters);
        break;
      case "booked-product-value":
        getBookedProductValue(filters);
        break;
    }
  };

  const handleDateRangeChange = (range: { start?: string; end?: string }) => {
    setDateRange(range);
    if (activeReport) {
      const filters = { dateRange: range };
      switch (activeReport) {
        case "agent-order":
          getAgentOrder(filters);
          break;
        case "product-unit":
          getProductUnit(filters);
          break;
        case "booking-unit":
          getBookingUnit(filters);
          break;
        case "foc-unit":
          getFocUnit(filters);
          break;
        case "channel-order":
          getChannelOrder(filters);
          break;
        case "courier-delivery":
          getCourierDelivery(filters);
          break;
        case "courier-dispatch":
          getCourierDispatch(filters);
          break;
        case "user-incentive":
          getUserIncentive(filters);
          break;
        case "booked-product-value":
          getBookedProductValue(filters);
          break;
      }
    }
  };

  const getReportProps = () => {
    switch (activeReport) {
      case "agent-order":
        return {
          title: "Agent Order Report",
          columns: agentOrderColumns,
          data: agentOrderResult.data?.data,
          isLoading: agentOrderResult.isLoading,
          meta: agentOrderResult.data?.meta,
        };
      case "product-unit":
        return {
          title: "Product Unit Report",
          columns: productUnitColumns,
          data: productUnitResult.data?.data,
          isLoading: productUnitResult.isLoading,
          meta: productUnitResult.data?.meta,
        };
      case "booking-unit":
        return {
          title: "Booking Unit Report",
          columns: bookingUnitColumns,
          data: bookingUnitResult.data?.data,
          isLoading: bookingUnitResult.isLoading,
          meta: bookingUnitResult.data?.meta,
        };
      case "foc-unit":
        return {
          title: "FOC Unit Report",
          columns: focUnitColumns,
          data: focUnitResult.data?.data,
          isLoading: focUnitResult.isLoading,
          meta: focUnitResult.data?.meta,
        };
      case "channel-order":
        return {
          title: "Channel Order Report",
          columns: channelOrderColumns,
          data: channelOrderResult.data?.data,
          isLoading: channelOrderResult.isLoading,
          meta: channelOrderResult.data?.meta,
        };
      case "courier-delivery":
        return {
          title: "Courier Delivery Report",
          columns: courierDeliveryColumns,
          data: courierDeliveryResult.data?.data,
          isLoading: courierDeliveryResult.isLoading,
          meta: courierDeliveryResult.data?.meta,
        };
      case "courier-dispatch":
        return {
          title: "Courier Dispatch Report",
          columns: courierDispatchColumns,
          data: courierDispatchResult.data?.data,
          isLoading: courierDispatchResult.isLoading,
          meta: courierDispatchResult.data?.meta,
        };
      case "user-incentive":
        return {
          title: "User Incentive Report",
          columns: agentOrderColumns,
          data: userIncentiveResult.data?.data,
          isLoading: userIncentiveResult.isLoading,
          meta: userIncentiveResult.data?.meta,
        };
      case "booked-product-value":
        return {
          title: "Booked Product Value Report",
          columns: productUnitColumns,
          data: bookedProductValueResult.data?.data,
          isLoading: bookedProductValueResult.isLoading,
          meta: bookedProductValueResult.data?.meta,
        };
      default:
        return null;
    }
  };

  const reportProps = getReportProps();

  return (
    <>
      <Grid container spacing={2}>
        {orderReports.map((report) => (
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
