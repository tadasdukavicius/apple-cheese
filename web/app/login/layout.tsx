import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Prisijungimas",
  robots: { index: false, follow: true },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
