import type { Metadata } from "next";
import { LivePageClient } from "@/components/live/live-page-client";

export const metadata: Metadata = {
  title: "Live Match Center",
  description: "Real-time IPL scores via Cricket Data API when configured.",
};

export default function LivePage() {
  return <LivePageClient />;
}
