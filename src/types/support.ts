import type { ListApiResponse, GetApiResponse } from "./common";

// ============ Enums as Const Objects ============

export const FeedbackCategory = {
  feature: "feature",
  module: "module",
  general: "general",
  ui_ux: "ui_ux",
  performance: "performance",
} as const;
export type FeedbackCategory =
  (typeof FeedbackCategory)[keyof typeof FeedbackCategory];

export const SupportCaseStatus = {
  open: "open",
  in_progress: "in_progress",
  pending_info: "pending_info",
  resolved: "resolved",
  closed: "closed",
} as const;
export type SupportCaseStatus =
  (typeof SupportCaseStatus)[keyof typeof SupportCaseStatus];

export const SupportCasePriority = {
  low: "low",
  medium: "medium",
  high: "high",
  critical: "critical",
} as const;
export type SupportCasePriority =
  (typeof SupportCasePriority)[keyof typeof SupportCasePriority];

export const FeatureRequestStatus = {
  submitted: "submitted",
  under_review: "under_review",
  planned: "planned",
  in_development: "in_development",
  completed: "completed",
  rejected: "rejected",
} as const;
export type FeatureRequestStatus =
  (typeof FeatureRequestStatus)[keyof typeof FeatureRequestStatus];

export const FileType = {
  image: "image",
  audio: "audio",
  video: "video",
} as const;
export type FileType = (typeof FileType)[keyof typeof FileType];

// ============ Entities ============

export interface Feedback {
  id: string;
  tenantId: string;
  userId: number;
  userEmail: string;
  userPhone: string | null;
  stars: number;
  description: string;
  category: FeedbackCategory;
  createdAt: string;
  updatedAt: string;
}

export interface FeedbackStats {
  total: number;
  averageStars: number | null;
  byCategory: {
    category: FeedbackCategory;
    _count: number;
  }[];
}

export interface Attachment {
  id: string;
  fileName: string;
  fileType: FileType;
  mimeType: string;
  fileSize: number;
  downloadUrl?: string;
}

export interface AttachmentUploadInfo {
  uploadUrl: string;
  key: string;
  metadata: {
    fileName: string;
    fileType: FileType;
    mimeType: string;
    fileSize: number;
  };
}

export interface SupportCase {
  id: string;
  tenantId: string;
  userId: number;
  userEmail: string;
  userPhone: string | null;
  title: string;
  description: string;
  priority: SupportCasePriority;
  status: SupportCaseStatus;
  adminNotes: string | null;
  resolvedAt: string | null;
  createdAt: string;
  updatedAt: string;
  attachments: Attachment[];
}

export interface FeatureRequest {
  id: string;
  tenantId: string;
  userId: number;
  userEmail: string;
  userPhone: string | null;
  title: string;
  description: string;
  status: FeatureRequestStatus;
  adminNotes: string | null;
  createdAt: string;
  updatedAt: string;
  attachments: Attachment[];
}

// ============ API Response Types ============

export type FeedbackListResponse = ListApiResponse<Feedback>;
export type FeedbackResponse = GetApiResponse<Feedback>;
export type FeedbackStatsResponse = GetApiResponse<FeedbackStats>;
export type SupportCaseListResponse = ListApiResponse<SupportCase>;
export type SupportCaseResponse = GetApiResponse<SupportCase>;
export type FeatureRequestListResponse = ListApiResponse<FeatureRequest>;
export type FeatureRequestResponse = GetApiResponse<FeatureRequest>;

export interface CreateWithAttachmentsResponse<T> {
  data: T;
  attachmentUploadUrls: AttachmentUploadInfo[];
}

// ============ Request DTOs ============

export interface CreateFeedbackDto {
  stars: number;
  description: string;
  category: FeedbackCategory;
}

export interface ListFeedbackDto {
  skip?: number;
  take?: number;
  category?: FeedbackCategory;
  stars?: number;
}

export interface CreateAttachmentMetadataDto {
  fileName: string;
  fileType: FileType;
  mimeType: string;
  fileSize: number;
}

export interface CreateSupportCaseDto {
  title: string;
  description: string;
  priority?: SupportCasePriority;
  attachments?: CreateAttachmentMetadataDto[];
}

export interface ListSupportCasesDto {
  skip?: number;
  take?: number;
  status?: SupportCaseStatus;
  priority?: SupportCasePriority;
  title?: string;
}

export interface ConfirmAttachmentUploadDto {
  key: string;
  fileName: string;
  fileType: FileType;
  mimeType: string;
  fileSize: number;
}

export interface ConfirmAttachmentsBodyDto {
  attachments: ConfirmAttachmentUploadDto[];
}

export interface CreateFeatureRequestDto {
  title: string;
  description: string;
  attachments?: CreateAttachmentMetadataDto[];
}

export interface ListFeatureRequestsDto {
  skip?: number;
  take?: number;
  status?: FeatureRequestStatus;
  title?: string;
}
