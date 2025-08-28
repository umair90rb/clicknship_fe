import type { RequestResponse } from './common';

export interface OnboardRequestBody {
  email: string;
  password: string;
  companyName: string;
  name: string;
  phone: string;
}

export interface OnboardRequestResponse extends RequestResponse {
    tenantId: string;
}
