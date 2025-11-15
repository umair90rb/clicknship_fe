export interface Role {
  id: number;
  name: string;
  permissions: Permission[];
}

export interface Permission {
  resource: string;
  actions: string[];
}

export type CreateRoleRequestBody = Omit<Role, "id">;
