
import { useAuth } from "@clerk/clerk-react";
import { useEffect } from "react";
import { registerTokenGetter } from "../lib/apiClient";
import React from "react";

export default function AuthBridge({children }: {children: React.ReactNode}) {
  const { getToken } = useAuth();

  useEffect(() => {
    registerTokenGetter(() => getToken());
  }, [getToken]);

  return children;
}