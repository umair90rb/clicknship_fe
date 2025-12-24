import { api } from "@/api/index";
import type {
  BillingBalanceResponse,
  TransactionListResponse,
  BankDetailListResponse,
  ListTransactionsDto,
  InitiateRechargeDto,
  BankTransferRechargeDto,
  RechargeInitiateResponse,
  UploadUrlResponse,
  BillingTransaction,
} from "@/types/billing";
import type { GetApiResponse } from "@/types/common";

export const billingApi = api.injectEndpoints({
  endpoints: (build) => ({
    // ============ Tenant Billing (User) ============
    getBillingBalance: build.query<BillingBalanceResponse, void>({
      query: () => "billing/balance",
      providesTags: ["billing-balance"],
    }),
    listTransactions: build.query<TransactionListResponse, ListTransactionsDto>({
      query: (body) => ({
        url: "billing/transactions",
        method: "POST",
        body,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map((t: BillingTransaction) => ({
                type: "billing-transactions" as const,
                id: t.id,
              })),
              { type: "billing-transactions", id: "LIST" },
            ]
          : [{ type: "billing-transactions", id: "LIST" }],
    }),
    getBankDetails: build.query<BankDetailListResponse, void>({
      query: () => "billing/bank-details",
      providesTags: ["bank-details"],
    }),

    // ============ Recharge ============
    initiateRecharge: build.mutation<
      GetApiResponse<RechargeInitiateResponse>,
      InitiateRechargeDto
    >({
      query: (body) => ({
        url: "billing/recharge/initiate",
        method: "POST",
        body,
      }),
    }),
    submitBankTransfer: build.mutation<
      GetApiResponse<{ success: boolean; message: string }>,
      BankTransferRechargeDto
    >({
      query: (body) => ({
        url: "billing/recharge/bank-transfer",
        method: "POST",
        body,
      }),
      invalidatesTags: ["billing-balance", "billing-transactions"],
    }),
    getRechargeUploadUrl: build.mutation<GetApiResponse<UploadUrlResponse>, void>({
      query: () => ({
        url: "billing/recharge/upload-url",
        method: "POST",
      }),
    }),
  }),
});

export const {
  useGetBillingBalanceQuery,
  useLazyGetBillingBalanceQuery,
  useListTransactionsQuery,
  useLazyListTransactionsQuery,
  useGetBankDetailsQuery,
  useInitiateRechargeMutation,
  useSubmitBankTransferMutation,
  useGetRechargeUploadUrlMutation,
} = billingApi;
