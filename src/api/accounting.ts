import { api } from "@/api/index";
import type {
  AccountListResponse,
  AccountResponse,
  FiscalPeriodListResponse,
  FiscalPeriodResponse,
  JournalEntryListResponse,
  JournalEntryResponse,
  InvoiceListResponse,
  InvoiceResponse,
  BillListResponse,
  BillResponse,
  PaymentListResponse,
  PaymentResponse,
  CodRemittanceListResponse,
  CodRemittanceResponse,
  TaxRateListResponse,
  TaxRateResponse,
  TrialBalanceResponse,
  AccountBalanceResponse,
  LedgerResponse,
  AccountQueryDto,
  CreateAccountDto,
  UpdateAccountDto,
  BalanceQueryParams,
  CreateFiscalPeriodDto,
  UpdateFiscalPeriodDto,
  JournalQueryDto,
  CreateJournalEntryDto,
  InvoiceQueryDto,
  CreateInvoiceDto,
  UpdateInvoiceDto,
  BillQueryDto,
  CreateBillDto,
  UpdateBillDto,
  PaymentQueryDto,
  CreatePaymentDto,
  CodRemittanceQueryDto,
  CreateCodRemittanceDto,
  UpdateCodRemittanceStatusDto,
  CreateTaxRateDto,
  UpdateTaxRateDto,
  PaymentSummary,
  Account,
  JournalEntry,
  Invoice,
  Bill,
  PaymentRecord,
  CodRemittance,
  TaxRate,
} from "@/types/accounting";
import type { GetApiResponse } from "@/types/common";

export const accountingApi = api.injectEndpoints({
  endpoints: (build) => ({
    // ============ Chart of Accounts ============
    listAccounts: build.query<AccountListResponse, AccountQueryDto | void>({
      query: (params) => ({
        url: "accounting/account",
        params: params || undefined,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map((a: Account) => ({
                type: "accounts" as const,
                id: a.id,
              })),
              { type: "accounts", id: "LIST" },
            ]
          : [{ type: "accounts", id: "LIST" }],
    }),
    initializeAccounts: build.query<AccountListResponse, void>({
      query: () => "accounting/account/initialize",
      providesTags: [{ type: "accounts", id: "LIST" }],
    }),
    getAccount: build.query<AccountResponse, number>({
      query: (id) => `accounting/account/${id}`,
      providesTags: (_result, _error, id) => [{ type: "accounts", id }],
    }),
    getAccountBalance: build.query<
      AccountBalanceResponse,
      { id: number; params?: BalanceQueryParams }
    >({
      query: ({ id, params }) => ({
        url: `accounting/account/${id}/balance`,
        params,
      }),
      providesTags: (_result, _error, { id }) => [
        { type: "accounts", id: `balance-${id}` },
      ],
    }),
    createAccount: build.mutation<AccountResponse, CreateAccountDto>({
      query: (body) => ({
        url: "accounting/account/create",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "accounts", id: "LIST" }],
    }),
    updateAccount: build.mutation<
      AccountResponse,
      { id: number; body: UpdateAccountDto }
    >({
      query: ({ id, body }) => ({
        url: `accounting/account/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "accounts", id },
        { type: "accounts", id: "LIST" },
      ],
    }),
    deleteAccount: build.mutation<void, number>({
      query: (id) => ({
        url: `accounting/account/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "accounts", id: "LIST" }],
    }),

    // ============ Fiscal Periods ============
    listFiscalPeriods: build.query<FiscalPeriodListResponse, void>({
      query: () => "accounting/fiscal-period",
      providesTags: [{ type: "fiscal-periods", id: "LIST" }],
    }),
    getCurrentFiscalPeriod: build.query<FiscalPeriodResponse, void>({
      query: () => "accounting/fiscal-period/current",
      providesTags: [{ type: "fiscal-periods", id: "CURRENT" }],
    }),
    getFiscalPeriod: build.query<FiscalPeriodResponse, number>({
      query: (id) => `accounting/fiscal-period/${id}`,
      providesTags: (_result, _error, id) => [{ type: "fiscal-periods", id }],
    }),
    createFiscalPeriod: build.mutation<
      FiscalPeriodResponse,
      CreateFiscalPeriodDto
    >({
      query: (body) => ({
        url: "accounting/fiscal-period/create",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "fiscal-periods", id: "LIST" }],
    }),
    updateFiscalPeriod: build.mutation<
      FiscalPeriodResponse,
      { id: number; body: UpdateFiscalPeriodDto }
    >({
      query: ({ id, body }) => ({
        url: `accounting/fiscal-period/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "fiscal-periods", id },
        { type: "fiscal-periods", id: "LIST" },
      ],
    }),
    closeFiscalPeriod: build.mutation<FiscalPeriodResponse, number>({
      query: (id) => ({
        url: `accounting/fiscal-period/${id}/close`,
        method: "PATCH",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "fiscal-periods", id },
        { type: "fiscal-periods", id: "LIST" },
        { type: "fiscal-periods", id: "CURRENT" },
      ],
    }),
    reopenFiscalPeriod: build.mutation<FiscalPeriodResponse, number>({
      query: (id) => ({
        url: `accounting/fiscal-period/${id}/reopen`,
        method: "PATCH",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "fiscal-periods", id },
        { type: "fiscal-periods", id: "LIST" },
        { type: "fiscal-periods", id: "CURRENT" },
      ],
    }),

    // ============ Journal Entries ============
    listJournalEntries: build.query<
      JournalEntryListResponse,
      JournalQueryDto | void
    >({
      query: (params) => ({
        url: "accounting/journal",
        params: params || undefined,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map((j: JournalEntry) => ({
                type: "journal-entries" as const,
                id: j.id,
              })),
              { type: "journal-entries", id: "LIST" },
            ]
          : [{ type: "journal-entries", id: "LIST" }],
    }),
    getTrialBalance: build.query<TrialBalanceResponse, { asOfDate?: string } | void>({
      query: (params) => ({
        url: "accounting/journal/trial-balance",
        params: params || undefined,
      }),
      providesTags: [{ type: "journal-entries", id: "TRIAL_BALANCE" }],
    }),
    getAccountLedger: build.query<
      LedgerResponse,
      { accountId: number; params?: BalanceQueryParams }
    >({
      query: ({ accountId, params }) => ({
        url: `accounting/journal/ledger/${accountId}`,
        params,
      }),
      providesTags: (_result, _error, { accountId }) => [
        { type: "journal-entries", id: `ledger-${accountId}` },
      ],
    }),
    getJournalEntry: build.query<JournalEntryResponse, number>({
      query: (id) => `accounting/journal/${id}`,
      providesTags: (_result, _error, id) => [{ type: "journal-entries", id }],
    }),
    createJournalEntry: build.mutation<
      JournalEntryResponse,
      CreateJournalEntryDto
    >({
      query: (body) => ({
        url: "accounting/journal/create",
        method: "POST",
        body,
      }),
      invalidatesTags: [
        { type: "journal-entries", id: "LIST" },
        { type: "journal-entries", id: "TRIAL_BALANCE" },
      ],
    }),
    postJournalEntry: build.mutation<JournalEntryResponse, number>({
      query: (id) => ({
        url: `accounting/journal/${id}/post`,
        method: "PATCH",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "journal-entries", id },
        { type: "journal-entries", id: "LIST" },
        { type: "journal-entries", id: "TRIAL_BALANCE" },
        "accounts",
      ],
    }),
    reverseJournalEntry: build.mutation<JournalEntryResponse, number>({
      query: (id) => ({
        url: `accounting/journal/${id}/reverse`,
        method: "PATCH",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "journal-entries", id },
        { type: "journal-entries", id: "LIST" },
        { type: "journal-entries", id: "TRIAL_BALANCE" },
        "accounts",
      ],
    }),
    deleteJournalEntry: build.mutation<void, number>({
      query: (id) => ({
        url: `accounting/journal/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "journal-entries", id: "LIST" }],
    }),

    // ============ Invoices ============
    listInvoices: build.query<InvoiceListResponse, InvoiceQueryDto | void>({
      query: (params) => ({
        url: "accounting/invoice",
        params: params || undefined,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map((i: Invoice) => ({
                type: "invoices" as const,
                id: i.id,
              })),
              { type: "invoices", id: "LIST" },
            ]
          : [{ type: "invoices", id: "LIST" }],
    }),
    getInvoice: build.query<InvoiceResponse, number>({
      query: (id) => `accounting/invoice/${id}`,
      providesTags: (_result, _error, id) => [{ type: "invoices", id }],
    }),
    createInvoice: build.mutation<InvoiceResponse, CreateInvoiceDto>({
      query: (body) => ({
        url: "accounting/invoice/create",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "invoices", id: "LIST" }],
    }),
    createInvoiceFromOrder: build.mutation<InvoiceResponse, number>({
      query: (orderId) => ({
        url: `accounting/invoice/from-order/${orderId}`,
        method: "POST",
      }),
      invalidatesTags: [{ type: "invoices", id: "LIST" }],
    }),
    updateInvoice: build.mutation<
      InvoiceResponse,
      { id: number; body: UpdateInvoiceDto }
    >({
      query: ({ id, body }) => ({
        url: `accounting/invoice/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "invoices", id },
        { type: "invoices", id: "LIST" },
      ],
    }),
    sendInvoice: build.mutation<InvoiceResponse, number>({
      query: (id) => ({
        url: `accounting/invoice/${id}/send`,
        method: "PATCH",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "invoices", id },
        { type: "invoices", id: "LIST" },
      ],
    }),
    cancelInvoice: build.mutation<InvoiceResponse, number>({
      query: (id) => ({
        url: `accounting/invoice/${id}/cancel`,
        method: "PATCH",
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: "invoices", id },
        { type: "invoices", id: "LIST" },
      ],
    }),
    deleteInvoice: build.mutation<void, number>({
      query: (id) => ({
        url: `accounting/invoice/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "invoices", id: "LIST" }],
    }),

    // ============ Bills ============
    listBills: build.query<BillListResponse, BillQueryDto | void>({
      query: (params) => ({
        url: "accounting/bill",
        params: params || undefined,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map((b: Bill) => ({
                type: "bills" as const,
                id: b.id,
              })),
              { type: "bills", id: "LIST" },
            ]
          : [{ type: "bills", id: "LIST" }],
    }),
    getBill: build.query<BillResponse, number>({
      query: (id) => `accounting/bill/${id}`,
      providesTags: (_result, _error, id) => [{ type: "bills", id }],
    }),
    createBill: build.mutation<BillResponse, CreateBillDto>({
      query: (body) => ({
        url: "accounting/bill/create",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "bills", id: "LIST" }],
    }),
    createBillFromPurchaseOrder: build.mutation<BillResponse, number>({
      query: (purchaseOrderId) => ({
        url: `accounting/bill/from-purchase-order/${purchaseOrderId}`,
        method: "POST",
      }),
      invalidatesTags: [{ type: "bills", id: "LIST" }],
    }),
    updateBill: build.mutation<BillResponse, { id: number; body: UpdateBillDto }>({
      query: ({ id, body }) => ({
        url: `accounting/bill/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "bills", id },
        { type: "bills", id: "LIST" },
      ],
    }),
    deleteBill: build.mutation<void, number>({
      query: (id) => ({
        url: `accounting/bill/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "bills", id: "LIST" }],
    }),

    // ============ Payments ============
    listPayments: build.query<PaymentListResponse, PaymentQueryDto | void>({
      query: (params) => ({
        url: "accounting/payment",
        params: params || undefined,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map((p: PaymentRecord) => ({
                type: "payments" as const,
                id: p.id,
              })),
              { type: "payments", id: "LIST" },
            ]
          : [{ type: "payments", id: "LIST" }],
    }),
    getPaymentSummary: build.query<GetApiResponse<PaymentSummary>, PaymentQueryDto | void>({
      query: (params) => ({
        url: "accounting/payment/summary",
        params: params || undefined,
      }),
      providesTags: [{ type: "payments", id: "SUMMARY" }],
    }),
    getPaymentsByInvoice: build.query<PaymentListResponse, number>({
      query: (invoiceId) => `accounting/payment/invoice/${invoiceId}`,
      providesTags: (_result, _error, invoiceId) => [
        { type: "payments", id: `invoice-${invoiceId}` },
      ],
    }),
    getPaymentsByBill: build.query<PaymentListResponse, number>({
      query: (billId) => `accounting/payment/bill/${billId}`,
      providesTags: (_result, _error, billId) => [
        { type: "payments", id: `bill-${billId}` },
      ],
    }),
    getPaymentsByOrder: build.query<PaymentListResponse, number>({
      query: (orderId) => `accounting/payment/order/${orderId}`,
      providesTags: (_result, _error, orderId) => [
        { type: "payments", id: `order-${orderId}` },
      ],
    }),
    getPayment: build.query<PaymentResponse, number>({
      query: (id) => `accounting/payment/${id}`,
      providesTags: (_result, _error, id) => [{ type: "payments", id }],
    }),
    createPayment: build.mutation<PaymentResponse, CreatePaymentDto>({
      query: (body) => ({
        url: "accounting/payment/create",
        method: "POST",
        body,
      }),
      invalidatesTags: [
        { type: "payments", id: "LIST" },
        { type: "payments", id: "SUMMARY" },
        "invoices",
        "bills",
      ],
    }),

    // ============ COD Remittance ============
    listCodRemittances: build.query<
      CodRemittanceListResponse,
      CodRemittanceQueryDto | void
    >({
      query: (params) => ({
        url: "accounting/cod-remittance",
        params: params || undefined,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map((c: CodRemittance) => ({
                type: "cod-remittances" as const,
                id: c.id,
              })),
              { type: "cod-remittances", id: "LIST" },
            ]
          : [{ type: "cod-remittances", id: "LIST" }],
    }),
    getCodRemittanceSummary: build.query<
      GetApiResponse<{ totalPending: number; totalReceived: number; totalReconciled: number }>,
      CodRemittanceQueryDto | void
    >({
      query: (params) => ({
        url: "accounting/cod-remittance/summary",
        params: params || undefined,
      }),
      providesTags: [{ type: "cod-remittances", id: "SUMMARY" }],
    }),
    getCodRemittanceByOrder: build.query<CodRemittanceResponse, number>({
      query: (orderId) => `accounting/cod-remittance/order/${orderId}`,
      providesTags: (_result, _error, orderId) => [
        { type: "cod-remittances", id: `order-${orderId}` },
      ],
    }),
    getCodRemittance: build.query<CodRemittanceResponse, number>({
      query: (id) => `accounting/cod-remittance/${id}`,
      providesTags: (_result, _error, id) => [{ type: "cod-remittances", id }],
    }),
    createCodRemittance: build.mutation<
      CodRemittanceResponse,
      CreateCodRemittanceDto
    >({
      query: (body) => ({
        url: "accounting/cod-remittance/create",
        method: "POST",
        body,
      }),
      invalidatesTags: [
        { type: "cod-remittances", id: "LIST" },
        { type: "cod-remittances", id: "SUMMARY" },
      ],
    }),
    updateCodRemittanceStatus: build.mutation<
      CodRemittanceResponse,
      { id: number; body: UpdateCodRemittanceStatusDto }
    >({
      query: ({ id, body }) => ({
        url: `accounting/cod-remittance/${id}/status`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "cod-remittances", id },
        { type: "cod-remittances", id: "LIST" },
        { type: "cod-remittances", id: "SUMMARY" },
      ],
    }),
    deleteCodRemittance: build.mutation<void, number>({
      query: (id) => ({
        url: `accounting/cod-remittance/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [
        { type: "cod-remittances", id: "LIST" },
        { type: "cod-remittances", id: "SUMMARY" },
      ],
    }),

    // ============ Tax Rates ============
    listTaxRates: build.query<TaxRateListResponse, void>({
      query: () => "accounting/tax-rate",
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map((t: TaxRate) => ({
                type: "tax-rates" as const,
                id: t.id,
              })),
              { type: "tax-rates", id: "LIST" },
            ]
          : [{ type: "tax-rates", id: "LIST" }],
    }),
    getTaxRate: build.query<TaxRateResponse, number>({
      query: (id) => `accounting/tax-rate/${id}`,
      providesTags: (_result, _error, id) => [{ type: "tax-rates", id }],
    }),
    createTaxRate: build.mutation<TaxRateResponse, CreateTaxRateDto>({
      query: (body) => ({
        url: "accounting/tax-rate/create",
        method: "POST",
        body,
      }),
      invalidatesTags: [{ type: "tax-rates", id: "LIST" }],
    }),
    updateTaxRate: build.mutation<
      TaxRateResponse,
      { id: number; body: UpdateTaxRateDto }
    >({
      query: ({ id, body }) => ({
        url: `accounting/tax-rate/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "tax-rates", id },
        { type: "tax-rates", id: "LIST" },
      ],
    }),
    deleteTaxRate: build.mutation<void, number>({
      query: (id) => ({
        url: `accounting/tax-rate/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [{ type: "tax-rates", id: "LIST" }],
    }),
    calculateTax: build.query<
      GetApiResponse<{ amount: number; taxAmount: number; total: number }>,
      { amount: number; taxRateId: number }
    >({
      query: ({ amount, taxRateId }) =>
        `accounting/tax-rate/calculate/${amount}/${taxRateId}`,
    }),
  }),
});

export const {
  // Accounts
  useListAccountsQuery,
  useLazyListAccountsQuery,
  useInitializeAccountsQuery,
  useLazyInitializeAccountsQuery,
  useGetAccountQuery,
  useGetAccountBalanceQuery,
  useCreateAccountMutation,
  useUpdateAccountMutation,
  useDeleteAccountMutation,
  // Fiscal Periods
  useListFiscalPeriodsQuery,
  useGetCurrentFiscalPeriodQuery,
  useGetFiscalPeriodQuery,
  useCreateFiscalPeriodMutation,
  useUpdateFiscalPeriodMutation,
  useCloseFiscalPeriodMutation,
  useReopenFiscalPeriodMutation,
  // Journal Entries
  useListJournalEntriesQuery,
  useLazyListJournalEntriesQuery,
  useGetTrialBalanceQuery,
  useLazyGetTrialBalanceQuery,
  useGetAccountLedgerQuery,
  useGetJournalEntryQuery,
  useCreateJournalEntryMutation,
  usePostJournalEntryMutation,
  useReverseJournalEntryMutation,
  useDeleteJournalEntryMutation,
  // Invoices
  useListInvoicesQuery,
  useLazyListInvoicesQuery,
  useGetInvoiceQuery,
  useCreateInvoiceMutation,
  useCreateInvoiceFromOrderMutation,
  useUpdateInvoiceMutation,
  useSendInvoiceMutation,
  useCancelInvoiceMutation,
  useDeleteInvoiceMutation,
  // Bills
  useListBillsQuery,
  useLazyListBillsQuery,
  useGetBillQuery,
  useCreateBillMutation,
  useCreateBillFromPurchaseOrderMutation,
  useUpdateBillMutation,
  useDeleteBillMutation,
  // Payments
  useListPaymentsQuery,
  useLazyListPaymentsQuery,
  useGetPaymentSummaryQuery,
  useGetPaymentsByInvoiceQuery,
  useGetPaymentsByBillQuery,
  useGetPaymentsByOrderQuery,
  useGetPaymentQuery,
  useCreatePaymentMutation,
  // COD Remittance
  useListCodRemittancesQuery,
  useLazyListCodRemittancesQuery,
  useGetCodRemittanceSummaryQuery,
  useGetCodRemittanceByOrderQuery,
  useGetCodRemittanceQuery,
  useCreateCodRemittanceMutation,
  useUpdateCodRemittanceStatusMutation,
  useDeleteCodRemittanceMutation,
  // Tax Rates
  useListTaxRatesQuery,
  useGetTaxRateQuery,
  useCreateTaxRateMutation,
  useUpdateTaxRateMutation,
  useDeleteTaxRateMutation,
  useCalculateTaxQuery,
  useLazyCalculateTaxQuery,
} = accountingApi;
