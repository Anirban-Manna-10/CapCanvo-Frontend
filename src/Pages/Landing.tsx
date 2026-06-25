import { SignInButton, SignedIn, SignedOut } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>Welcome to CapCanvo</h1>
      <p>Real-time collaborative canvas</p>

      <SignedOut>
        <SignInButton mode="modal">
          <button>Sign In</button>
        </SignInButton>
      </SignedOut>

      <SignedIn>
        <button onClick={() => navigate("/dashboard")}>
          Go to Dashboard
        </button>
      </SignedIn>
    </div>
  );
}