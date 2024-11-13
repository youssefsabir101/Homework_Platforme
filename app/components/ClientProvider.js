"use client"; // Mark this as a Client Component

import { SessionProvider } from "next-auth/react";

export default function ClientProvider({ children }) {
  return <SessionProvider>{children}</SessionProvider>;
}
