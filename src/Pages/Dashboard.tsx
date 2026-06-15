import { UserButton, useUser } from "@clerk/clerk-react";

export default function Dashboard() {
  const { user } = useUser();

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", padding: "1rem" }}>
        <h1>Dashboard</h1>
        <UserButton />
      </div>
      <p>Welcome, {user?.firstName}! 👋</p>
    </div>
  );
}