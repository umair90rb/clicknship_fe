import type { ListApiResponse, GetApiResponse } from "./common";
import type { Product } from "./products";
import type { Supplier } from "./inventory";

// ============ Enums as Const Objects ============

export const AccountType = {
  ASSET: "ASSET",
  LIABILITY: "LIABILITY",
  EQUITY: "EQUITY",
  REVENUE: "REVENUE",
  EXPENSE: "EXPENSE",
} as const;
export type AccountType = (typeof AccountType)[keyof typeof AccountType];

export const AccountSubType = {
  // Assets
  CASH: "CASH",
  BANK: "BANK",
  ACCOUNTS_RECEIVABLE: "ACCOUNTS_RECEIVABLE",
  INVENTORY: "INVENTORY",
  PREPAID_EXPENSE: "PREPAID_EXPENSE",
  FIXED_ASSET: "FIXED_ASSET",
  // Liabilities
  ACCOUNTS_PAYABLE: "ACCOUNTS_PAYABLE",
  TAX_PAYABLE: "TAX_PAYABLE",
  ACCRUED_EXPENSE: "ACCRUED_EXPENSE",
  // Equity
  OWNERS_EQUITY: "OWNERS_EQUITY",
  RETAINED_EARNINGS: "RETAINED_EARNINGS",
  // Revenue
  SALES: "SALES",
  SHIPPING_REVENUE: "SHIPPING_REVENUE",
  OTHER_INCOME: "OTHER_INCOME",
  // Expenses
  COGS: "COGS",
  SHIPPING_EXPENSE: "SHIPPING_EXPENSE",
  COURIER_CHARGES: "COURIER_CHARGES",
  OPERATING_EXPENSE: "OPERATING_EXPENSE",
  SALES_RETURNS: "SALES_RETURNS",
} as const;
export type AccountSubType =
  (typeof AccountSubType)[keyof typeof AccountSubType];

export const JournalEntryStatus = {
  DRAFT: "DRAFT",
  POSTED: "POSTED",
  REVERSED: "REVERSED",
} as const;
export type JournalEntryStatus =
  (typeof JournalEntryStatus)[keyof typeof JournalEntryStatus];

export const JournalReferenceType = {
  ORDER: "ORDER",
  PAYMENT: "PAYMENT",
  REFUND: "REFUND",
  PURCHASE: "PURCHASE",
  ADJUSTMENT: "ADJUSTMENT",
  COD_REMITTANCE: "COD_REMITTANCE",
} as const;
export type JournalReferenceType =
  (typeof JournalReferenceType)[keyof typeof JournalReferenceType];

export const FiscalPeriodStatus = {
  OPEN: "OPEN",
  CLOSED: "CLOSED",
} as const;
export type FiscalPeriodStatus =
  (typeof FiscalPeriodStatus)[keyof typeof FiscalPeriodStatus];

export const InvoiceStatus = {
  DRAFT: "DRAFT",
  SENT: "SENT",
  PARTIAL: "PARTIAL",
  PAID: "PAID",
  OVERDUE: "OVERDUE",
  CANCELLED: "CANCELLED",
} as const;
export type InvoiceStatus = (typeof InvoiceStatus)[keyof typeof InvoiceStatus];

export const BillStatus = {
  DRAFT: "DRAFT",
  PENDING: "PENDING",
  PARTIAL: "PARTIAL",
  PAID: "PAID",
  OVERDUE: "OVERDUE",
} as const;
export type BillStatus = (typeof BillStatus)[keyof typeof BillStatus];

export const PaymentType = {
  RECEIPT: "RECEIPT",
  DISBURSEMENT: "DISBURSEMENT",
  REFUND: "REFUND",
  COD_REMITTANCE: "COD_REMITTANCE",
} as const;
export type PaymentType = (typeof PaymentType)[keyof typeof PaymentType];

export const PaymentMethod = {
  CASH: "CASH",
  BANK_TRANSFER: "BANK_TRANSFER",
  COD: "COD",
  CARD: "CARD",
  WALLET: "WALLET",
  CHEQUE: "CHEQUE",
} as const;
export type PaymentMethod = (typeof PaymentMethod)[keyof typeof PaymentMethod];

export const CodRemittanceStatus = {
  PENDING: "PENDING",
  RECEIVED: "RECEIVED",
  RECONCILED: "RECONCILED",
  DISPUTED: "DISPUTED",
} as const;
export type CodRemittanceStatus =
  (typeof CodRemittanceStatus)[keyof typeof CodRemittanceStatus];

// ============ Entities ============

export interface Account {
  id: number;
  code: string;
  name: string;
  type: AccountType;
  subType: AccountSubType | null;
  description: string | null;
  isSystemAccount: boolean;
  active: boolean;
  parentId: number | null;
  parent?: Account;
  children?: Account[];
}

export interface FiscalPeriod {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  status: FiscalPeriodStatus;
  closedAt: string | null;
}

export interface JournalEntryLine {
  id: number;
  debit: number;
  credit: number;
  memo: string | null;
  journalEntryId: number;
  accountId: number;
  account?: Account;
}

export interface JournalEntry {
  id: number;
  entryNumber: string;
  date: string;
  description: string | null;
  referenceType: JournalReferenceType | null;
  referenceId: number | null;
  status: JournalEntryStatus;
  createdAt: string;
  postedAt: string | null;
  fiscalPeriodId: number | null;
  reversedEntryId: number | null;
  userId: number | null;
  lines?: JournalEntryLine[];
}

export interface Customer {
  id: number;
  name: string;
  email: string | null;
  phone: string | null;
  address: string | null;
}

export interface InvoiceItem {
  id: number;
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate: number;
  taxAmount: number;
  lineTotal: number;
  invoiceId: number;
  productId: number | null;
  product?: Product;
}

export interface Invoice {
  id: number;
  invoiceNumber: string;
  issueDate: string;
  dueDate: string | null;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  paidAmount: number;
  status: InvoiceStatus;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  customerId: number | null;
  orderId: number | null;
  customer?: Customer;
  items?: InvoiceItem[];
}

export interface BillItem {
  id: number;
  description: string;
  quantity: number;
  unitPrice: number;
  lineTotal: number;
  billId: number;
  accountId: number | null;
  account?: Account;
}

export interface Bill {
  id: number;
  billNumber: string;
  issueDate: string;
  dueDate: string | null;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  paidAmount: number;
  status: BillStatus;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  supplierId: number | null;
  purchaseOrderId: number | null;
  supplier?: Supplier;
  items?: BillItem[];
}

export interface PaymentRecord {
  id: number;
  paymentNumber: string;
  type: PaymentType;
  method: PaymentMethod;
  amount: number;
  date: string;
  bankAccount: string | null;
  transactionRef: string | null;
  notes: string | null;
  createdAt: string;
  invoiceId: number | null;
  billId: number | null;
  orderId: number | null;
  codRemittanceId: number | null;
  userId: number | null;
}

export interface CodRemittanceItem {
  id: number;
  cn: string;
  amount: number;
  courierCharge: number;
  codRemittanceId: number;
  orderId: number;
}

export interface CodRemittance {
  id: number;
  remittanceNumber: string;
  statementDate: string;
  totalOrders: number;
  grossAmount: number;
  courierCharges: number;
  netAmount: number;
  status: CodRemittanceStatus;
  receivedDate: string | null;
  bankReference: string | null;
  notes: string | null;
  createdAt: string;
  courierServiceId: number;
  userId: number | null;
  items?: CodRemittanceItem[];
}

export interface TaxRate {
  id: number;
  name: string;
  rate: number;
  active: boolean;
  accountId: number | null;
}

export interface TrialBalanceRow {
  accountId: number;
  accountCode: string;
  accountName: string;
  accountType: AccountType;
  debit: number;
  credit: number;
}

export interface AccountBalance {
  accountId: number;
  balance: number;
  debitTotal: number;
  creditTotal: number;
}

export interface LedgerEntry {
  date: string;
  entryNumber: string;
  description: string | null;
  debit: number;
  credit: number;
  balance: number;
}

// ============ API Response Types ============

export type AccountListResponse = ListApiResponse<Account>;
export type AccountResponse = GetApiResponse<Account>;
export type FiscalPeriodListResponse = ListApiResponse<FiscalPeriod>;
export type FiscalPeriodResponse = GetApiResponse<FiscalPeriod>;
export type JournalEntryListResponse = ListApiResponse<JournalEntry>;
export type JournalEntryResponse = GetApiResponse<JournalEntry>;
export type InvoiceListResponse = ListApiResponse<Invoice>;
export type InvoiceResponse = GetApiResponse<Invoice>;
export type BillListResponse = ListApiResponse<Bill>;
export type BillResponse = GetApiResponse<Bill>;
export type PaymentListResponse = ListApiResponse<PaymentRecord>;
export type PaymentResponse = GetApiResponse<PaymentRecord>;
export type CodRemittanceListResponse = ListApiResponse<CodRemittance>;
export type CodRemittanceResponse = GetApiResponse<CodRemittance>;
export type TaxRateListResponse = ListApiResponse<TaxRate>;
export type TaxRateResponse = GetApiResponse<TaxRate>;
export type TrialBalanceResponse = GetApiResponse<TrialBalanceRow[]>;
export type AccountBalanceResponse = GetApiResponse<AccountBalance>;
export type LedgerResponse = GetApiResponse<LedgerEntry[]>;

// ============ Request DTOs ============

export interface AccountQueryDto {
  type?: AccountType;
  activeOnly?: boolean;
}

export interface CreateAccountDto {
  code: string;
  name: string;
  type: AccountType;
  subType?: AccountSubType;
  description?: string;
  parentId?: number;
}

export interface UpdateAccountDto {
  code?: string;
  name?: string;
  type?: AccountType;
  subType?: AccountSubType;
  description?: string;
  parentId?: number;
  active?: boolean;
}

export interface BalanceQueryParams {
  fromDate?: string;
  toDate?: string;
}

export interface CreateFiscalPeriodDto {
  name: string;
  startDate: string;
  endDate: string;
}

export interface UpdateFiscalPeriodDto {
  name?: string;
  startDate?: string;
  endDate?: string;
}

export interface JournalQueryDto {
  fromDate?: string;
  toDate?: string;
  accountId?: number;
  referenceType?: JournalReferenceType;
  limit?: number;
  offset?: number;
}

export interface JournalEntryLineDto {
  accountId: number;
  debit: number;
  credit: number;
  memo?: string;
}

export interface CreateJournalEntryDto {
  date: string;
  description?: string;
  referenceType?: JournalReferenceType;
  referenceId?: number;
  lines: JournalEntryLineDto[];
}

export interface InvoiceQueryDto {
  status?: InvoiceStatus;
  customerId?: number;
  fromDate?: string;
  toDate?: string;
}

export interface InvoiceItemDto {
  description: string;
  quantity: number;
  unitPrice: number;
  taxRate?: number;
  productId?: number;
}

export interface CreateInvoiceDto {
  customerId?: number;
  orderId?: number;
  issueDate: string;
  dueDate?: string;
  notes?: string;
  items: InvoiceItemDto[];
}

export interface UpdateInvoiceDto {
  customerId?: number;
  issueDate?: string;
  dueDate?: string;
  notes?: string;
  items?: InvoiceItemDto[];
}

export interface BillQueryDto {
  status?: BillStatus;
  supplierId?: number;
  fromDate?: string;
  toDate?: string;
}

export interface BillItemDto {
  description: string;
  quantity: number;
  unitPrice: number;
  accountId?: number;
}

export interface CreateBillDto {
  supplierId?: number;
  purchaseOrderId?: number;
  issueDate: string;
  dueDate?: string;
  notes?: string;
  items: BillItemDto[];
}

export interface UpdateBillDto {
  supplierId?: number;
  issueDate?: string;
  dueDate?: string;
  notes?: string;
  items?: BillItemDto[];
}

export interface PaymentQueryDto {
  type?: PaymentType;
  fromDate?: string;
  toDate?: string;
}

export interface CreatePaymentDto {
  type: PaymentType;
  method: PaymentMethod;
  amount: number;
  date: string;
  invoiceId?: number;
  billId?: number;
  orderId?: number;
  bankAccount?: string;
  transactionRef?: string;
  notes?: string;
}

export interface CodRemittanceQueryDto {
  status?: CodRemittanceStatus;
  courierServiceId?: number;
  fromDate?: string;
  toDate?: string;
}

export interface CodRemittanceItemDto {
  orderId: number;
  cn: string;
  amount: number;
  courierCharge: number;
}

export interface CreateCodRemittanceDto {
  courierServiceId: number;
  statementDate: string;
  bankReference?: string;
  notes?: string;
  items: CodRemittanceItemDto[];
}

export interface UpdateCodRemittanceStatusDto {
  status: CodRemittanceStatus;
}

export interface CreateTaxRateDto {
  name: string;
  rate: number;
  accountId?: number;
}

export interface UpdateTaxRateDto {
  name?: string;
  rate?: number;
  accountId?: number;
  active?: boolean;
}

export interface PaymentSummary {
  totalReceipts: number;
  totalDisbursements: number;
  totalRefunds: number;
  netCashFlow: number;
}
