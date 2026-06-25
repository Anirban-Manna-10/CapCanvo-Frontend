import { apiClient } from "../lib/apiClient";

const baseUrl = "/api/users";

export interface SyncUserParams {
  email: string;
  displayName: string|null;
  avatarUrl: string;
}

export const UserService = {
  syncUser: (params: SyncUserParams) => apiClient.post(`${baseUrl}/sync`, params),
};