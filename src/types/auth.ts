import type { RequestResponse } from "./common";

export interface LoginRequestBody {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface LoginRequestResponse extends RequestResponse {
  access_token: string;
  refresh_token: string;
}

export interface RefreshTokenRequestBody {
  refreshToken: string;
}

export interface RefreshTokenRequestResponse extends RequestResponse {
  access_token: string;
  refresh_token: string;
}
