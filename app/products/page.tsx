import Link from "next/link";
import { createPublicClient } from "@/lib/supabase/public";
import ProductCard from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export const revalidate = 60;

export const metadata = {
  title: "Products - TeeWorld",
};

interface ProductsPageProps {
  searchParams: { sort?: string; q?: string; page?: string };
}

const PAGE_SIZE = 24;

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const sort = searchParams.sort || "new";
  const query = searchParams.q || "";
  const pageNum = Math.max(1, parseInt(searchParams.page || "1", 10));
  const offset = (pageNum - 1) * PAGE_SIZE;

  const supabase = createPublicClient();

  let dbQuery = supabase.from("products").select("*", { count: "exact" }).eq("status", "active");

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

  const { data: products, count } = await dbQuery.range(offset, offset + PAGE_SIZE - 1).limit(PAGE_SIZE);

  const totalPages = count ? Math.ceil(count / PAGE_SIZE) : 0;
  const hasPrev = pageNum > 1;
  const hasNext = pageNum < totalPages;

  const buildHref = (p: number) => {
    const params = new URLSearchParams();
    if (sort && sort !== "new") params.set("sort", sort);
    if (query) params.set("q", query);
    if (p > 1) params.set("page", p.toString());
    return `/products${params.toString() ? `?${params.toString()}` : ""}`;
  };

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
            {count ?? 0} products available
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
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-10">
              <Link href={buildHref(pageNum - 1)}>
                <Button variant="outline" size="sm" disabled={!hasPrev}>
                  <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                </Button>
              </Link>
              <span className="text-sm text-muted-foreground">
                Page {pageNum} of {totalPages}
              </span>
              <Link href={buildHref(pageNum + 1)}>
                <Button variant="outline" size="sm" disabled={!hasNext}>
                  Next <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </Link>
            </div>
          )}
        </>
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
