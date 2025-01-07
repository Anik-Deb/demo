import Header from "@/app/(site)/_components/Header";
import "../../../globals.css";
import Footer from "@/app/(site)/_components/Footer";

export default function SlugLayout({
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
