import { UserButton, useUser } from "@clerk/clerk-react";
import { useApiClient } from "../lib/apiClient";
import { useEffect, useState } from "react";
import { UserService } from "../Services/UserService";

export default function Dashboard() {
  const { user } = useUser();
  const api = useApiClient();
  const [synced, setSynced] = useState(false);

  useEffect(() => {
    if (!user) return;

    UserService.syncUser(user.id, user.primaryEmailAddress?.emailAddress ?? "", user.fullName ?? "",user.imageUrl ?? "" ).then(() => setSynced(true));
  }, [user]);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", padding: "1rem" }}>
        <h1>Dashboard</h1>
        <UserButton />
      </div>
      <p>Welcome, {user?.firstName}! 👋</p>
      <p>User synced: {synced ? "✅" : "Syncing..."}</p>
    </div>
    // <Button onclick={() => }>Create</Button>
   );
}
