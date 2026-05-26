import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Truck, RotateCcw, Shield } from "lucide-react";
import AddToCartButton from "@/components/add-to-cart-button";
import ProductImageGallery from "@/components/product-image-gallery";

interface ProductPageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: ProductPageProps) {
  const supabase = createClient();
  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", params.id)
    .single();

  return {
    title: product ? `${product.title} - TeeWorld` : "Product - TeeWorld",
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const supabase = createClient();

  const { data: product } = await supabase
    .from("products")
    .select("*")
    .eq("id", params.id)
    .single();

  if (!product) {
    notFound();
  }

  const sizes = product.sizes || ["S", "M", "L", "XL", "XXL"];
  const colors = product.colors || ["Black", "White", "Gray", "Navy"];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
      <Link
        href="/products"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Products
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Image */}
        <ProductImageGallery images={product.image_urls} title={product.title} />

        {/* Details */}
        <div className="space-y-6">
          <div>
            {product.original_price && product.original_price > product.price && (
              <Badge className="mb-2">Sale</Badge>
            )}
            <h1 className="text-3xl font-bold">{product.title}</h1>
            <div className="flex items-center gap-3 mt-3">
              <span className="text-2xl font-bold text-primary">
                ₹{product.price}
              </span>
              {product.original_price && product.original_price > product.price && (
                <span className="text-lg text-muted-foreground line-through">
                  ₹{product.original_price}
                </span>
              )}
            </div>
          </div>

          <p className="text-muted-foreground leading-relaxed">
            {product.description}
          </p>

          <AddToCartButton
            product={product}
            sizes={sizes}
            colors={colors}
          />

          {/* Trust badges */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t">
            <div className="flex flex-col items-center text-center gap-2">
              <Truck className="h-5 w-5 text-primary" />
              <span className="text-xs text-muted-foreground">Free Shipping</span>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <RotateCcw className="h-5 w-5 text-primary" />
              <span className="text-xs text-muted-foreground">Easy Returns</span>
            </div>
            <div className="flex flex-col items-center text-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              <span className="text-xs text-muted-foreground">Secure Payment</span>
            </div>
          </div>

          {/* Stock info */}
          <div className="text-sm">
            <span className="text-muted-foreground">Availability: </span>
            <span className={product.stock > 0 ? "text-green-600 font-medium" : "text-red-600 font-medium"}>
              {product.stock > 0 ? `In Stock (${product.stock} left)` : "Out of Stock"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
