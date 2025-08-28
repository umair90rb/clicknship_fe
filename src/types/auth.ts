import type { RequestResponse } from "./common";

export interface LoginRequestBody {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface LoginRequestResponse extends RequestResponse {
  access_token: string
}