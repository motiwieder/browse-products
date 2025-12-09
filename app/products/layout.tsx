import Header from "@/components/Header";

/**
 * Products section layout.
 * Provides consistent Header navigation across all product pages.
 */
export default function ProductsLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}

