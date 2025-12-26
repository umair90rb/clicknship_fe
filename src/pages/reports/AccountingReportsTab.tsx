import { useState } from "react";
import { Grid } from "@mui/material";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ReceiptIcon from "@mui/icons-material/Receipt";
import LocalAtmIcon from "@mui/icons-material/LocalAtm";
import PaymentIcon from "@mui/icons-material/Payment";
import ReportCard from "./ReportCard";
import ReportViewerModal, { type ReportColumn } from "./ReportViewerModal";
import {
  useLazyGetRevenueReportQuery,
  useLazyGetProfitSummaryReportQuery,
  useLazyGetInvoiceAgingReportQuery,
  useLazyGetCodRemittanceReportQuery,
  useLazyGetPaymentReportQuery,
} from "@/api/reports";
import type {
  RevenueReportRow,
  ProfitSummaryReportRow,
  InvoiceAgingReportRow,
  CodRemittanceReportRow,
  PaymentReportRow,
} from "@/types/reports";
import { formatDateRangeForApi, getDefaultDateRange } from "@/components/form/FormDateRangePicker";

interface ApiDateRange {
  start?: string;
  end?: string;
}

type ReportType =
  | "revenue"
  | "profit-summary"
  | "invoice-aging"
  | "cod-remittance"
  | "payment"
  | null;

const revenueColumns: ReportColumn<RevenueReportRow>[] = [
  { id: "period", header: "Period" },
  { id: "grossRevenue", header: "Gross Revenue", align: "right", format: "currency" },
  { id: "discounts", header: "Discounts", align: "right", format: "currency" },
  { id: "shippingCharges", header: "Shipping", align: "right", format: "currency" },
  { id: "taxes", header: "Taxes", align: "right", format: "currency" },
  { id: "netRevenue", header: "Net Revenue", align: "right", format: "currency" },
  { id: "orderCount", header: "Orders", align: "right", format: "number" },
];

const profitSummaryColumns: ReportColumn<ProfitSummaryReportRow>[] = [
  { id: "period", header: "Period" },
  { id: "grossRevenue", header: "Gross Revenue", align: "right", format: "currency" },
  { id: "cogs", header: "COGS", align: "right", format: "currency" },
  { id: "grossProfit", header: "Gross Profit", align: "right", format: "currency" },
  { id: "shippingIncome", header: "Shipping Income", align: "right", format: "currency" },
  { id: "courierCosts", header: "Courier Costs", align: "right", format: "currency" },
  { id: "netProfit", header: "Net Profit", align: "right", format: "currency" },
  { id: "profitMargin", header: "Margin", align: "right", format: "percent" },
];

const invoiceAgingColumns: ReportColumn<InvoiceAgingReportRow>[] = [
  { id: "customerName", header: "Customer" },
  { id: "currentAmount", header: "Current", align: "right", format: "currency" },
  { id: "bucket30", header: "1-30 Days", align: "right", format: "currency" },
  { id: "bucket60", header: "31-60 Days", align: "right", format: "currency" },
  { id: "bucket90", header: "61-90 Days", align: "right", format: "currency" },
  { id: "bucket120Plus", header: "90+ Days", align: "right", format: "currency" },
  { id: "totalOutstanding", header: "Total Outstanding", align: "right", format: "currency" },
];

const codRemittanceColumns: ReportColumn<CodRemittanceReportRow>[] = [
  { id: "courierName", header: "Courier" },
  { id: "totalOrders", header: "Total Orders", align: "right", format: "number" },
  { id: "grossAmount", header: "Gross Amount", align: "right", format: "currency" },
  { id: "courierCharges", header: "Courier Charges", align: "right", format: "currency" },
  { id: "netAmount", header: "Net Amount", align: "right", format: "currency" },
  { id: "pendingCount", header: "Pending", align: "right", format: "number" },
  { id: "receivedCount", header: "Received", align: "right", format: "number" },
  { id: "reconciledCount", header: "Reconciled", align: "right", format: "number" },
];

const paymentColumns: ReportColumn<PaymentReportRow>[] = [
  { id: "paymentNumber", header: "Payment #" },
  { id: "type", header: "Type" },
  { id: "method", header: "Method" },
  { id: "amount", header: "Amount", align: "right", format: "currency" },
  { id: "date", header: "Date", format: "date" },
  { id: "transactionRef", header: "Reference" },
];

const accountingReports = [
  {
    id: "revenue" as const,
    title: "Revenue Report",
    description: "Revenue breakdown by period",
    Icon: AttachMoneyIcon,
  },
  {
    id: "profit-summary" as const,
    title: "Profit Summary",
    description: "Profit and loss analysis with margins",
    Icon: TrendingUpIcon,
  },
  {
    id: "invoice-aging" as const,
    title: "Invoice Aging Report",
    description: "Outstanding invoices by age bucket",
    Icon: ReceiptIcon,
  },
  {
    id: "cod-remittance" as const,
    title: "COD Remittance Report",
    description: "Cash on delivery collection status",
    Icon: LocalAtmIcon,
  },
  {
    id: "payment" as const,
    title: "Payment Report",
    description: "All payments with transaction details",
    Icon: PaymentIcon,
  },
];

export default function AccountingReportsTab() {
  const [activeReport, setActiveReport] = useState<ReportType>(null);
  const [dateRange, setDateRange] = useState<ApiDateRange>(() => formatDateRangeForApi(getDefaultDateRange()));

  const [getRevenue, revenueResult] = useLazyGetRevenueReportQuery();
  const [getProfitSummary, profitSummaryResult] = useLazyGetProfitSummaryReportQuery();
  const [getInvoiceAging, invoiceAgingResult] = useLazyGetInvoiceAgingReportQuery();
  const [getCodRemittance, codRemittanceResult] = useLazyGetCodRemittanceReportQuery();
  const [getPayment, paymentResult] = useLazyGetPaymentReportQuery();

  const handleOpenReport = (reportId: ReportType) => {
    setActiveReport(reportId);

    switch (reportId) {
      case "revenue":
        getRevenue({ dateRange });
        break;
      case "profit-summary":
        getProfitSummary({ dateRange });
        break;
      case "invoice-aging":
        getInvoiceAging({});
        break;
      case "cod-remittance":
        getCodRemittance({ dateRange });
        break;
      case "payment":
        getPayment({ dateRange });
        break;
    }
  };

  const handleDateRangeChange = (range: { start?: string; end?: string }) => {
    setDateRange(range);
    if (activeReport) {
      switch (activeReport) {
        case "revenue":
          getRevenue({ dateRange: range });
          break;
        case "profit-summary":
          getProfitSummary({ dateRange: range });
          break;
        case "cod-remittance":
          getCodRemittance({ dateRange: range });
          break;
        case "payment":
          getPayment({ dateRange: range });
          break;
      }
    }
  };

  const getReportProps = () => {
    switch (activeReport) {
      case "revenue":
        return {
          title: "Revenue Report",
          columns: revenueColumns,
          data: revenueResult.data?.data,
          isLoading: revenueResult.isLoading,
          meta: revenueResult.data?.meta,
          showDateFilter: true,
        };
      case "profit-summary":
        return {
          title: "Profit Summary Report",
          columns: profitSummaryColumns,
          data: profitSummaryResult.data?.data,
          isLoading: profitSummaryResult.isLoading,
          meta: profitSummaryResult.data?.meta,
          showDateFilter: true,
        };
      case "invoice-aging":
        return {
          title: "Invoice Aging Report",
          columns: invoiceAgingColumns,
          data: invoiceAgingResult.data?.data,
          isLoading: invoiceAgingResult.isLoading,
          meta: invoiceAgingResult.data?.meta,
          showDateFilter: false,
        };
      case "cod-remittance":
        return {
          title: "COD Remittance Report",
          columns: codRemittanceColumns,
          data: codRemittanceResult.data?.data,
          isLoading: codRemittanceResult.isLoading,
          meta: codRemittanceResult.data?.meta,
          showDateFilter: true,
        };
      case "payment":
        return {
          title: "Payment Report",
          columns: paymentColumns,
          data: paymentResult.data?.data,
          isLoading: paymentResult.isLoading,
          meta: paymentResult.data?.meta,
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
        {accountingReports.map((report) => (
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
