import type { ListApiResponse, GetApiResponse } from "./common";

// ============ Enums as Const Objects ============

export const TransactionType = {
  credit: "credit",
  debit: "debit",
} as const;
export type TransactionType =
  (typeof TransactionType)[keyof typeof TransactionType];

export const TransactionReason = {
  order_charge: "order_charge",
  recharge: "recharge",
  manual_adjustment: "manual_adjustment",
  refund: "refund",
} as const;
export type TransactionReason =
  (typeof TransactionReason)[keyof typeof TransactionReason];

export const BillingPaymentMethod = {
  bank_transfer: "bank_transfer",
  alfapay: "alfapay",
  jazzcash: "jazzcash",
  easypaisa: "easypaisa",
} as const;
export type BillingPaymentMethod =
  (typeof BillingPaymentMethod)[keyof typeof BillingPaymentMethod];

export const PaymentStatus = {
  pending: "pending",
  processing: "processing",
  completed: "completed",
  failed: "failed",
  cancelled: "cancelled",
} as const;
export type PaymentStatus = (typeof PaymentStatus)[keyof typeof PaymentStatus];

// ============ Entities ============

export interface TenantBilling {
  id: string;
  tenantId: string;
  currentBalance: number;
  negativeLimit: number;
  totalCredits: number;
  totalDebits: number;
  isBlocked: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BillingTransaction {
  id: string;
  tenantId: string;
  type: TransactionType;
  amount: number;
  balanceBefore: number;
  balanceAfter: number;
  reason: string;
  referenceType: string | null;
  referenceId: string | null;
  paymentMethod: string | null;
  paymentStatus: string | null;
  metadata: Record<string, unknown> | null;
  createdAt: string;
}

export interface PaymentRequest {
  id: string;
  tenantId: string;
  amount: number;
  paymentMethod: BillingPaymentMethod;
  status: PaymentStatus;
  gatewayRef: string | null;
  gatewayResponse: Record<string, unknown> | null;
  screenshotUrl: string | null;
  screenshotKey: string | null;
  adminNotes: string | null;
  processedBy: string | null;
  processedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BankDetail {
  id: string;
  bankName: string;
  accountName: string;
  accountNumber: string;
  iban: string | null;
  branchCode: string | null;
  branchName: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface BillingBalance {
  currentBalance: number;
  negativeLimit: number;
  isBlocked: boolean;
  totalCredits: number;
  totalDebits: number;
}

export interface RechargeInitiateResponse {
  success: boolean;
  paymentRequestId: string;
  redirectUrl?: string;
}

export interface UploadUrlResponse {
  uploadUrl: string;
  key: string;
}

// ============ API Response Types ============

export type BillingBalanceResponse = GetApiResponse<BillingBalance>;
export type TransactionListResponse = ListApiResponse<BillingTransaction>;
export type BankDetailListResponse = GetApiResponse<BankDetail[]>;
export type BankDetailResponse = GetApiResponse<BankDetail>;

// ============ Request DTOs ============

export interface ListTransactionsDto {
  skip?: number;
  take?: number;
  type?: TransactionType;
  reason?: string;
  paymentMethod?: BillingPaymentMethod;
}

export interface InitiateRechargeDto {
  amount: number;
  paymentMethod: BillingPaymentMethod;
  customerEmail?: string;
  customerPhone?: string;
}

export interface BankTransferRechargeDto {
  amount: number;
  screenshotKey: string;
  notes?: string;
}
