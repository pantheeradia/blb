import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Nav } from "@/components/layout/Nav";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/layout/CartDrawer";
import { ProductDetail } from "@/components/shop/ProductDetail";
import { getProductBySlug, getAllProducts } from "@/lib/products";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const all = await getAllProducts();
  return all.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};
  return {
    title: `${product.name} - Bean Leaf Brew`,
    description: product.shortDescription,
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  return (
    <>
      <Nav />
      <CartDrawer />
      <main className="min-h-screen bg-[#F7F0E6] pt-20">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <Suspense fallback={<div className="text-sm text-[#8B5E3C]">Loading...</div>}>
            <ProductDetail product={product} />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}
