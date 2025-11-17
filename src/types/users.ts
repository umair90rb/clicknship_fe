import type { ListApiResponse } from "./common";
import type { Role } from "./role";

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  role: Omit<Role, "permissions">;
}

export type ListUserApiResponse = ListApiResponse<User>;
