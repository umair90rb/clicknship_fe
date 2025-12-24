import { api } from "@/api/index";
import type {
  FeedbackListResponse,
  FeedbackResponse,
  FeedbackStatsResponse,
  SupportCaseListResponse,
  SupportCaseResponse,
  FeatureRequestListResponse,
  FeatureRequestResponse,
  CreateWithAttachmentsResponse,
  CreateFeedbackDto,
  ListFeedbackDto,
  CreateSupportCaseDto,
  ListSupportCasesDto,
  ConfirmAttachmentsBodyDto,
  CreateFeatureRequestDto,
  ListFeatureRequestsDto,
  Feedback,
  SupportCase,
  FeatureRequest,
} from "@/types/support";

export const supportApi = api.injectEndpoints({
  endpoints: (build) => ({
    // ============ Feedback ============
    createFeedback: build.mutation<FeedbackResponse, CreateFeedbackDto>({
      query: (body) => ({
        url: "support/feedback/create",
        method: "POST",
        body,
      }),
      invalidatesTags: ["feedback"],
    }),
    listFeedback: build.query<FeedbackListResponse, ListFeedbackDto>({
      query: (body) => ({
        url: "support/feedback/list",
        method: "POST",
        body,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map((f: Feedback) => ({
                type: "feedback" as const,
                id: f.id,
              })),
              { type: "feedback", id: "LIST" },
            ]
          : [{ type: "feedback", id: "LIST" }],
    }),
    getFeedbackStats: build.query<FeedbackStatsResponse, void>({
      query: () => "support/feedback/stats",
      providesTags: [{ type: "feedback", id: "STATS" }],
    }),

    // ============ Support Cases ============
    createSupportCase: build.mutation<
      CreateWithAttachmentsResponse<SupportCase>,
      CreateSupportCaseDto
    >({
      query: (body) => ({
        url: "support/cases/create",
        method: "POST",
        body,
      }),
      invalidatesTags: ["support-cases"],
    }),
    confirmSupportCaseAttachments: build.mutation<
      SupportCaseResponse,
      { id: string; body: ConfirmAttachmentsBodyDto }
    >({
      query: ({ id, body }) => ({
        url: `support/cases/${id}/confirm-attachments`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "support-cases", id },
      ],
    }),
    getSupportCase: build.query<SupportCaseResponse, string>({
      query: (id) => `support/cases/${id}`,
      providesTags: (_result, _error, id) => [{ type: "support-cases", id }],
    }),
    listSupportCases: build.query<SupportCaseListResponse, ListSupportCasesDto>({
      query: (body) => ({
        url: "support/cases/list",
        method: "POST",
        body,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map((c: SupportCase) => ({
                type: "support-cases" as const,
                id: c.id,
              })),
              { type: "support-cases", id: "LIST" },
            ]
          : [{ type: "support-cases", id: "LIST" }],
    }),

    // ============ Feature Requests ============
    createFeatureRequest: build.mutation<
      CreateWithAttachmentsResponse<FeatureRequest>,
      CreateFeatureRequestDto
    >({
      query: (body) => ({
        url: "support/feature-requests/create",
        method: "POST",
        body,
      }),
      invalidatesTags: ["feature-requests"],
    }),
    confirmFeatureRequestAttachments: build.mutation<
      FeatureRequestResponse,
      { id: string; body: ConfirmAttachmentsBodyDto }
    >({
      query: ({ id, body }) => ({
        url: `support/feature-requests/${id}/confirm-attachments`,
        method: "POST",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "feature-requests", id },
      ],
    }),
    getFeatureRequest: build.query<FeatureRequestResponse, string>({
      query: (id) => `support/feature-requests/${id}`,
      providesTags: (_result, _error, id) => [{ type: "feature-requests", id }],
    }),
    listFeatureRequests: build.query<
      FeatureRequestListResponse,
      ListFeatureRequestsDto
    >({
      query: (body) => ({
        url: "support/feature-requests/list",
        method: "POST",
        body,
      }),
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map((r: FeatureRequest) => ({
                type: "feature-requests" as const,
                id: r.id,
              })),
              { type: "feature-requests", id: "LIST" },
            ]
          : [{ type: "feature-requests", id: "LIST" }],
    }),
  }),
});

export const {
  // Feedback
  useCreateFeedbackMutation,
  useListFeedbackQuery,
  useLazyListFeedbackQuery,
  useGetFeedbackStatsQuery,
  // Support Cases
  useCreateSupportCaseMutation,
  useConfirmSupportCaseAttachmentsMutation,
  useGetSupportCaseQuery,
  useListSupportCasesQuery,
  useLazyListSupportCasesQuery,
  // Feature Requests
  useCreateFeatureRequestMutation,
  useConfirmFeatureRequestAttachmentsMutation,
  useGetFeatureRequestQuery,
  useListFeatureRequestsQuery,
  useLazyListFeatureRequestsQuery,
} = supportApi;
