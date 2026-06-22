import { useApiClient } from "../lib/apiClient";

const api = useApiClient();
const baseUrl = '/api/users';
export const UserService = {
    syncUser: (clerkId: string, email: string, displayName: string, avatarUrl: string) => 
        api.post(`${baseUrl}/sync`, {clerkId, email, displayName, avatarUrl})
};