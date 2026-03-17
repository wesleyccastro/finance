import React from "react";
import { useAuth } from "@/context/AuthContext";
import { AuthNavigator } from "@/navigation/AuthNavigator";
import { AppNavigator } from "@/navigation/AppNavigator";

export function RootNavigator() {
  const { user } = useAuth();

  if (user) {
    return <AppNavigator />;
  }

  return <AuthNavigator />;
}
