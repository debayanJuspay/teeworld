import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import ProductCard from "@/components/product-card";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Products - TeeWorld",
};

interface ProductsPageProps {
  searchParams: { sort?: string; q?: string };
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const sort = searchParams.sort || "new";
  const query = searchParams.q || "";

  const supabase = createClient();

  let dbQuery = supabase.from("products").select("*").eq("status", "active");

  if (query) {
    dbQuery = dbQuery.ilike("title", `%${query}%`);
  }

  if (sort === "new") {
    dbQuery = dbQuery.order("created_at", { ascending: false });
  } else if (sort === "price_low") {
    dbQuery = dbQuery.order("price", { ascending: true });
  } else if (sort === "price_high") {
    dbQuery = dbQuery.order("price", { ascending: false });
  } else if (sort === "sale") {
    dbQuery = dbQuery.not("original_price", "is", null).gt("original_price", 0);
  }

  const { data: products } = await dbQuery;

  const sortOptions = [
    { label: "Newest", value: "new", href: "/products?sort=new" },
    { label: "Price: Low to High", value: "price_low", href: "/products?sort=price_low" },
    { label: "Price: High to Low", value: "price_high", href: "/products?sort=price_high" },
    { label: "On Sale", value: "sale", href: "/products?sort=sale" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">All Products</h1>
          <p className="text-muted-foreground mt-1">
            {products?.length || 0} products available
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {sortOptions.map((option) => (
            <Link key={option.value} href={option.href}>
              <Button
                variant={sort === option.value ? "default" : "outline"}
                size="sm"
              >
                {option.label}
              </Button>
            </Link>
          ))}
        </div>
      </div>

      {products && products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <p className="text-muted-foreground text-lg">No products found.</p>
          <p className="text-sm text-muted-foreground mt-1">
            Check back later or browse our other collections.
          </p>
        </div>
      )}
    </div>
  );
}
