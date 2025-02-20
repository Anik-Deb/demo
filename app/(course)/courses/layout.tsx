import type { Metadata } from "next";
import "../../globals.css";
import Header from "@/app/(site)/_components/Header";
import Footer from "@/app/(site)/_components/Footer";

export const metadata: Metadata = {
  title: "Prayogik",
  description: "Welcome to prayogik.com",
};

export default function CourseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Header />
      {children}
      <Footer />
    </div>
  );
}
