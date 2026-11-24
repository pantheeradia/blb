"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function AdminLogout() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogout() {
    if (loading) return;
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/login", { method: "DELETE" });
      if (!response.ok) throw new Error("Sign out failed");
      router.push("/admin/login");
      router.refresh();
    } catch {
      setError("Could not sign out. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div>
    <button
      onClick={handleLogout}
      disabled={loading}
      aria-busy={loading}
      className="block w-full text-left px-3 py-2 text-xs text-gray-500 hover:text-red-400 transition-colors"
    >
      {loading ? "Signing out..." : "Sign out"}
    </button>
    {error && <p role="alert" className="px-3 text-xs text-red-400">{error}</p>}
    </div>
  );
}
